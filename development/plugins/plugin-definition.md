# Plugin definition

A plugin packages capabilities so an agent host can discover, install, configure, and use them as a unit. Depending on the host, a plugin can contain instructions, skills, commands, hooks, tools, MCP servers, UI resources, or configuration.

A plugin is a distribution boundary rather than a universal execution protocol. Its manifest and supported contents are defined by the host or plugin specification. Installing a plugin does not automatically grant unrestricted permissions to every packaged capability; authorization and execution boundaries still belong to the host and underlying services.

Plugin systems are useful when related agent capabilities need versioning, installation, dependency management, or distribution beyond one repository.
