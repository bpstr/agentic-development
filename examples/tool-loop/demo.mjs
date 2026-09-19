import { pathToFileURL } from "node:url";
import { AccessDeniedError, runAgent } from "./agent-loop.mjs";

const tasks = [
  { id: "TASK-1", workspaceId: "workspace-a", title: "Review login flow", status: "todo" },
  { id: "TASK-2", workspaceId: "workspace-b", title: "Private workspace B budget", status: "done" },
];
const memberships = new Map([
  ["user-a", new Set(["workspace-a"])],
  ["user-b", new Set(["workspace-b"])],
]);

// This service enforces access even if the model asks for another tenant's task.
export function createTaskTools() {
  return {
    get_task: {
      description: "Read a task that the current user can access.",
      inputSchema: {
        type: "object", additionalProperties: false, required: ["taskId"],
        properties: { taskId: { type: "string", pattern: "^TASK-[0-9]+$" } },
      },
      validate(args) {
        return args !== null && typeof args === "object" && !Array.isArray(args) &&
          Object.keys(args).length === 1 && typeof args.taskId === "string" &&
          /^TASK-[0-9]+$/.test(args.taskId);
      },
      async execute({ taskId }, actor) {
        const task = tasks.find(({ id }) => id === taskId);
        if (!memberships.get(actor.userId)?.has(actor.workspaceId) ||
            !task || task.workspaceId !== actor.workspaceId) {
          throw new AccessDeniedError();
        }
        return { id: task.id, title: task.title, status: task.status };
      },
    },
  };
}

// Deterministic replies for teaching; no inference, credentials, or network.
export function createDemoModel() {
  return async ({ messages }) => {
    const latest = messages.at(-1);
    if (latest.type === "user") {
      return {
        type: "tool_calls",
        calls: [{ id: "lookup-1", name: "get_task", arguments: '{"taskId":"TASK-1"}' }],
      };
    }
    if (latest.type === "tool_result" && latest.ok) {
      const task = latest.data;
      return { type: "final", text: `${task.id}: ${task.title} — ${task.status}.` };
    }
    return { type: "final", text: "I could not retrieve that task." };
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await runAgent({
    model: createDemoModel(), tools: createTaskTools(),
    identity: { userId: "user-a", workspaceId: "workspace-a" },
    input: "What is the status of TASK-1?",
  });
  console.log("Offline demonstration: scripted replies, no provider API calls.");
  console.log(JSON.stringify(result, null, 2));
}
