# Agent instructions

Agent instructions are directions that shape an agent's decisions: its objective, responsibilities, constraints, preferred procedures, and output expectations. They differ from task data. A retrieved document can describe a customer problem without being authorized to redefine the agent's role.

Instruction systems often have several scopes: application policy, user preferences, repository conventions, and the current task. Their precedence and loading rules belong to the host. Do not assume that a filename or a Markdown heading creates a universal priority level.

## Make directions operational

Useful instructions connect an action to a condition and an outcome:

```text
When changing a persistence rule, inspect the existing transaction
boundary and verify both the accepted and rejected cases.
Report a failed check with its actual error and affected behavior.
```

“Write excellent code” supplies little guidance about either decision. Overly long instructions can also conflict, become stale, or consume context needed for the task.

Put reusable procedures in [skills](../skills/skill-definition.md), project conventions in [project instructions](project-instructions.md), and deterministic restrictions in execution policy. The distinction matters: text can tell an agent to avoid a secret file, while access control actually prevents reading it.

Review instructions when repeated mistakes reveal missing context, and remove rules that no longer apply. For concrete loading behavior, consult [Codex AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [Claude Code memory and instruction files](https://code.claude.com/docs/en/memory).
