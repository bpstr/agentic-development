# Workflow orchestration

A workflow defines the order, dependencies, and conditions of a business process. Steps may call models, run ordinary functions, wait for input, or invoke an agent. The distinguishing property is that application logic controls the process structure.

Consider document publishing: validate the source, generate a draft, check references, request approval, and publish the approved revision. The drafting step can be open-ended while the publishing sequence remains explicit. An agent may suggest skipping a step; only workflow policy can authorize that transition.

Each step should have an input contract, output contract, retry policy, and completion condition. Persist identifiers for long waits. Approval should refer to a specific revision and action, because permission to publish one draft does not automatically cover a later rewrite.

A workflow is not necessarily durable. An in-memory sequence can disappear with its process. Add persisted execution state when resumption matters, and isolate external side effects behind idempotent operations.

Use workflows when a process has known ordering, repeatable review gates, or auditable outcomes. Keep optional research inside bounded steps so that model exploration cannot silently consume the entire process budget. [Temporal workflow executions](https://docs.temporal.io/workflow-execution) and [ADK workflow agents](https://adk.dev/agents/workflow-agents/) show two different implementations of explicit coordination.

## Visual workflow platforms

A visual platform represents steps and their connections through an editor and supplies an execution surface for the published workflow. [Dify](platforms/dify.md) and the archived [Flowise](platforms/flowise.md) illustrate this approach. Their product guides distinguish workflow authoring, knowledge ingestion, API invocation, and the features available in each edition.

Treat a published workflow as a versioned executable artifact. Record its inputs, model and retrieval configuration, credentials, external side effects, and completion contract. Changing a canvas node can change authorization or cost just as changing application code can. A visual connection also does not establish durable execution, automatic rollback, or exactly-once effects; verify those properties in the selected runtime.
