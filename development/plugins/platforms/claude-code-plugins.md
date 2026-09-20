# Claude Code plugins

Official documentation: [plugin development](https://code.claude.com/docs/en/plugins), [plugin reference](https://code.claude.com/docs/en/plugins-reference), [marketplaces](https://code.claude.com/docs/en/plugin-marketplaces).

Claude Code plugins package reusable capabilities such as skills, agents, hooks, and MCP server connections. The native package format supplies Claude-specific component discovery and behavior.

## Build and load a small package

An explicit manifest at `.claude-plugin/plugin.json` can contain:

```json
{
  "name": "migration-review",
  "version": "0.1.0",
  "description": "Review database migrations before deployment."
}
```

Place components at the plugin root: for example, `skills/review-migration/SKILL.md` contains the procedure. The `.claude-plugin/` directory holds manifest material; moving all components into it breaks the documented default layout.

Load a local development package with:

```bash
claude --plugin-dir ./migration-review
```

Confirm the skill appears, invoke it on a representative migration, and inspect its findings. Plugin skill names are namespaced by the plugin, which helps avoid collisions with other installed packages.

## Distribution and portability

A marketplace describes installable plugin sources. It is separate from the package itself and can be local, private, or public according to the supported host workflow.

The presence of a skill directory does not make Claude-specific hooks, agents, or settings portable to other clients. When sharing a package, review each component against the destination's contract and adapt configuration deliberately.

Validate helper paths and dependencies from the installed package. A plugin that works only because a developer has an undeclared executable or credential available has an incomplete distribution contract.
