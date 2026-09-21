# Google Agent Platform Memory Bank

Official documentation: [Memory Bank overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank), [API quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank/api-quickstart), and [memory generation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank/generate-memories).

Agent Platform Memory Bank is Google Cloud's managed long-term memory service for agents. It can derive persistent memories from user-agent interactions and retrieve those memories across sessions.

Memory Bank is different from RAG. RAG usually retrieves from an external knowledge corpus; Memory Bank stores selected information learned from interactions and evolves it over time. It is also distinct from the current session transcript: a session is chronological interaction state, while a memory is a selected reusable fact or summary.

The service can work with Agent Platform Sessions and can also be called through the Agent Platform SDK without requiring Google ADK to orchestrate it. Memories are isolated by scope and can be created, retrieved, updated through generation workflows, or removed according to the service API.

Applications should still define their own memory policy. Decide what categories are appropriate to retain, how identity maps to a memory scope, how deletion requests propagate, and which memories are safe to reintroduce into later context.

Google explicitly cautions that automatic memory generation should not be treated as a perfect sensitive-data filter. Apply application-level data classification and retention controls where personal or confidential data matters.

See [agent memory](../memory-definition.md), [long-term memory](../long-term-memory.md), and [memory lifecycle](../memory-lifecycle.md) for the provider-independent design concerns.
