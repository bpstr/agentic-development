# Agent memory

Agent memory preserves information so later model calls or runs can use it. The term covers several different mechanisms; naming the mechanism prevents confusing persistence with recall quality.

- **Conversation history** stores original messages and tool results.
- **Working state** records the active goal, selected entities, pending approvals, and completed steps.
- **Compacted context** summarizes earlier interaction to fit a bounded model request.
- **Durable memory** preserves selected knowledge across sessions.
- **Knowledge indexes** make external collections searchable.

A cache reuses prior computation and may support these mechanisms, but cache presence does not establish truth, freshness, or authorization.

For “continue with the same task,” working state should preserve the task's stable ID. A semantic memory search for a vaguely related task is an uncertain substitute. For a preference such as “use British spelling,” durable memory needs scope, origin, and a way to correct or remove it.

[LangGraph's memory documentation](https://docs.langchain.com/oss/python/langgraph/add-memory) distinguishes thread persistence from stores used across threads. These are useful concepts independently of that framework.

Persist original evidence separately from summaries and extracted facts. A summary is lossy, and an assistant's statement that an action succeeded is weaker evidence than its successful tool receipt. Retrieve exact source messages when wording or authorization matters.
