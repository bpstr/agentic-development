// Educational application protocol. This is not a provider's API wire format.
export class AccessDeniedError extends Error {}

const errorMessages = {
  unknown_tool: "This tool is unavailable.",
  invalid_arguments: "The tool arguments are invalid.",
  access_denied: "The requested resource is unavailable.",
  tool_failed: "The tool could not complete the request.",
};

export async function runAgent({
  model, tools, identity, input, maxTurns = 4, maxToolCalls = 4, signal,
}) {
  if (typeof model !== "function" || typeof input !== "string") {
    throw new TypeError("Provide a model adapter and a string input.");
  }
  if (!Number.isInteger(maxTurns) || maxTurns < 1 ||
      !Number.isInteger(maxToolCalls) || maxToolCalls < 0) {
    throw new TypeError("Turn and tool-call limits must be bounded integers.");
  }
  if (!identity?.userId || !identity?.workspaceId ||
      typeof identity.userId !== "string" || typeof identity.workspaceId !== "string") {
    throw new TypeError("Provide trusted user and workspace identifiers.");
  }
  const actor = Object.freeze({ userId: identity.userId, workspaceId: identity.workspaceId });
  const registry = new Map(Object.entries(tools));
  for (const tool of registry.values()) {
    if (typeof tool.validate !== "function" || typeof tool.execute !== "function") {
      throw new TypeError("Each tool needs validate and execute functions.");
    }
  }
  const catalog = [...registry].map(([name, tool]) => ({
    name, description: tool.description, inputSchema: tool.inputSchema,
  }));
  const messages = [{ type: "user", text: input }];
  const seenCallIds = new Set();
  let modelTurns = 0;
  let toolCalls = 0;
  const finish = (status, output = null) => ({
    status, output, messages, usage: { modelTurns, toolCalls },
  });
  const failure = (call, code) => ({
    type: "tool_result", call_id: call.id, ok: false,
    error: { code, message: errorMessages[code] },
  });

  while (modelTurns < maxTurns) {
    if (signal?.aborted) return finish("cancelled");
    modelTurns++;
    let reply;
    try {
      reply = await model({
        messages: structuredClone(messages), tools: structuredClone(catalog), signal,
      });
    } catch {
      return finish(signal?.aborted ? "cancelled" : "model_failed");
    }
    if (signal?.aborted) return finish("cancelled");
    if (reply?.type === "final" && typeof reply.text === "string") {
      messages.push({ type: "assistant", text: reply.text });
      return finish("completed", reply.text);
    }
    if (reply?.type !== "tool_calls" || !Array.isArray(reply.calls) || !reply.calls.length) {
      return finish("invalid_model_output");
    }
    const batchIds = new Set();
    for (const call of reply.calls) {
      if (!call || typeof call.id !== "string" || !call.id ||
          typeof call.name !== "string" || typeof call.arguments !== "string" ||
          seenCallIds.has(call.id) || batchIds.has(call.id)) {
        return finish("invalid_model_output");
      }
      batchIds.add(call.id);
    }
    const calls = reply.calls.map(({ id, name, arguments: args }) => ({ id, name, arguments: args }));
    messages.push({ type: "tool_calls", calls });
    for (const call of calls) {
      if (signal?.aborted) return finish("cancelled");
      if (toolCalls >= maxToolCalls) return finish("tool_limit");
      toolCalls++; // Invalid and unknown calls also consume the attempt budget.
      seenCallIds.add(call.id);
      const tool = registry.get(call.name);
      if (!tool) {
        messages.push(failure(call, "unknown_tool"));
        continue;
      }
      let args;
      try {
        args = JSON.parse(call.arguments);
        if (tool.validate(args) !== true) throw new Error("invalid_arguments");
      } catch {
        messages.push(failure(call, "invalid_arguments"));
        continue;
      }
      if (signal?.aborted) return finish("cancelled");
      try {
        const data = await tool.execute(args, actor, { signal });
        messages.push({ type: "tool_result", call_id: call.id, ok: true, data });
      } catch (error) {
        const code = error instanceof AccessDeniedError ? "access_denied" : "tool_failed";
        messages.push(failure(call, code));
      }
    }
  }
  return finish(signal?.aborted ? "cancelled" : "turn_limit");
}
