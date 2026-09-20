# Agent Plugins portable format

Official specification: [Agent Plugins](https://agent-plugins.org/specification). Canonical schemas: [Agent Plugins schemas](https://agent-plugins.org/schemas). Repository: [agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec).

Agent Plugins defines a common package boundary for agent extensions. Version 1.0.0 standardizes two portable component types: Agent Skills and MCP server configuration. It does not make every host-specific command, hook, or subagent mechanism portable.

## A small package

The root `plugin.json` identifies the format and package:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "migration-review",
  "version": "0.1.0",
  "description": "Review database migration compatibility."
}
```

Skills are discovered in immediate child directories of `skills/` containing `SKILL.md`. Optional MCP configuration lives in root `mcp.json`; it uses its own schema and a `mcpServers` object. Reverse-domain namespaces under `extensions` carry client-specific additions.

## Compatibility is a component-level property

The host must recognize the declared specification version. A conforming client may support only part of the portable component set, so manifest conformance alone does not establish that a particular installation can execute the whole workflow.

When adopting the format, check package loading, skill selection, MCP startup or connection, configuration, and error handling in each intended host. Preserve a small portable core and add host behavior only where it is required.

A manifest identifies resources. It does not grant database access, provision an MCP service, or determine the model's behavior. Those responsibilities remain with the execution environment, service authorization, and the packaged instructions.
