# Grok Build

Official documentation: [Grok Build overview](https://docs.x.ai/build/overview).

Grok Build is the coding-agent tool documented by xAI for terminal and headless repository work. It supplies a working agent environment around a model: project inspection, development tools, instructions, integrations, and execution controls.

## Start a session

Install using the official instructions for the operating system, enter a project directory, and launch the CLI:

```bash
cd your-project
grok
```

The documentation describes browser-based authentication and an API-key option for environments without a browser. Keep account configuration separate from committed project files.

A documented scripted workflow is:

```bash
grok -p "Explain the webhook entry point and its persistence path."   --output-format streaming-json
```

For diagnosis, `grok inspect` reports discovered configuration and extension resources. This is useful when a project instruction, skill, plugin, hook, or MCP server fails to appear.

## Verify the host as well as the model

The CLI supports configurable model connections, but accepting an endpoint does not establish complete compatibility with every model feature. A task that uses streamed tool calls or strict output constraints needs verification with that combination.

Assess the resulting change through current source and relevant checks. Keep execution authority scoped to the requested task and inspect credentials available to the shell or connected services.

[Grok Bot](grok-bot.md) represents a different working environment: persistent cloud computers and cross-application tasks. A terminal coding session and a persistent work bot can cooperate while retaining separate context and lifecycle responsibilities.
