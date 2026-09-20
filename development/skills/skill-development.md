# Skill development

Skill development turns a repeatable procedure into instructions and supporting resources an agent can discover and use. Begin with a task that has a recognizable input and an assessable result, then identify which parts require judgment and which can be deterministic helpers.

A minimal illustrative `SKILL.md` is:

```markdown
---
name: review-migration
description: Review database migrations for deployment compatibility.
---

Read the migration and code using the changed schema.
Identify whether old and new application versions can overlap.
Check transaction assumptions and the rollback strategy.
Report findings with affected files and verification evidence.
```

The portable format is defined by [Agent Skills](https://agentskills.io/specification). Its metadata identifies the procedure; the Markdown supplies the work. Optional references hold longer examples, scripts handle repeatable operations, and assets contain templates or other inputs.

## Design for execution

State prerequisites that materially affect success, including installed tools, network dependencies, and credentials. Resolve bundled files relative to the skill package instead of assuming the current working directory. Explain what a helper does before instructing an agent to run it.

Test selection and task completion separately. Try a clear match, a plausible non-match, incomplete inputs, a missing dependency, and a failing operation. Inspect the actual output and side effects. A skill that loads successfully can still choose the wrong files or produce unsupported claims.

When porting between hosts, review tool names, supported runtimes, file access, and invocation rules. Matching Markdown syntax does not guarantee equivalent execution behavior.
