# Skills, plugins, and instructions

[Handbook](../../README.md) · [Chapter](README.md)

**Source review: 2026-09-19. Evidence: source-reviewed; the skill below is an illustrative document excerpt, not an installed or tested skill.**

Agent extensions work best when their responsibilities are clear. A procedure that explains how to review a migration, a function that queries a database, and a callback that reacts to a completed edit need different mechanisms.

| Mechanism | Responsibility | Migration-review example |
| --- | --- | --- |
| Project instructions | Persistent expectations for work in a repository | Identify the database and migration commands |
| Skill | A discoverable procedure for a class of tasks | Inspect compatibility, rollback, and deployment order |
| Tool | A callable operation with defined inputs and output | Read the current database schema |
| MCP server | Expose tools, resources, or prompts through a shared protocol | Offer a schema-inspection tool to several clients |
| Hook | React at a supported point in a host's lifecycle | Run a configured check after a relevant operation |
| Plugin | Package capabilities for installation and distribution | Bundle the review skill and database integration |

The [Agent Skills specification](https://agentskills.io/specification), [MCP introduction](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro), and [Claude hooks reference](https://code.claude.com/docs/en/hooks) describe these distinct extension surfaces. Hook events, inputs, and supported handler types depend on the host.

## How a skill becomes useful

An Agent Skill is a directory with a `SKILL.md` containing metadata and instructions, plus optional scripts, references, and assets. Its required metadata includes `name` and `description`. The description explains when the procedure applies. [Agent Skills format](https://agentskills.io/specification)

OpenAI documents progressive loading: the agent begins with skill metadata, then reads the instructions when it selects the skill. This keeps every procedure from being pasted into every conversation. Explicit invocation and automatic selection are both supported, with invocation syntax varying by surface. [Build skills for ChatGPT and Codex](https://learn.chatgpt.com/docs/build-skills)

Illustrative contents of a migration-review skill:

```markdown
---
name: review-migration
description: Review database schema migrations before deployment.
---

Read the migration and the application code that uses changed fields.
Identify whether old and new application versions can run together.
Check the project's rollback strategy and existing migration tests.
Report findings with file references, impact, and missing evidence.
```

The useful content is the actual procedure. “Be an expert database engineer” supplies much less guidance. Put lengthy database-specific examples in references, and keep deterministic transformations in scripts where their behavior can be checked independently.

## Skills.sh and distribution

[Skills.sh](https://www.skills.sh/docs) is a directory for discovering skills. The associated [`vercel-labs/skills` CLI](https://github.com/vercel-labs/skills) can find skills, install them for supported agents, and list installed skills. For example, `npx skills find migrations` searches by keyword. This command requires network access and may download the CLI; it is not run by the handbook's offline checks.

A directory answers where to look. Review the source repository, procedure, scripts, dependencies, and intended host before adopting a skill. Skills.sh explicitly does not guarantee every listed skill's quality or security. An install count is useful discovery metadata, but does not measure success on your workflow. [Skills.sh documentation](https://www.skills.sh/docs)

## When to package a plugin

Package a plugin when users need a coherent installable capability. A skill can exist on its own; a plugin can combine several skills and integrations. Claude Code documents plugins containing skills, agents, hooks, and MCP servers; OpenAI describes packages with skills, an MCP server, or both. Host support still needs to be checked component by component. [Claude plugin guide](https://code.claude.com/docs/en/plugins), [OpenAI plugin introduction](https://learn.chatgpt.com/docs/build-plugins)

Continue with [plugin development](plugin-development.md) for manifests and portability, and [discovery and proxies](discovery-and-proxies.md) for the difference between installation and runtime tool discovery.
