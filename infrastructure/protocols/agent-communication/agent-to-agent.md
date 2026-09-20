# Agent-to-agent communication

Agent-to-agent communication exchanges work between independently executing agents or services. A caller sends a goal, relevant context, and constraints; the receiving agent owns how it performs the work and returns status or an artifact.

This differs from invoking a narrow function. “Read task 42” defines an operation; “investigate why this project is late and produce a report” delegates a goal that may require several operations.

## Define the boundary

An effective delegation identifies:

- The requested outcome and its acceptance conditions.
- The evidence and context the recipient may access.
- Deadline, cost, and permission limits.
- How the caller tracks progress, supplies missing input, and cancels.
- What constitutes a final artifact or a failed task.

For example, a support agent delegates incident analysis to a research service. The research service reads logs through its own tools and returns a report with sources. The support agent can inspect the result without inheriting the service's internal prompts or full execution history.

[A2A's comparison with MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/) explains this distinction between delegated agent work and exposed tool capabilities.

## Keep autonomy bounded

Delegation does not automatically transfer all the caller's permissions. Pass only the required evidence or a scoped capability. Authenticate the remote service and verify returned artifacts before applying them to product state.

Use task and correlation identities to distinguish a retry from a new request. A remote agent may continue after a client disconnect; define how cancellation and result retrieval work.

Shared in-process agents can communicate through ordinary function calls or framework state. A shared network protocol becomes useful when independently operated services need discovery, lifecycle tracking, and interoperable message exchange.
