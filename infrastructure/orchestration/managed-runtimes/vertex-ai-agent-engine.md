# Google Agent Runtime and Vertex AI Agent Engine

Official documentation: [Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime), [runtime quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime/quickstart), [ADK runtime quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime/quickstart-adk), and [runtime contract](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/runtime-contract).

Google's current managed hosting surface is **Agent Runtime** in Gemini Enterprise Agent Platform. Earlier documentation and APIs used Vertex AI Agent Engine / Reasoning Engine terminology. The API resource name `ReasoningEngine` remains for backwards compatibility even though the product documentation now uses Agent Runtime.

Agent Runtime hosts agent applications that you build. It is framework-independent and can deploy agents built with ADK and other supported frameworks or custom containers that implement the runtime contract. This is different from [Managed Agents API](google-managed-agents-api.md), where Google supplies the autonomous harness and sandbox around a configured agent.

The current Agent Platform SDK for Python exposes runtime operations through `agentplatform.Client(...).runtimes`. Google is moving agent-platform operations into the dedicated `google-cloud-agentplatform` package while generative model APIs use the Google Gen AI SDK.

A deployment lifecycle is:

1. build and test the agent application;
2. choose project, location, IAM, and network settings;
3. deploy the application to Agent Runtime;
4. invoke the deployed agent through the SDK or underlying API;
5. manage sessions, memory, observability, and deployment lifecycle separately.

Custom containers can expose application-specific HTTP endpoints in addition to the Agent Platform runtime endpoints. The runtime contract currently requires the container to listen on port 8080.

Agent Platform Sessions and [Memory Bank](../../knowledge/memory/platforms/google-memory-bank.md) are separate state services that can be combined with Runtime. Gemini inference is another separate service boundary; deploying an agent does not imply that every model call or business tool is hosted by Runtime.

Derive application user identity from authenticated product identity, not an arbitrary client-supplied string. IAM controls access to Google Cloud resources but does not automatically implement your product's workspace membership or business authorization.

Google's Agent Platform naming and SDK surface are evolving quickly. Verify current SDK migration guidance, supported regions, resource names, and runtime capabilities before copying an older Vertex AI Agent Engine example.
