# Coding agents

A coding agent combines a language model, a working environment, development tools, and a loop that observes results before choosing another action. It can inspect a repository, modify several files, run checks, and revise its changes. A code-generation model alone supplies predictions; the agent host supplies execution and state.

The working environment determines what a task can accomplish. A terminal session uses a local checkout and its installed dependencies. An IDE adds editor context and visual diff review. An isolated checkout makes parallel work easier to integrate. A persistent cloud environment can continue work while a user's machine is offline.

## A verifiable assignment

Describe the observable behavior, relevant boundaries, and completion evidence:

```text
Goal: repeated webhook deliveries must create only one invoice.
Context: inspect the handler, persistence layer, and existing fixtures.
Acceptance: duplicate deliveries succeed without additional invoices.
Deliverable: a focused diff and the results of relevant checks.
```

The agent should find the implementation, establish the failure, edit it, and verify the resulting behavior. A confident final message is not completion evidence; the diff, executable checks, and observable application behavior are.

Permissions, repository instructions, and model choice are separate controls. Increasing model capability does not install missing dependencies or authorize external actions. Conversely, broad shell access does not supply an accurate understanding of the codebase.

[Codex](tools/codex.md), [Claude Code](tools/claude-code.md), and [Gemini CLI](tools/gemini-cli.md) are implementations of this category. Their environments and extension mechanisms differ, so compare them on the same repository task and acceptance criteria.
