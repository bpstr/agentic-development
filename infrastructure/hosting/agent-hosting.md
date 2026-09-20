# Agent hosting

Agent hosting provides the compute and lifecycle needed to run an agentic application. Distinguish hosting the application API, hosting the agent worker, serving the model, and providing a sandbox. These may be separate services or share one machine.

A conventional starting point is an HTTP application, a background worker, a database, and a hosted model API. The application returns a run ID, the worker executes bounded work, and the client polls or subscribes to persisted progress. This supports PHP, TypeScript, Python, Go, or other server languages; the model provider does not determine the rest of the stack.

Choose an execution location according to workload. Short transformations can fit a request handler. Multi-step work benefits from workers. Human approval waits need resumable state. Untrusted code needs a restricted environment separate from ordinary application credentials.

A hosting plan must cover process restart, deployment drain, pending jobs, cancellation, storage, and outbound network access. Files in ephemeral compute should be copied to durable artifact storage before a run is reported as complete.

Managed runtimes take over some worker and harness responsibilities, while application-owned execution offers direct control. Inspect the actual lifecycle contract: a serverless function may stop after its response, and a sandbox may expire independently of the user's task. [OpenAI's architecture guide](https://developers.openai.com/api/docs/guides/agents-api/architecture) makes these ownership boundaries explicit for one hosted implementation.
