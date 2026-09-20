# Managed agent runtimes

A managed agent runtime operates the agent's execution loop as a service. It can maintain sessions, coordinate model and tool turns, expose progress events, and resume work. Direct model inference returns model output; it does not by itself define this broader lifecycle.

Separate three responsibilities: the **harness** chooses and coordinates steps, the **execution environment** runs commands or code, and the **application** binds work to users and business records. A hosted harness may use a self-hosted sandbox. That arrangement changes command execution location without moving every session or inference operation onto your infrastructure.

Evaluate a runtime with a complete workflow: create a session, supply context, invoke a tool, disconnect, recover events, retrieve an artifact, continue work, and cancel a pending turn. Compare session retention, input correlation, tool callbacks, retries, and required-action states.

The application still owns identity, current authorization, domain records, idempotency, and the user experience. A session's final prose should not be the only evidence that a requested business mutation succeeded.

[OpenAI's runtime architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture), [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview), and [Google's managed runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale) illustrate distinct service contracts. Match retention, region, tool execution, and recovery behavior to the application; names such as session or event do not imply wire compatibility.
