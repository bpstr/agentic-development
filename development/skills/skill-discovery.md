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
