# Coding-agent permissions

Coding-agent permissions define which resources and actions an agent host permits: reading files, writing within a workspace, running processes, accessing the network, using credentials, and changing external systems. They are enforced by the execution environment and connected services, rather than by the model's intention.

Separate three questions:

- **Capability:** is a shell, browser, or integration available?
- **Authority:** may this task use it for this action and resource?
- **Isolation:** what technical boundary prevents access elsewhere?

An instruction saying “only edit this repository” is useful guidance. A filesystem boundary makes that restriction enforceable. A Git worktree isolates tracked changes but does not isolate shared databases, network services, or credentials.

## Match permissions to the task

For source analysis, provide reading and narrowly scoped execution for relevant checks. A repair task also needs writes. Publishing, production migrations, messages, and purchases require authority beyond editing local code; grant it through a clear user request or controlled workflow.

For example, permission to fix invoice deduplication does not inherently authorize replaying production payments. A local fixture using synthetic events can establish behavior without touching live accounts.

Record denied operations accurately. An unavailable dependency or blocked command is a verification limitation, not a passing check. Avoid making a permission failure disappear by silently choosing an unrestricted execution mode.

Host-specific controls are documented in [Claude Code permissions](https://code.claude.com/docs/en/permissions) and [Codex non-interactive execution](https://learn.chatgpt.com/docs/non-interactive-mode). Their labels should not be assumed to mean identical isolation guarantees.
