# Agent Plugins specification

Official specification: https://agent-plugins.org/specification
Canonical schemas: https://agent-plugins.org/schemas
Specification repository: https://github.com/agentplugins/agent-plugins-spec

Agent Plugins is an open, vendor-neutral package format for reusable components that extend AI agents. Version 1.0.0 defines a portable interoperability floor for **Agent Skills** and **MCP servers**.

A conforming plugin is a directory with a root `plugin.json`. Skills are discovered beneath `skills/`; MCP servers are described by root `mcp.json`. Client-specific behavior can live in reverse-domain extension namespaces without changing the portable core.

The specification intentionally does not standardize every extension mechanism. Commands, hooks, subagents, rules, and similar features remain client-specific unless they become part of a future portable specification.

Use Agent Plugins when skills and MCP capabilities need a common package boundary across compatible clients. Do not confuse the portable specification with any one host's richer native plugin format.
