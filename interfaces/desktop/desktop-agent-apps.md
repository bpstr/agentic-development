# Desktop agent applications

A desktop agent application presents conversations, project context, tool activity, approvals, and results in a graphical workspace. It can embed an agent runtime, connect to an existing process, or control a remote worker. Installing a desktop client determines none of these boundaries by itself.

For coding, distinguish the **application**, the **agent that edits and runs code**, and the **provider that serves inference**. These may share a brand while using separate credentials, configuration, and billing. The [coding-agent catalog](../../development/coding-agents/coding-agent-catalog.md) lists terminal entry points and source licenses; this page compares the graphical interfaces.

## Standalone apps and agent workspaces

| Application | Graphical workflow | Execution and source boundary |
| --- | --- | --- |
| [Codex / ChatGPT desktop in Codex mode](../../development/coding-agents/tools/codex.md) | Open projects, run coding work, and inspect changes from a desktop workspace. | Select the actual local/cloud environment. The open-source Codex CLI does not establish the desktop application's license. |
| [Claude Desktop](apps/claude-desktop.md) | Chat, Cowork, and Claude Code's Code-tab workflow. | The Code tab is a coding interface; ordinary chat MCP settings are not automatically the complete Claude Code configuration. |
| [Google Antigravity App](../../development/coding-agents/tools/antigravity.md) | Manage coding agents, tasks, and results through a dedicated app. | The App, standalone IDE, and CLI are separate surfaces of a vendor product. |
| [T3 Code](apps/t3-code.md) | Coordinate agent sessions, worktrees, and diffs from desktop or web. | MIT interface over installed/authenticated agents; the selected agent retains its execution and model-access responsibilities. |
| [OpenCode desktop](../../development/coding-agents/tools/opencode.md) | Use the OpenCode coding runtime through a graphical app. | MIT project; the canonical repository labels desktop beta. Local workspace execution can still use hosted inference. |
| [DeepSeek Harness desktop/Web UI](../../development/coding-agents/tools/deepseek-harness.md) | Select a workspace, configure models/plugins, and run sessions. | MIT official DeepSeek harness in developer preview; its Electron shell and web interface share the harness rather than constituting model APIs. |
| [goose desktop](../../development/coding-agents/tools/goose.md) | Combine coding with extensions and reusable general-agent workflows. | Apache-2.0 client/runtime; provider and connected-service terms remain separate. |
| [Cline desktop](../../development/coding-agents/tools/cline.md) | Plan changes, approve actions, and inspect repository work. | Apache-2.0 main repository; do not extend this label to Cline's proprietary JetBrains plugin. |
| [Qwen Code desktop](../../development/coding-agents/tools/qwen-code.md) | Use graphical sessions alongside the terminal and web interfaces. | Apache-2.0 project; check the status of the chosen shell and daemon instead of assuming surface parity. |
| [OpenHands Agent Canvas](../../development/coding-agents/tools/openhands.md) | Self-host a browser-based control center for developer agents. | A web workspace adjacent to desktop apps, with configurable local/remote/cloud backends; it is not inherently an isolated native desktop runtime. |
| [Muse desktop](apps/muse-desktop.md) | A personal-agent application covering workspace and application workflows. | Coding-specific behavior belongs to the separate Muse Code implementation; an app integration is not an unrestricted host process. |

## Editors with integrated agents

| Editor or integration | Useful interaction | Boundary to check |
| --- | --- | --- |
| [Cursor](../../development/coding-agents/tools/cursor.md) | Read, edit, run, and review within a code editor. | Local editor Agent, Cursor CLI, and cloud agents have different execution contexts. |
| [Devin Desktop, formerly Windsurf](../../development/coding-agents/tools/devin-desktop.md) | Combine an IDE with local and remote agent management. | Preserve Windsurf as a historical alias; new local sessions use Devin Local, while Cascade is legacy. |
| [Visual Studio Code with GitHub Copilot](../../development/coding-agents/tools/github-copilot.md) | Use agent conversations alongside files, terminal, tests, and debugger. | VS Code hosts extensions; Copilot service, the open-source Chat extension, and Copilot CLI are distinct components. |
| [Kiro IDE](../../development/coding-agents/tools/kiro.md) | Work from specifications, steering, tasks, and hooks. | Shared configuration does not guarantee every feature works identically across IDE and CLI. |
| [Zed](../../development/coding-agents/tools/zed-agent.md) | Use its native agent or connect an external ACP agent. | The editor's model settings do not configure an external agent's providers or credentials. |
| [JetBrains Junie](../../development/coding-agents/tools/junie.md) | Use a coding agent in the existing JetBrains project environment. | Junie is distinct from the broader AI Assistant feature set; its CLI is another surface. |
| [Cline extension](../../development/coding-agents/tools/cline.md) | Approve and review agent operations inside the editor. | Review auto-approval and provider configuration; source licensing differs between the main project and JetBrains plugin. |

Agent extensions such as [Codex](../../development/coding-agents/tools/codex.md) and [Claude Code](../../development/coding-agents/tools/claude-code.md) also run inside existing editors. An extension need not replace the editor or provide its own desktop application.

## Select by the review and execution workflow

Start with the interaction the developer needs: editing with immediate diff review, coordinating several isolated tasks, or continuing cloud work after the laptop disconnects. Then identify where commands run and which component owns credentials, session state, and cancellation. Worktrees separate repository changes but do not isolate shared databases or external services.

Check keyboard access, readable tool activity, permission prompts, interruption, recovery, and exportable diffs on a real task. For an external-agent interface, verify authentication and protocol support for the particular installed agent. For local-model use, configure the runtime's inference provider; a desktop download alone does not enable offline execution.

[OpenRouter](../../infrastructure/hosting/gateways/openrouter-gateway.md) can supply model routing to supported runtimes. It does not supply the desktop interface or authorize filesystem access. Apply [coding-agent verification](../../development/coding-agents/coding-agent-verification.md) to the resulting change regardless of which graphical client presented it.
