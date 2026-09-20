# Agent-as-tool pattern

In the agent-as-tool pattern, one agent exposes a bounded capability to another through a tool-like contract. The caller supplies a task, waits for or tracks its result, and retains responsibility for the overall interaction. The specialist does not become the owner of the conversation.

Define input, output, permission scope, timeout, and resource budget as for an ordinary tool. A research specialist might receive a question and allowed sources, then return findings with evidence and unresolved questions. The coordinating agent decides whether those findings satisfy the user's goal.

[LangChain's subagent pattern](https://docs.langchain.com/oss/python/langchain/multi-agent/subagents) illustrates a central agent invoking specialists and receiving their results. A specialist can have separate instructions and context without receiving every message from the parent conversation.

Pass only the context needed for the subtask, including stable entity IDs and relevant constraints. Return structured outcomes where the caller must distinguish success, partial completion, and failure. Do not compress away source references needed to verify the result.

Delegation adds model calls and can amplify errors when the caller trusts an unsupported specialist summary. Prefer an ordinary deterministic tool for a fixed operation. Use an agent when the delegated capability needs judgment, several steps, or adaptive use of its own tools.
