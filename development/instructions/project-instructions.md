# Project instructions

Project instructions preserve the conventions an agent needs whenever it works in a repository. They should explain decisions that would otherwise need rediscovery: build commands, ownership boundaries, architectural invariants, source-of-truth files, and how to verify changes.

A useful file is short enough to read with the task and specific enough to act on. For example:

```markdown
# Repository conventions

- API handlers validate requests; application services own transactions.
- Generated client files come from the OpenAPI document.
- Use the migration fixtures when changing persistence behavior.
- Report checks that could not run and the missing dependency.
```

The paths and commands in a real instruction file must match that repository. Copying another project's examples can create a plausible but unusable workflow.

## Scope and maintenance

Keep organization-wide preferences separate from repository facts. Add instructions closer to a subtree when its language, tooling, or ownership differs. Avoid contradictory copies; point to a maintained architectural decision when more explanation is needed.

Codex documents hierarchical `AGENTS.md` discovery. Claude Code documents `CLAUDE.md` and support for `AGENTS.md`, with its own loading and configuration behavior. Gemini CLI uses `GEMINI.md` for project context. Check the intended host rather than assuming every filename is portable. [Codex rules](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude rules](https://code.claude.com/docs/en/memory), [Gemini documentation](https://geminicli.com/docs/)

Instructions belong in version control when they are shared project policy. Exclude personal credentials, temporary incident notes, and machine-specific secrets; those are configuration or evidence, not durable coding conventions.
