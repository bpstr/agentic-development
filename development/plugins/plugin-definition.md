# Plugin definition

A plugin packages related agent capabilities for discovery, installation, configuration, and updates. Depending on the host, its contents may include skills, MCP server definitions, commands, hooks, subagents, or interface resources.

The package provides a distribution boundary. It does not itself define the wire protocol for every component or the permissions granted to them. For example, a migration-review plugin could bundle a review skill with an MCP server that inspects database schemas. The skill describes the procedure; MCP defines the interaction with the server; the database still enforces access.

## Identity and components

A manifest normally supplies an identity and points the host toward supported contents. A release binds those contents to a version so users can install a coherent capability and maintain it over time.

Choose a plugin when several resources need to arrive and evolve together. A standalone skill is sufficient when the reusable knowledge is the whole feature. A remote MCP service can also exist independently of a plugin package.

Portability requires checking each component. [Agent Plugins](common-agent-plugin-format.md) defines a portable core for skills and MCP servers. [Claude Code plugins](platforms/claude-code-plugins.md) and [OpenAI plugins](platforms/openai-plugins.md) add their own host integration behavior.

A valid package can still depend on an unavailable runtime, missing credentials, or unsupported hooks. Installation success and workflow success are separate outcomes, so verify both with the intended host and task.
