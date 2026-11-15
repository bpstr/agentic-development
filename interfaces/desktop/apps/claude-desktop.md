# Claude Desktop and Claude Code on desktop

Official sources: [desktop download](https://claude.com/download), [Claude Code desktop quick start](https://code.claude.com/docs/en/desktop-quickstart), [desktop reference](https://code.claude.com/docs/en/desktop), and [product terms](https://www.anthropic.com/legal).

Claude Desktop is Anthropic's graphical application for working with Claude. Its **Code tab** exposes Claude Code against a project folder, with session management and code review interfaces. It is useful when a developer wants to delegate repository work and inspect changes without making the terminal the primary interface.

The desktop application is a host for several workflows. General chat, Cowork, and the Code tab have different purposes and configuration boundaries. For the coding harness and terminal workflow, see [Claude Code](../../../development/coding-agents/tools/claude-code.md).

## Start a coding session

1. Install the application through the official download page and sign in with an account that has access to Claude Code.
2. Open the Code tab and select the project folder. Confirm the execution environment before starting: the desktop reference distinguishes local, cloud, and SSH sessions.
3. Ask for a bounded change with an observable result, such as preserving a list's filters after navigating back from an item.
4. Review the proposed work and permission requests. Use a separate worktree when concurrent sessions could edit the same files.
5. Inspect the diff and run the repository's relevant checks. For UI work, exercise the actual interaction.

The desktop application does not install the terminal `claude` command as a substitute for the separate CLI installation. Desktop controls and CLI flags are also not interchangeable; the reference documents their equivalents and exceptions.

## Configuration and execution boundaries

Claude Code settings, project instructions, skills, and MCP connections belong to the coding environment. The desktop reference separately documents importing MCP servers configured for the chat application. Do not assume a chat connector automatically grants identical tools or credentials to a coding session.

A graphical desktop session does not establish that inference runs locally. Likewise, an SSH session runs commands in its selected remote environment, not in the desktop application's local folder. Check the environment, available executables, and credentials when a task moves between surfaces.

Claude Desktop and Claude Code are vendor products governed by Anthropic's applicable terms. Public integration repositories or open-source dependencies do not make the desktop application an open-source coding harness. Apply the same [permission boundaries](../../../development/coding-agents/coding-agent-permissions.md) and [verification criteria](../../../development/coding-agents/coding-agent-verification.md) used for terminal agents.
