# Google Managed Agents API on Agent Platform

Official documentation: [Managed Agents API overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents), [create and manage agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents/create-manage), and [sandbox environment](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents/sandbox-environment).

Managed Agents API is a managed autonomous-agent service in Gemini Enterprise Agent Platform. It is distinct from Agent Runtime: Agent Runtime hosts an agent application that you build, while Managed Agents API creates agents from configuration around Google's managed Antigravity harness and execution sandbox.

The service currently has two primary interfaces:

- **Agents API** — the control plane for creating and configuring agents and their sandbox environments.
- **Interactions API** — the data plane used to communicate with a deployed managed agent.

Each agent runs in an isolated Linux sandbox with a persistent filesystem and shell execution. Network access is disabled by default and must be explicitly allowed. Managed agents can use configured skills, MCP servers, mounted sources, files, and supported web or execution capabilities.

This architecture is useful when the desired product is a hosted autonomous worker rather than only hosted model inference. The managed harness can reason, plan, execute commands, and manipulate files inside its environment.

The service does not remove application security responsibilities. Scope network allowlists, credentials, mounted sources, and external tools narrowly. Treat results that can mutate external systems as consequential actions requiring appropriate validation or human oversight.

Managed Agents API is currently a pre-GA/preview service and Google warns against using sensitive or confidential production data under the preview terms. Verify current launch status and restrictions before adopting it.

See [Agent Platform Runtime](vertex-ai-agent-engine.md) for the separate managed hosting path and [Google Agent Development Kit](../frameworks/google-adk.md) for an application-owned agent framework.
