# OpenCode

[Official documentation](https://opencode.ai/docs/) · [Terminal interface](https://opencode.ai/terminal) · [Canonical repository](https://github.com/anomalyco/opencode) · [MIT license](https://github.com/anomalyco/opencode/blob/dev/LICENSE)

OpenCode is a coding agent with terminal, desktop, mobile and SDK interfaces. It runs development tools against a workspace while using a configured model provider. It is useful when the execution environment should stay under the developer's control and the model should be replaceable without changing the whole workflow.

The canonical implementation is `anomalyco/opencode`, linked from [opencode.ai](https://opencode.ai/). The older `opencode-ai/opencode` repository is a different project history and should not supply installation instructions for this implementation. The canonical README currently labels the desktop application **beta**.

## Setup and first task

The current official terminal package is:

```sh
npm install -g @opencode/cli
```

Start in the intended repository, select a model and configure its provider through the documented setup. Local execution does not imply local inference: a hosted provider receives the context sent to it. The desktop interface can be installed from the [official downloads](https://opencode.ai/download).

After provider setup, the terminal supports a one-off request:

```sh
opencode run "Summarize this repository and identify its test command"
```

Use the planning agent to inspect the codebase, agree on a bounded change, and then use the build agent to implement it. Review the resulting diff and run the repository's actual checks. A useful task includes the behavior to preserve, the expected result and the verification command; a broad request to improve everything leaves completion ambiguous.

## Operations and boundaries

The [terminal reference](https://opencode.ai/terminal) documents session continuation, one-off runs, remote server connections and usage statistics. The repository documents custom agents, while the official site links to MCP, plugins, skills and permissions.

Configure [coding-agent permissions](../coding-agent-permissions.md) for the actual workspace and commands. A planning mode is a useful workflow boundary, but it should not be assumed to provide operating-system isolation. Parallel sessions also need separate workspaces or worktrees when edits could overlap.

The MIT license covers the client source. Provider access, model charges and optional hosted services have their own terms. Evaluate changes through [coding-agent verification](../coding-agent-verification.md), including tests and diff review, rather than treating a successful agent response as evidence that the implementation is correct.
