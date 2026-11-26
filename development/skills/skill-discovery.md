# Skill discovery

Skill discovery is the process of locating a reusable procedure and deciding whether it applies. It happens both outside a running agent, when someone searches a catalog, and inside a session, when the host or model selects an installed skill.

These stages answer different questions. A directory identifies candidates and installation sources. Package loading establishes which skills are available to a host. Runtime selection matches the current task to a skill's description. Loading its instructions provides the procedure.

## Descriptions as a selection interface

A useful description names the task and its distinguishing conditions:

```text
Review schema migrations for compatibility during rolling deployment,
including old/new application overlap and rollback assumptions.
```

A description such as “database expert” attracts unrelated database tasks and gives little evidence about the procedure's scope. Include terminology users actually use, while avoiding a long list of unrelated triggers.

[Skills.sh](tools/skills-sh.md) supports catalog search and installation. The [Agent Skills specification](tools/agent-skills.md) defines the package being discovered; it does not prescribe one marketplace ranking algorithm.

Evaluate discovery with both positive and negative examples. Measure whether the right procedure activates, whether necessary references load, and whether another skill is incorrectly suppressed. Too many broad descriptions can increase ambiguity even when every skill is individually useful.

After installation, inspect the discovered skill in the intended host. A successful download alone does not prove that the host recognized the package or that the next session loaded it.

## Discovery over MCP

The [Skills extension](https://modelcontextprotocol.io/extensions/skills/overview) (`io.modelcontextprotocol/skills`, SEP-2640) is in Beta. A supporting server advertises Resources and the extension in `server/discover`. Clients enumerate metadata using `skills/list` or fetch a known skill with `skills/get`, then use `resources/read` for its `SKILL.md` and supporting files. A manifest includes resource URIs, SHA-256 digests and byte sizes, or marks the resources dynamic. Respect cache scope and expiry; verify content integrity and apply host approval and trust policy before loading instructions. Reading a resource alone does not activate the skill. Consult the [canonical extension repository](https://github.com/modelcontextprotocol/ext-skills) and client matrix for actual host support.
