# OpenAI plugin packaging

Official documentation: [Package your plugin](https://developers.openai.com/plugins/build/plugins), [submission](https://developers.openai.com/plugins/deploy/submission).

OpenAI plugins distribute skills and MCP integrations to supported OpenAI agent surfaces. Current authoring guidance uses the portable Agent Plugins root manifest, with OpenAI-specific presentation and integration settings in an extension namespace.

## Portable identity with host metadata

A minimal illustrative manifest is:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "migration-review",
  "version": "0.1.0",
  "extensions": {
    "com.openai": {
      "interface": {
        "displayName": "Migration Review",
        "shortDescription": "Review database migration compatibility."
      }
    }
  }
}
```

Portable skills belong under `skills/`, and portable MCP configuration belongs in `mcp.json`. The package still needs a supported installation route and any runtime or authentication prerequisites.

## Legacy layout and host support

The packaging guide retains `.codex-plugin/plugin.json` as a compatibility layout. For a portable package, an inline `extensions.com.openai` object replaces the compatibility overlay as the source of OpenAI-specific settings; the two are not merged. Portable identity and component discovery remain rooted in the portable files.

Check the intended ChatGPT or Codex surface for supported components and connection behavior. Hooks, registered app mappings, and interface metadata are host-specific additions, not features of every Agent Plugins client.

Before distributing a release, install it through the intended route and verify a complete workflow, including missing configuration. A successful manifest load does not establish that a remote MCP server is reachable or that the package is publicly listed.
