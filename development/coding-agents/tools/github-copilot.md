# GitHub Copilot in editors and the terminal

Official sources: [VS Code agent overview](https://code.visualstudio.com/docs/agents/overview), [Copilot CLI installation](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli), [Copilot Chat source](https://github.com/microsoft/vscode-copilot-chat), [extension license](https://github.com/microsoft/vscode-copilot-chat/blob/main/LICENSE.txt), and [VS Code FAQ](https://code.visualstudio.com/docs/supporting/faq).

GitHub Copilot provides coding assistance and agent workflows across development interfaces. In Visual Studio Code, agents inspect a workspace, edit files, run commands, and work beside tests and a debugger. The terminal agent is installed separately; hosted coding-agent execution is another environment.

## Host, harness, and service

Visual Studio Code is the editor and agent host. The active agent harness supplies its tools and workflow, while the selected model provider supplies inference. Current VS Code documentation distinguishes Copilot, Claude, and Codex harnesses, supported provider accounts, and model API keys. These choices do not automatically share authentication or billing.

The Copilot Chat extension's published source is MIT-licensed. The [official FAQ](https://code.visualstudio.com/docs/supporting/faq) states that GitHub Copilot's backend services remain closed source. An open-source extension therefore does not establish a self-hostable replacement for the hosted product or remove its access requirements.

## Start with an editor task

1. Install VS Code, open the repository, and use its current AI setup flow to configure a supported account or model provider.
2. Select the agent harness and session environment. Keep work in the intended checkout or worktree.
3. Ask the agent to locate the implementation and checks for a small behavior before requesting the change.
4. Review tool approvals and inspect the resulting edits in the editor.
5. Run tests and exercise the behavior, including cases that the agent's own generated checks may miss.

The Chat view supports work beside the current code, while the Agents window supports coordinating sessions across projects. Use [repository context](../repository-context.md) to decide which instructions and files should accompany a task.

## Start the terminal agent

With Node.js 22 or later, the official npm installation is:

```sh
npm install -g @github/copilot
copilot
```

Follow the `/login` prompt when authentication is required. Organization policy can disable CLI access. This is the standalone coding agent, distinct from the historical `gh copilot` command assistant and the hosted coding agent.

The [Copilot CLI license](https://github.com/github/copilot-cli/blob/main/LICENSE.md) is proprietary and separate from the MIT Copilot Chat extension. Its public distribution repository does not grant the same source rights.

## Execution boundaries

Local, remote-hosted, and managed cloud sessions have different lifetimes and resource access. A local agent can send model requests to a hosted provider; local tools do not imply local inference. Conversely, a cloud session does not have the developer machine's services or credentials by default.

Keep editor source licensing, extension licensing, provider terms, and execution permissions separate. Apply [permission controls](../coding-agent-permissions.md) and [verification criteria](../coding-agent-verification.md) to each session. See [cloud coding agents](../cloud-coding-agents.md) for repository preparation, remote execution, and result integration.
