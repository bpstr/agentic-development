# Zed Agent and external coding agents

Official sources: [Zed repository](https://github.com/zed-industries/zed), [AI quick start](https://zed.dev/docs/ai/quick-start), [agent paths](https://zed.dev/docs/ai/agents), [native Zed Agent](https://zed.dev/docs/ai/zed-agent), and [external agents](https://zed.dev/docs/ai/external-agents).

Zed is an open-source desktop code editor that supports both its own coding agent and externally supplied agents. Its native Zed Agent can read, search, edit, and run code within the editor's project and review interfaces. External agents integrate through the Agent Client Protocol, while terminal threads organize a tool's native CLI or TUI experience.

## Choose the agent path first

The native Zed Agent uses Zed-configured model providers, tools, profiles, instructions, skills, and MCP servers. An external agent normally owns its own runtime, authentication, provider configuration, and native instructions. Choose between these paths before configuring a model or subscription; an external agent's sign-in does not configure Zed's native inference provider.

For the native agent:

1. Install Zed through its official distribution and open the repository.
2. Open Agent Settings and configure a supported model provider.
3. Review available tools and permissions, then start a task from the Agent Panel.
4. Inspect the edits and run the repository's relevant checks.

For an external agent, open the ACP Registry through `zed: acp registry`, install the desired integration, and follow that agent's authentication flow. Start an external-agent thread and confirm which instructions and tools it loads.

## Provider and source choices

Zed's [quick start](https://zed.dev/docs/ai/quick-start) documents hosted models, API access, gateways, and local model servers as separate choices. [OpenRouter](../../../infrastructure/hosting/gateways/openrouter-gateway.md) can supply model access for the native agent through the gateway path; that does not configure an unrelated external agent.

The [repository's licensing statement](https://github.com/zed-industries/zed/blob/main/README.md) identifies Zed source as primarily GPL-3.0-or-later with Apache-2.0 components where marked. Model services and external agents retain their own licenses and terms. An open-source editor does not make every connected model or agent open source.

## Review and permissions

Check both Zed's controls and the external agent's native policy when tools cross the ACP boundary. Forwarded MCP tools and agent-native tools can have different configuration paths. Apply [coding-agent permissions](../coding-agent-permissions.md) and [verification](../coding-agent-verification.md) to the actual execution environment, and keep [repository context](../repository-context.md) consistent with the selected agent.
