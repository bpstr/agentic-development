# Cline

[Official documentation](https://docs.cline.bot/) · [Canonical repository](https://github.com/cline/cline) · [Apache-2.0 license](https://github.com/cline/cline/blob/main/LICENSE)

Cline is a coding agent available through editor integrations, a CLI, a desktop application and an SDK. It can inspect a project, edit files, execute commands and use connected tools. It is useful for developers who want explicit planning and execution stages while choosing their own model provider.

The canonical README documents VS Code and JetBrains integrations, a desktop app for macOS and Windows, and interactive or headless CLI operation. **The JetBrains plugin is explicitly not open-sourced**, despite the main repository's Apache-2.0 license. Apply source-status claims to the specific component being evaluated.

## Setup and first task

Install the chosen editor extension or desktop application from the official product links, or install the CLI:

```sh
npm i -g cline
```

Configure a model provider and credentials, then select the project directory. With the CLI configured, a first task can be:

```sh
cline "Summarize this repository and identify its test command"
```

Use **Plan** mode to inspect the relevant code and agree on the change. Switch to **Act** for implementation, inspect proposed edits and command approvals, and run the actual repository checks. Auto-approval changes this interaction, so review the selected permission configuration before starting unattended tasks.

Project rules and skills can carry persistent development conventions. Keep those instructions specific to the repository; they should state necessary constraints without duplicating every tool's documentation. A task should still describe the intended behavior and the evidence required to demonstrate it.

## Providers, tools and automation

The README documents hosted providers, local model servers and OpenAI-compatible endpoints, including [OpenRouter](../../../infrastructure/hosting/gateways/openrouter-gateway.md). Provider selection determines inference access and routing; it does not define the local file and command permissions.

MCP and plugins extend the tool surface. The CLI also documents headless execution for scripts and CI. Confirm release-specific flags and output schemas in the official documentation before building an automation around them; an interactive workflow should not be assumed to behave identically when prompts and approvals are removed.

Configure [coding-agent permissions](../coding-agent-permissions.md) for the environment, and use independent workspaces for concurrent edits. Apply [coding-agent verification](../coding-agent-verification.md) to the final diff and test results. Source licensing, model charges and any hosted product subscription are separate decisions.
