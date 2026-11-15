# Kimi Code CLI

Official documentation and source: [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code), including its linked installation, configuration, and command guides. Source license: [MIT](https://github.com/MoonshotAI/kimi-code/blob/main/LICENSE). Historical implementation: [MoonshotAI/kimi-cli](https://github.com/MoonshotAI/kimi-cli).

Kimi Code CLI is Moonshot AI's terminal coding agent. It reads and edits repository files, executes shell commands, and uses tool feedback to continue a development task. Its current implementation also supports MCP, subagents, hooks, and ACP editor integration. It is useful when a terminal-owned agent session should be available directly or through an editor client.

## Current implementation and migration

The former Python `kimi-cli` repository is archived and points users to `kimi-code`. Its old PyPI packages, including the historical `kimi-code` alias, are not the current CLI. The old source used Apache-2.0; the new repository uses MIT. Keep package identity and source license tied to the implementation being installed.

## Start a session

The current repository documents this macOS/Linux installation:

```bash
curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash
```

Open a new shell after installation, then start in a project:

```bash
kimi --version
cd your-project
kimi
```

Run `/login` and select Kimi Code OAuth or a Moonshot AI platform API key. Other compatible providers require the documented configuration. Begin with a request to locate a feature and its tests before asking the agent to modify it. For Windows, follow the separate installer instructions and Git Bash requirement in the repository.

## Editor integration and operational limits

ACP-capable editors can drive the same kind of agent session over standard input/output:

```bash
kimi acp
```

Configure the editor to launch this command after authentication; the repository gives examples for supported clients. ACP is the client-agent connection, while MCP supplies external tools. Neither protocol determines whether a repository operation is authorized or whether its result is correct.

Check which process and directory the editor starts, especially when multiple projects are open. Inspect changes and test results before committing them. Open-source runtime availability does not include model-service capacity, and moving from the legacy CLI requires validating configuration and automation against the new command reference rather than assuming flag compatibility.
