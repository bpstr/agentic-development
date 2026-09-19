# 05 · Orchestration and execution

[Handbook](../../README.md)

Orchestration is the code or managed runtime that decides what runs next, preserves progress, and handles interruptions.

## Contents

- [Introduction](introduction.md) — control flow, execution, persistence, and when orchestration is useful.
- Execution
  - [Agent loops](execution/agent-loops.md) — bounded direct execution.
  - [State and recovery](execution/state-and-recovery.md) — checkpoints, durable work, and side effects.
  - [Delegation and handoffs](execution/delegation.md) — specialist agents and ownership transfer.
- Frameworks and runtimes
  - [Framework overview](frameworks/README.md)
  - [LangChain](frameworks/langchain.md)
  - [LangGraph](frameworks/langgraph.md)
  - [LangSmith](frameworks/langsmith.md)
  - [OpenAI Agents SDK](frameworks/openai-agents-sdk.md)
  - [OpenAI Agents API](frameworks/openai-agents-api.md)
  - [Vercel AI SDK](frameworks/vercel-ai-sdk.md)
  - [Claude Managed Agents](frameworks/claude-managed-agents.md)

Start with one bounded loop and real application tools. Add framework machinery when a concrete requirement justifies it.
