# Coding-agent catalog

This catalog compares coding tools by the interface a developer uses, the runtime that executes repository operations, and the source license of that runtime. Each implementation page links to official documentation and installation instructions. It covers common commercial products and representative open-source approaches; inclusion is not a performance ranking.

A terminal agent can call a hosted model while editing local files. A desktop app can manage an external agent without implementing its execution loop. A cloud agent runs repository tools remotely. Use the [coding-agent definition](coding-agent-definition.md) and [cloud execution model](cloud-coding-agents.md) to distinguish these arrangements.

## Terminal agents and CLI tools

The commands below identify the installed entry point; they are not a universal installation script. Authentication, platform support, provider configuration, and headless permissions are documented in the linked guides.

| Tool | CLI entry point | Source/license boundary | Main reason to evaluate it |
| --- | --- | --- | --- |
| [Claude Code](tools/claude-code.md) | `claude` | Proprietary runtime; public documentation/issue repository | Repository exploration, implementation, tests, and automation, with separate desktop and cloud surfaces. |
| [Codex CLI](tools/codex.md) | `codex`; `codex exec` for automation | Apache-2.0 CLI; desktop application and hosted services have separate terms | Local terminal work, scripted execution, IDE integration, and reviewable cloud handoffs. |
| [Grok Build](tools/grok-build.md) | `grok` | Apache-2.0 official xAI runtime | Interactive coding, headless tasks, and ACP integration; distinct from community `grok-cli` projects. |
| [Gemini CLI](tools/gemini-cli.md) | `gemini` | Apache-2.0 | Google's terminal agent, currently positioned for enterprise Gemini Code Assist workflows. |
| [Google Antigravity](tools/antigravity.md) | `agy` | Vendor-distributed product | An agent available through CLI, app, and IDE surfaces; current Gemini CLI guidance directs individual users here. |
| [OpenCode](tools/opencode.md) | `opencode` | MIT | A configurable coding runtime with terminal, desktop, and editor interfaces and multiple inference providers. |
| [Qwen Code](tools/qwen-code.md) | `qwen` | Apache-2.0 | Terminal coding and automation with additional desktop, web, and editor interfaces. |
| [Aider](tools/aider.md) | `aider` | Apache-2.0 | Git-oriented pair programming with explicit file context, repository maps, and test/lint feedback. |
| [goose](tools/goose.md) | `goose` | Apache-2.0 | Coding and broader tool workflows using a local desktop/CLI runtime, extensions, and recipes. |
| [Cline](tools/cline.md) | `cline` | Apache-2.0 main repository; JetBrains plugin is not open source | Approval-oriented editing and execution across editor, desktop, and terminal clients. |
| [Mistral Vibe](tools/mistral-vibe.md) | `vibe` | Apache-2.0 | Terminal and programmatic coding with configurable model providers and tool permissions. |
| [Kimi Code CLI](tools/kimi-code.md) | `kimi` | MIT current implementation | Terminal coding, shell tools, and ACP integration; replaces the archived `kimi-cli` implementation. |
| [GitHub Copilot CLI](tools/github-copilot.md) | `copilot` | Proprietary/custom CLI terms; Copilot Chat extension has a separate MIT license | A terminal agent with GitHub context; distinct from hosted Copilot coding-agent tasks and historical `gh copilot`. |
| [Cursor CLI](tools/cursor.md) | `agent` | Proprietary product | Use Cursor's coding agent in terminal workflows alongside its editor and cloud interfaces. |
| [Kiro CLI](tools/kiro.md) | `kiro-cli` | Proprietary; old Amazon Q CLI source does not license Kiro | Spec-oriented coding with reusable steering, agent configuration, and hooks. |
| [Junie CLI](tools/junie.md) | `junie` | Proprietary; public release repositories are not runtime source | Use the JetBrains coding agent from terminals and automation as well as IDEs. |
| [Amp](tools/amp.md) | `amp` | Commercial/proprietary | Terminal coding with local execution or explicitly selected remote runners. |
| [Factory Droid](tools/factory-droid.md) | `droid`; `droid exec` for automation | Proprietary | Interactive development and scripted repository tasks with configurable autonomy. |
| [DeepSeek Harness](tools/deepseek-harness.md) | `dsh`; web launcher `npx @deepseek-ai/dsh web` | MIT; developer preview | An extensible harness with web/desktop interfaces and headless/ACP profiles; not merely a DeepSeek model wrapper. |

