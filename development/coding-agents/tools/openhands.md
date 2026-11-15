# OpenHands and Agent Canvas

[Official documentation](https://docs.openhands.dev/) · [Agent Canvas repository](https://github.com/OpenHands/OpenHands) · [MIT license](https://github.com/OpenHands/OpenHands/blob/main/LICENSE)

OpenHands provides software-agent execution components and interfaces. The current `OpenHands/OpenHands` repository presents **Agent Canvas**, a self-hosted control center for coding-agent conversations and automations. It can use the OpenHands agent or other ACP-compatible agents across local, remote and cloud backends.

This makes Canvas useful when the same interface must supervise several execution environments. The interface, the selected agent and the execution backend are separate choices; a local UI does not establish where a task runs or which model processes its context.

## Setup and first task

The current canonical README requires Node.js 24 or later and `uv` for its direct local setup:

```sh
npm install -g @openhands/agent-canvas
agent-canvas
```

This starts the local stack. Configure the agent backend and model credentials, select a workspace, and start with an inspection task. Then request a bounded implementation, review its diff, and run the project's verification commands.

The default direct-host setup is explicitly **without a sandbox**: the agent server runs on the machine with filesystem access. Follow the repository's Docker or separate-backend instructions when isolation is required. Per-conversation execution containers are distinct from containerizing the entire interface and automation service.

## CLI and licensing boundaries

The separate [OpenHands V1 CLI repository](https://github.com/OpenHands/OpenHands-CLI) says it is **no longer actively maintained** and recommends Agent Canvas. Its terminal, ACP, headless and cloud commands remain useful historical context, but should not be presented as the maintained default entry point. Existing installations need a migration check before replacing their launch commands or persisted configuration.

Agent Canvas's repository is MIT licensed. [OpenHands Enterprise](https://github.com/OpenHands/enterprise) has a separate commercial licensing arrangement; the open-source interface does not imply that every hosted or enterprise capability is covered by MIT. Model inference and hosted execution also have their own access and billing conditions.

## Operating considerations

Use separate workspaces for tasks that might conflict. Decide where credentials, conversation state and outputs persist, especially when switching backends. Configure [permissions](../coding-agent-permissions.md) at the execution boundary and preserve [verification evidence](../coding-agent-verification.md) with the resulting change. A completed Canvas conversation alone does not establish that a repository was tested or that its output was committed and published.
