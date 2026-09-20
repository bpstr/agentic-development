# Claude Code

Official documentation: [overview and installation](https://code.claude.com/docs/en/overview), [CLI reference](https://code.claude.com/docs/en/cli-reference), [permissions](https://code.claude.com/docs/en/permissions).

Claude Code is Anthropic's coding-agent environment for repository work. It reads code, edits files, executes commands, and integrates with developer tools. Its terminal, editor, desktop, and web surfaces provide different ways to access the agent workflow.

## Start with a bounded task

Install through the official instructions for the operating system. On macOS, the documented Homebrew path is:

```bash
brew install --cask claude-code
cd your-project
claude
```

Complete the supported authentication flow, then provide the expected behavior and verification criteria. For scripted output, the CLI supports print mode:

```bash
claude -p "Explain the invoice retry path with file references."   --output-format json
```

The command uses the configured account or provider; it is not an offline parser. Permission rules and connected tools still determine what it can access.

## Persistent conventions and extensions

Use project instruction files for enduring repository conventions. Claude Code documents `CLAUDE.md`, `AGENTS.md` support, and automatically maintained memory with distinct loading behavior. Skills provide reusable procedures, while plugins can distribute skills and integrations. [Project memory](https://code.claude.com/docs/en/memory)

Keep a code change's success criteria outside stylistic instructions. An instruction to “follow the architecture” cannot prove that a transaction is correct. Review the diff, check relevant behavior, and report unavailable checks explicitly.

When running tasks concurrently, coordinate ownership of files and shared services. Separate sessions can still act on the same database, branch, or external issue.