Provider credentials and inference charges remain separate from the client license. Open source does not imply local inference, an unrestricted subscription, or identical capabilities across every model.

## Editors, desktop apps, and agent control interfaces

The [desktop-app catalog](../../interfaces/desktop/desktop-agent-apps.md) compares graphical interfaces and their execution boundaries. Several CLI products above also supply desktop apps or IDE integrations; use their canonical implementation page rather than treating every interface as a different agent.

| Implementation | Interface role | Relationship to the executing agent |
| --- | --- | --- |
| [Claude Desktop](../../interfaces/desktop/apps/claude-desktop.md) | Desktop application with chat, Cowork, and a Code tab | The Code tab presents Claude Code; ordinary desktop chat has different configuration and tool boundaries. |
| [T3 Code](../../interfaces/desktop/apps/t3-code.md) | MIT desktop/web interface and agent control plane | Coordinates installed and authenticated agents, worktrees, and review; it does not replace their runtimes or model access. |
| [Devin Desktop, formerly Windsurf](tools/devin-desktop.md) | Coding IDE and agent management interface | Current local sessions use Devin Local; Cascade is legacy, and Devin Cloud is a separate execution environment. |
| [Zed Agent](tools/zed-agent.md) | Open-source editor with a native agent and external ACP agents | Native model configuration and external-agent authentication are separate. |
| [OpenHands Agent Canvas](tools/openhands.md) | MIT self-hosted developer control center | Coordinates OpenHands and compatible agents against configured local, remote, or cloud backends. |

The repository also covers [Grok Bot](tools/grok-bot.md) and [Muse Code](tools/muse-code.md) as additional coding-product workflows. Their product accounts, environment choices, and API boundaries belong in their implementation guides.

## Archived and maintenance-ended implementations

Availability of an old installer or documentation site does not establish ongoing maintenance.

| Implementation | Status to preserve in evaluations | Source scope |
| --- | --- | --- |
| [Roo Code](tools/roo-code.md) | Products shut down on May 15, 2026; repository archived. Retain for historical comparison and migration. | Apache-2.0 extension source remains available. |
| [Continue CLI](tools/continue-cli.md) | Maintainers declare development ended and the repository read-only, with 2.0.0 the final release. This declaration is distinct from GitHub's archive flag. | Apache-2.0 source; `cn` examples document the retained implementation. |
| [Legacy OpenHands CLI](tools/openhands.md) | Maintainers state the standalone CLI is no longer actively maintained and direct users to Agent Canvas. | Legacy CLI source remains MIT; Canvas and enterprise components have their own boundaries. |

## Compare a complete development workflow

Evaluate the same bounded repository task with each candidate. Record the actual execution host, selected provider/model, instructions and tools loaded, permissions, changed files, test results, cancellation behavior, and recovery after interruption. For automation, also check the process exit status and structured events; a successful submission or fluent final answer is not proof of a successful change.

Measure cost per verified task, including repeated context, retries, and failed attempts. Compare tool discovery and configuration overhead as well as model behavior. Keep [repository context](repository-context.md), [permissions](coding-agent-permissions.md), and [verification](coding-agent-verification.md) explicit.

[OpenRouter](../../infrastructure/hosting/gateways/openrouter-gateway.md) belongs to model access and routing. A compatible agent may use it for inference while retaining its own file tools, approvals, and execution loop. [ACP](../../infrastructure/protocols/agent-ui/agent-ui-communication.md#agent-client-protocol-for-editor-integrations) connects a client/editor to an agent; MCP connects agents to tools. Neither protocol transfers a vendor subscription or guarantees model compatibility.
