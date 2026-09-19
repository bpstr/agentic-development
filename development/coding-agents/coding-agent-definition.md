# Coding agents and persistent bots

A coding agent combines a model with a working environment and an execution loop. It can inspect files, propose or apply edits, invoke development tools, and use the resulting output to decide what to do next. Choosing a capable model is one decision; choosing the environment, permissions, context, and review process is another.

## Choose the working environment

| Environment | Useful for | Decide explicitly |
| --- | --- | --- |
| Local terminal or IDE | Interactive changes using the existing development setup | Working directory, accessible files, executable commands |
| Isolated checkout or worktree | Parallel tasks and changes that need independent review | Branch ownership, shared services, integration order |
| Headless or CI invocation | Repeatable analysis and bounded automation | Inputs, timeout, credentials, output contract, failure handling |
| Persistent cloud workspace | Work that continues between conversations | Stored state, connected accounts, background activity |

These are deployment choices. A product can support several of them.

## Representative coding agents

**OpenAI Codex.** The CLI works against a local repository, can edit files and run development tools, and provides interactive and scripted workflows. Its current documentation lives within ChatGPT Learn. The product's model selection, permissions, integrations, and environment are separate configuration choices. Use the [Codex CLI documentation](https://learn.chatgpt.com/docs/codex/cli) for setup and supported surfaces.

For automation, `codex exec` runs without the interactive terminal UI; `--json` produces a JSON Lines event stream. A script should interpret completion or failure events and inspect the resulting artifacts, rather than treating any generated prose as success. The following read-only analysis requires an installed, authenticated CLI and consumes the configured service's usage allowance. [Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)

```bash
codex exec --sandbox read-only --json \
  "Trace webhook deduplication. Cite files and identify missing evidence."
```

**Anthropic Claude Code.** Claude Code offers terminal, IDE, desktop, and web surfaces. The terminal agent can inspect and edit a project and run commands. Its integrations and execution settings belong to the agent product; directly calling a Claude model does not recreate that environment. [Claude Code overview](https://code.claude.com/docs/en/overview)

**Grok Build.** xAI's documented coding agent supports an interactive terminal interface, headless use, and integration through Agent Client Protocol (ACP). Its documentation covers instructions, MCP, skills, plugins, worktrees, and permissions. Treat these as product capabilities to verify against your intended environment; the handbook does not rank its coding performance. [Grok Build overview](https://docs.x.ai/build/overview)

## Where Grok Bot fits

**Grok Bot** is the persistent work-agent product introduced in xAI's [August 11, 2026 announcement](https://x.ai/news/introducing-grok-bot). It launched in beta with bots that retain context, coordinate with one another, and perform work across applications on a cloud computer. Demonstrated workflows can become reusable routines. This belongs to the persistent-work category alongside, but distinct from, a repository coding session.

The [Grok Bot documentation](https://docs.x.ai/grok-bot/overview) describes its browser, terminal, and filesystem, and says bots belonging to an account share the computer, files, and browser sessions. Consequently, multiple bot names should not be treated as independent isolation boundaries. For a developer, an illustrative handoff is to reproduce a UI bug, collect evidence, and pass a focused task to a coding agent. The announcement's examples are vendor-reported; this handbook has not tested that workflow.

## Give the agent a verifiable task

An illustrative task brief:

```text
Goal: duplicate webhook deliveries must not create duplicate invoices.
Context: inspect the handler, persistence path, and existing fixtures.
Acceptance: the second delivery returns success with no extra invoice.
Verification: run the relevant tests and explain any missing coverage.
Deliverable: a focused diff, behavior explanation, and test results.
```

Use repository guidance for persistent conventions: Codex documents `AGENTS.md`, while Claude Code documents `CLAUDE.md`. Keep the current task's acceptance criteria in its brief. Instructions guide behavior; code, test output, and reviewed diffs establish what happened. [Codex project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude project memory](https://code.claude.com/docs/en/memory)

Continue with [skills and plugins](skills-and-plugins.md), [code intelligence](code-intelligence.md), and [evaluation and operations](../09-evaluation-and-operations/README.md).
