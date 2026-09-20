# Incremental agent architecture

A system does not need every category in this handbook on day one. Use this implementation sequence to establish evidence for the next layer. Each increment should leave a useful, testable application.

| Increment | Build | Evidence to collect before expanding |
| --- | --- | --- |
| 1 · A useful model call | Transform supplied content into a defined response | Representative outputs, latency, cost, invalid/empty input handling |
| 2 · One useful tool | Read a current application record through an authorized service | Correct arguments, denied access, missing records, grounded final response |
| 3 · A bounded loop | Continue after a tool result; stop on limits and errors | Tool-call/result matching, no unbounded repetition, error visibility |
| 4 · A durable run | Persist work and result independently of the client | Browser reconnect, worker restart, cancellation, duplicate delivery |
| 5 · Relevant retrieval | Retrieve permission-filtered sources with provenance | Retrieval quality, missing answers, revoked/deleted content |
| 6 · A richer interface | Show sources, actions, progress, and useful controls | User can tell what happened and what needs their input |
| 7 · Selective sophistication | Add routing, graph retrieval, parallel agents, or managed hosting | A measured workload benefit that exceeds the added complexity |

For a task-management assistant, the first useful action might be “Show my blocked tasks.” That can use a direct query tool without embeddings. “Explain the reasoning behind the release process” is a later document-retrieval problem. “Create a release plan from these dependencies and team constraints” may justify a more capable model and a longer workflow.

Keep the business operation reusable outside the agent. A `create_task` service should validate and authorize the operation whether it is called from a form, CLI, integration, or model-requested tool. The agent adds a way to request the operation; it does not replace the application's invariants.

Compare framework choices when your implementation needs their actual features: durable checkpoints, streaming adapters, tracing integration, or complex control flow. A [framework](../infrastructure/orchestration/frameworks/framework-definition.md) can save work, and a [direct loop](tool-loop.md) can make a small workflow easy to inspect. Measure the behavior that matters to the product rather than optimizing for the fewest dependencies or the longest feature list.

Treat changes to prompts, tool schemas, retrieval, models, and routing as behavior changes. Run the relevant [evaluation cases](../operations/evaluation/agent-evaluation.md) for the layer you changed, and use [traces](../operations/observability/tracing.md) to explain regressions before replacing the architecture.
