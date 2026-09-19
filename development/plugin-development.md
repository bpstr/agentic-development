# Plugin development

A plugin is a distribution package for a useful agent capability. Start with the workflow and its dependencies: instructions, executable helpers, external service access, and any optional UI. The manifest gives the package an identity and tells a host how to discover supported components.

## Formats and compatibility

| Format or host | Manifest and layout | What to check |
| --- | --- | --- |
| Agent Plugins | Root `plugin.json`, portable `skills/` and `mcp.json` | Supported schema version and host implementation |
| OpenAI current authoring guidance | Portable root manifest; OpenAI settings under `extensions.com.openai` | Which components work on the intended ChatGPT or Codex surface |
| OpenAI compatibility layout | `.codex-plugin/plugin.json` with host-specific declarations | Whether a package uses legacy declarations or a portable root manifest |
| Claude Code | `.claude-plugin/plugin.json`; components at the plugin root | Claude-specific agents, hooks, settings, and discovery rules |

The portable format is specified by [Agent Plugins](https://agent-plugins.org/specification). OpenAI's current packaging guide recommends it for new packages and retains the Codex manifest as a compatibility path. Do not assume an older scaffold represents the newest portable format. [OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins)

Claude Code also discovers components at documented default locations without requiring a manifest in every case. An explicit manifest remains useful for identity and versioning. Its rules are defined in the [Claude plugin reference](https://code.claude.com/docs/en/plugins-reference).

## A small portable package

For an illustrative migration-review package, use these paths:

| Path | Contents |
| --- | --- |
| `plugin.json` | Identity and schema declaration |
| `skills/review-migration/SKILL.md` | The review procedure |
| `skills/review-migration/references/deployment.md` | Longer examples and supporting guidance |
| `mcp.json` | Optional configuration for a schema-inspection server |

An example root manifest:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "migration-review",
  "version": "0.1.0",
  "description": "Review database migration compatibility and deployment order."
}
```

Portable skills are discovered from the package's `skills/` directory. The package still needs a host-supported loading or distribution path. A valid manifest does not start an MCP server or provision credentials by itself. [Agent Plugins specification](https://agent-plugins.org/specification)

## Port the behavior as well as the files

Reusable instructions often travel more easily than execution features. Compare the target host's tool names, available runtimes, path resolution, permissions, hook events, and authentication flow. A reference to an installed local executable needs a real runtime dependency; changing the assistant's name does not create that dependency.

OpenAI's Claude-plugin migration guide explicitly calls out differences in custom agents, hooks, configuration prompts, and live artifacts. Its public submission workflow also distinguishes a skills package from an MCP integration. These are reasons to test the intended installation route, even if two hosts accept similarly named files. [Claude-to-OpenAI migration guidance](https://developers.openai.com/plugins/guides/submit-claude-plugin)

## Verify one complete workflow

Recommended acceptance checks:

1. Load the package in a fresh session and confirm the expected components appear.
2. Give it a task that should activate the skill, then a nearby task that should not.
3. Exercise missing credentials, unavailable helpers, and a failing tool response.
4. Inspect generated files and external changes against the requested outcome.
5. Reinstall the packaged version so success does not depend on your development directory.

Claude Code documents local loading with `claude --plugin-dir ./migration-review`, which makes a useful first development check. Testing selection and task completion requires more than confirming that the package loads. [Claude plugin development](https://code.claude.com/docs/en/plugins)

Keep test prompts and expected behavior beside the package, and record host and plugin versions when evaluating a release. Continue with [skills and instructions](skills-and-plugins.md), [MCP and other protocols](../04-tools-and-protocols/README.md), and [evaluation](../09-evaluation-and-operations/README.md).
