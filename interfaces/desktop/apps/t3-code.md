# T3 Code

[Official site](https://t3.codes/) · [Documentation](https://github.com/pingdotgg/t3code/tree/main/docs) · [Canonical repository](https://github.com/pingdotgg/t3code) · [MIT license](https://github.com/pingdotgg/t3code/blob/main/LICENSE)

T3 Code is an open-source interface and control plane for coding agents. It presents agent threads, worktrees, diffs and source-control actions through desktop, web and mobile clients. It is useful when a developer wants one interface over several agent implementations or needs to supervise work from another device.

T3 Code runs agents installed and authenticated on the execution machine. Its own interface is not a replacement model or a separate model subscription: the selected agent still determines execution capabilities, authentication and usage conditions. Supported integrations should be checked in the current repository documentation rather than inferred from a shared model name.

## Setup and first thread

Install and sign in to at least one supported agent, such as [Claude Code](../../../development/coding-agents/tools/claude-code.md) or [Codex](../../../development/coding-agents/tools/codex.md). Install the desktop application from the official download links, or launch the server and web application with the documented command:

```sh
npx t3@latest
```

Select the repository and agent, start a thread, and first ask the agent to inspect the project and identify its checks. Request a scoped change, review the resulting diff, and verify it before committing or opening a pull request. The UI's source-control conveniences do not remove the need to understand what will be published.

The canonical README documents desktop distributions for macOS, Windows and Linux. Remote access lets another client supervise the server's agents; it does not move repository execution to the phone or browser that displays the thread.

## Workspaces and operational boundaries

Use separate worktrees for concurrent changes and coordinate shared services such as development databases and generated outputs. Worktree isolation separates checked-out files, but it should not be assumed to isolate every process or external dependency used by an agent.

Configure the chosen agent's [permissions](../../../development/coding-agents/coding-agent-permissions.md) and follow T3's remote-access documentation before exposing a server. Keep the distinction between UI connectivity and agent authentication explicit when diagnosing failed or interrupted sessions.

The application source is MIT licensed; connected agents and hosted services retain their own terms. Judge a thread's outcome through [coding-agent verification](../../../development/coding-agents/coding-agent-verification.md), including the reviewed diff and actual test results, rather than only its completion status in the interface.
