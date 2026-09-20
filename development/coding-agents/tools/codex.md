# Codex

Official documentation: [Codex CLI](https://learn.chatgpt.com/docs/codex/cli), [non-interactive execution](https://learn.chatgpt.com/docs/non-interactive-mode), [project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

Codex is OpenAI's coding-agent environment. Its CLI can inspect a repository, edit files, run development tools, and iterate using their output. This page concerns that development workflow; calling a model API does not recreate the CLI's filesystem, tools, or permissions.

## Start a repository session

Install Codex using the official platform-specific instructions, open a project directory, and run:

```bash
codex
```

Sign in using a supported account method. Inspect the active model and permission settings before assigning work. Project `AGENTS.md` files supply persistent conventions; the task should supply the desired behavior and acceptance criteria.

For scripted analysis, the documented execution surface supports JSON Lines events:

```bash
codex exec --sandbox read-only --json   "Trace webhook deduplication. Cite files and identify missing evidence."
```

This requires an authenticated installation and uses its configured service allowance. Parse the event stream and process exit status; do not treat arbitrary generated text as a machine-readable success signal.

## Use the development environment deliberately

Dependencies, services, and credentials available to the CLI affect what it can verify. A missing database or disabled network can prevent a meaningful integration check even when edits succeed.

Review the resulting diff and the claimed checks. Keep independent tasks in separate worktrees where useful, and remember that worktrees do not isolate shared external services. Permission settings should follow the task's actual execution needs.
