# goose

[Official documentation](https://goose-docs.ai/) · [Quick start](https://goose-docs.ai/docs/quickstart/) · [Canonical repository](https://github.com/aaif-goose/goose) · [Apache-2.0 license](https://github.com/aaif-goose/goose/blob/main/LICENSE)

goose is a general-purpose agent that runs on a user's machine and can edit code, execute development tools and test changes. It provides desktop and terminal interfaces, with runtime components available through the goose Development Kit. Its coding role is an extensible local execution environment, useful when development tasks also require tools outside an editor.

The project is now maintained under `aaif-goose/goose`, within the Agentic AI Foundation. The former `block.github.io/goose` documentation redirects to `goose-docs.ai`; use the current canonical locations for installation and maintenance.

## Setup and session lifecycle

Install the desktop application or CLI using the official documentation, choose a model provider, and configure the required credentials. Open the intended workspace and enable only the extensions the task needs. The quick start documents this terminal lifecycle after configuration:

```sh
goose session
```

Ask it to inspect the project, identify its build and test commands, and implement one scoped change. Review the diff and run the relevant checks. To continue the last session:

```sh
goose session -r
```

The desktop interface offers the same conversational starting point through its home view. Model configuration and enabled tools determine what a session can do; installation alone does not supply every integration.

## Extensions, recipes and agent connections

The official documentation describes MCP extensions, portable YAML recipes, subagents and ACP integration. Recipes capture reusable instructions and tool configuration; they should still specify observable outputs and the checks required before completion.

goose can act as an ACP agent for compatible clients and can use other ACP agents as providers. Distinguish this agent-to-client connection from a direct model API. [OpenRouter](../../../infrastructure/hosting/gateways/openrouter-gateway.md) is one documented provider option; selecting it changes model routing, not the workspace tools.

## Operational boundaries

Local execution does not imply that inference or connected services remain local. Review the configured provider and extensions when reasoning about data flow. Set [coding-agent permissions](../coding-agent-permissions.md) for shell, filesystem and external actions, and give concurrent tasks independent workspaces when they could edit the same files.

The Apache-2.0 license covers the source, while model providers and connected services have separate terms. Use [verification](../coding-agent-verification.md) to record the actual tests and outputs; a reusable recipe is an execution plan, not proof of correctness.
