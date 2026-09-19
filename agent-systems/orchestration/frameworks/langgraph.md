# LangGraph

LangGraph is a stateful orchestration framework for explicit graph control flow, persistence, interruptions, and resumable execution. Nodes can contain deterministic work or model calls; edges express transitions and branches.

A graph is a control-flow representation, not evidence of greater intelligence. Use it when branching, joins, resumability, or explicit workflow state are clearer than a direct loop.

Its persistence model separates thread checkpoints from longer-term stores; in-memory checkpoint implementations do not survive process restart.

Official documentation: [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview) · [Persistence](https://docs.langchain.com/oss/python/langgraph/persistence).
