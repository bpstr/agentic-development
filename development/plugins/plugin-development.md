# Plugin development

Plugin development assembles a coherent workflow from reusable instructions, tools, and optional host integrations. Start with the task and required resources, then choose the package format supported by the intended installation surfaces.

A migration-review package might contain:

- `plugin.json` for portable package identity;
- `skills/review-migration/SKILL.md` for the procedure;
- `skills/review-migration/references/deployment.md` for detailed examples;
- optional `mcp.json` for a schema-inspection server.

This layout follows the [Agent Plugins portable format](common-agent-plugin-format.md). Host-specific fields and legacy layouts belong in the relevant [OpenAI](platforms/openai-plugins.md) or [Claude Code](platforms/claude-code-plugins.md) integration, rather than being assumed to work everywhere.

## Build a complete lifecycle

Define how the package is installed, how a user supplies configuration, how the host discovers components, and how failures are reported. An MCP declaration identifies a connection; it does not automatically provision a service or create credentials.

Keep package-relative resources portable. A helper script should locate its inputs without depending on a developer's home directory. Declare real dependencies and handle missing executables with useful errors.

Verify the package in a fresh session using the installed release. Check an intended task, a nearby unrelated task, missing credentials, an unavailable helper, and a failing tool response. Inspect resulting files and external changes against the requested outcome.

For local development, Claude Code documents `claude --plugin-dir ./migration-review`. That checks one host's loading path; cross-host distribution still needs component-level validation. [Claude plugin development](https://code.claude.com/docs/en/plugins)
