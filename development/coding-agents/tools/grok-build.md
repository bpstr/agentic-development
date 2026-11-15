# Grok Build

Official documentation: [Grok Build overview](https://docs.x.ai/build/overview), [CLI reference](https://docs.x.ai/build/cli/reference). Canonical repository: [xai-org/grok-build](https://github.com/xai-org/grok-build). Source license: [Apache-2.0](https://github.com/xai-org/grok-build/blob/main/LICENSE).

Grok Build is xAI's open-source coding agent for terminal and headless repository work, with ACP support for other clients. It supplies an executing agent environment around a model: project inspection, development tools, instructions, integrations, and execution controls. Use the official `xai-org/grok-build` project and `@xai-official/grok` package to distinguish it from community tools with similar Grok CLI names.

## Start a session

Install using the official instructions for the operating system. The [official npm package instructions](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/npm/grok/README.md) give this alternative to the native installer:

```bash
npm install -g @xai-official/grok
cd your-project
grok
```

The documentation describes browser-based authentication and an API-key option for environments without a browser. Keep account configuration separate from committed project files.

A documented scripted workflow is:

```bash
grok -p "Explain the webhook entry point and its persistence path." \
  --output-format streaming-json
```

For diagnosis, `grok inspect` reports discovered configuration and extension resources. This is useful when a project instruction, skill, plugin, hook, or MCP server fails to appear.

## Client integration and session operations

The CLI reference documents these operations:

| Operation | Command |
| --- | --- |
| Inspect effective configuration | `grok inspect --json` |
| Discover available models | `grok models` |
| List stored sessions | `grok sessions list` |
| Expose an ACP agent over standard input/output | `grok agent stdio` |

ACP connects an editor or other client to the agent runtime. MCP integrations provide additional tools. Their permissions and available credentials remain part of the agent's execution environment, whichever client presents its interface.

## Verify the host as well as the model

The CLI supports configurable model connections, but accepting an endpoint does not establish complete compatibility with every model feature. A task that uses streamed tool calls or strict output constraints needs verification with that combination.

Assess the resulting change through current source and relevant checks. Keep execution authority scoped to the requested task and inspect credentials available to the shell or connected services.

The Apache-2.0 runtime license does not include model inference capacity or determine a hosted provider's data policy. Select and test the model endpoint independently from the local client.

[Grok Bot](grok-bot.md) represents a different working environment: persistent cloud computers and cross-application tasks. A terminal coding session and a persistent work bot can cooperate while retaining separate context and lifecycle responsibilities.
