import test from "node:test";
import assert from "node:assert/strict";
import { runAgent } from "./agent-loop.mjs";
import { createDemoModel, createTaskTools } from "./demo.mjs";

const identity = { userId: "user-a", workspaceId: "workspace-a" };
const input = "Look up TASK-1.";
const call = (overrides = {}) => ({
  id: "lookup-1", name: "get_task", arguments: '{"taskId":"TASK-1"}', ...overrides,
});
const batch = (...calls) => ({ type: "tool_calls", calls });
function scripted(...replies) {
  let index = 0;
  return async () => replies[index++];
}
function run(options = {}) {
  return runAgent({
    model: createDemoModel(), tools: createTaskTools(), identity, input, ...options,
  });
}
const resultMessages = (result) => result.messages.filter(({ type }) => type === "tool_result");
const endAfterError = { type: "final", text: "I could not complete the lookup." };

test("a successful lookup returns its result under the requested call ID", async () => {
  const requests = [];
  const demo = createDemoModel();
  const result = await run({ model: async (request) => {
    requests.push(request);
    return demo(request);
  } });
  assert.equal(result.status, "completed");
  assert.equal(result.output, "TASK-1: Review login flow — todo.");
  assert.deepEqual(result.usage, { modelTurns: 2, toolCalls: 1 });
  assert.deepEqual(requests[0].tools.map(({ name }) => name), ["get_task"]);
  const delivered = requests[1].messages.at(-1);
  assert.equal(delivered.call_id, "lookup-1");
  assert.equal(delivered.ok, true);
  assert.equal(delivered.data.id, "TASK-1");
});

test("invalid JSON and invalid schemas cannot reach the executor", async () => {
  for (const argumentsText of ["{broken", "null", "[]", '{"taskId":42}',
    '{"taskId":"TASK-1","workspaceId":"workspace-b"}']) {
    let executions = 0;
    const tools = createTaskTools();
    tools.get_task.execute = async () => { executions++; };
    const result = await run({ tools, model: scripted(
      batch(call({ arguments: argumentsText })), endAfterError,
    ) });
    assert.equal(executions, 0);
    assert.equal(resultMessages(result)[0].error.code, "invalid_arguments");
    assert.equal(resultMessages(result)[0].call_id, "lookup-1");
  }
});

test("unknown tools, including prototype names, never execute a registered tool", async () => {
  let executions = 0;
  const tools = createTaskTools();
  tools.get_task.execute = async () => { executions++; };
  const result = await run({ tools, model: scripted(
    batch(call({ name: "constructor" })), endAfterError,
  ) });
  assert.equal(executions, 0);
  assert.equal(resultMessages(result)[0].error.code, "unknown_tool");
});

test("cross-workspace and missing records return the same non-disclosing error", async () => {
  const errors = [];
  for (const taskId of ["TASK-2", "TASK-999"]) {
    const result = await run({ model: scripted(
      batch(call({ arguments: JSON.stringify({ taskId }) })), endAfterError,
    ) });
    errors.push(resultMessages(result)[0].error);
    assert.equal(resultMessages(result)[0].ok, false);
    assert.equal(JSON.stringify(result).includes("Private workspace B budget"), false);
    assert.equal(JSON.stringify(result).includes('"status":"done"'), false);
  }
  assert.deepEqual(errors[0], errors[1]);
  assert.equal(errors[0].code, "access_denied");
});

test("the task service also checks the user's workspace membership", async () => {
  const result = await run({
    identity: { userId: "user-b", workspaceId: "workspace-a" },
  });
  assert.equal(resultMessages(result)[0].error.code, "access_denied");
  assert.equal(result.output, "I could not retrieve that task.");
});

test("model turns are bounded even when each model reply requests another tool", async () => {
  let requests = 0;
  const result = await run({ maxTurns: 2, model: async () => {
    requests++;
    return batch(call({ id: `lookup-${requests}` }));
  } });
  assert.equal(result.status, "turn_limit");
  assert.equal(requests, 2);
  assert.deepEqual(result.usage, { modelTurns: 2, toolCalls: 2 });
  assert.equal(result.output, null);
});

test("tool-call budget stops a batch before the next executor runs", async () => {
  let executions = 0;
  const tools = createTaskTools();
  tools.get_task.execute = async () => ({ executions: ++executions });
  const result = await run({ tools, maxToolCalls: 1, model: scripted(
    batch(call(), call({ id: "lookup-2" })),
  ) });
  assert.equal(result.status, "tool_limit");
  assert.equal(executions, 1);
  assert.deepEqual(result.usage, { modelTurns: 1, toolCalls: 1 });
  assert.equal(resultMessages(result).length, 1);
});

test("invalid tool attempts consume the call budget", async () => {
  const result = await run({ maxToolCalls: 1, model: scripted(
    batch(call({ name: "unknown" }), call({ id: "lookup-2" })),
  ) });
  assert.equal(result.status, "tool_limit");
  assert.equal(resultMessages(result)[0].error.code, "unknown_tool");
  assert.equal(resultMessages(result).length, 1);
});

test("cancellation before the run performs no model call", async () => {
  const controller = new AbortController();
  controller.abort();
  let requests = 0;
  const result = await run({ signal: controller.signal, model: async () => { requests++; } });
  assert.equal(result.status, "cancelled");
  assert.equal(requests, 0);
  assert.deepEqual(result.usage, { modelTurns: 0, toolCalls: 0 });
});

test("cancellation after a model reply prevents all tool execution", async () => {
  const controller = new AbortController();
  let executions = 0;
  const tools = createTaskTools();
  tools.get_task.execute = async () => { executions++; };
  const result = await run({ tools, signal: controller.signal, model: async () => {
    controller.abort();
    return batch(call());
  } });
  assert.equal(result.status, "cancelled");
  assert.equal(executions, 0);
});

test("cancellation between tools preserves the first result and prevents the next tool", async () => {
  const controller = new AbortController();
  let executions = 0;
  const tools = createTaskTools();
  tools.get_task.execute = async () => {
    executions++;
    controller.abort();
    return { title: "First read completed" };
  };
  const result = await run({ tools, signal: controller.signal, model: scripted(
    batch(call(), call({ id: "lookup-2" })),
  ) });
  assert.equal(result.status, "cancelled");
  assert.equal(executions, 1);
  assert.equal(resultMessages(result)[0].data.title, "First read completed");
});

test("thrown tool errors are sanitized before returning to the model", async () => {
  const tools = createTaskTools();
  tools.get_task.execute = async () => { throw new Error("secret-token-123 in database URL"); };
  const result = await run({ tools });
  assert.equal(resultMessages(result)[0].error.code, "tool_failed");
  assert.equal(JSON.stringify(result).includes("secret-token-123"), false);
  assert.equal(JSON.stringify(result).includes("stack"), false);
});

test("reused tool-call IDs are rejected before duplicate execution", async () => {
  const result = await run({ model: scripted(batch(call()), batch(call())) });
  assert.equal(result.status, "invalid_model_output");
  assert.equal(resultMessages(result).length, 1);
  assert.equal(result.usage.toolCalls, 1);
});
