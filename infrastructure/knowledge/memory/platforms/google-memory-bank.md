# Google Agent Platform Memory Bank

Official documentation: [Memory Bank overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank), [API quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank/api-quickstart), [memory generation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank/generate-memories), and [Agent Platform pricing](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing).

Agent Platform Memory Bank is Google Cloud's managed long-term memory service for agents. It can derive persistent memories from user-agent interactions and retrieve those memories across sessions.

Memory Bank is different from RAG. RAG usually retrieves from an external knowledge corpus; Memory Bank stores selected information learned from interactions and evolves it over time. It is also distinct from the current session transcript: a session is chronological interaction state, while a memory is a selected reusable fact or summary.

The service can work with Agent Platform Sessions and can also be called through the Agent Platform SDK without requiring Google ADK to orchestrate it. Memories are isolated by scope and can be created, retrieved, updated through generation workflows, or removed according to the service API.

Applications should still define their own memory policy. Decide what categories are appropriate to retain, how identity maps to a memory scope, how deletion requests propagate, and which memories are safe to reintroduce into later context.

Google explicitly cautions that automatic memory generation should not be treated as a perfect sensitive-data filter. Apply application-level data classification and retention controls where personal or confidential data matters.

## Billing boundary

Memory Bank billing under the current Agent Platform pricing structure began on September 1, 2026. The service bills stored data including revisions through Agent Storage, read and write operations through Agent Compute units, and model tokens used for memory generation or embeddings separately under their model SKUs. Storage therefore grows with retained revisions rather than only the latest visible memory, while deletion itself is a metered write operation.

Do not hard-code one estimated cost per remembered fact. A workload that regenerates memories frequently, retains many revisions, or repeatedly searches memory has a different cost profile from one with mostly stable memories. Record generated-memory volume, retained storage, read/write operation counts, and model usage separately, and verify current free tiers and rates on the pricing page before forecasting production cost.

See [agent memory](../memory-definition.md), [long-term memory](../long-term-memory.md), and [memory lifecycle](../memory-lifecycle.md) for the provider-independent design concerns.
