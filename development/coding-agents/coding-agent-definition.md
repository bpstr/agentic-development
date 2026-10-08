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

## Open-source clients, editors, and execution hosts

Separate three choices: the **client/editor** presents code and review controls; the **agent runtime** selects and executes development operations; the **inference provider** runs the model. They may be bundled, but replacing one need not replace the others. A desktop client using remote inference is not an offline model, and a provider-independent client does not automatically support every provider feature.

These implementations illustrate different integration decisions rather than a ranking:

| Implementation | Primary surface | When the distinction matters |
| --- | --- | --- |
| [Zed](https://github.com/zed-industries/zed) | Open-source editor with a native agent and [external ACP agents](https://zed.dev/docs/ai/external-agents) | Keep one editor while switching the executing agent. External agents retain their own authentication, model selection, and runtime. |
| [Eclipse Theia IDE](https://theia-ide.org/) | Open-source desktop/cloud IDE built on the extensible Theia platform | Choose a ready-made IDE or build a domain-specific environment with Theia AI. Theia is not a VS Code fork. |
| [Cline](https://github.com/cline/cline) | Open-source coding agent with editor, desktop, and CLI surfaces | Retain interactive review and permission controls across clients; inspect auto-approval settings rather than assuming every operation pauses. |
| [OpenCode](https://opencode.ai/docs) | Open-source terminal, desktop, and IDE-connected coding agent | Use provider or local-model configurations independently of optional OpenCode-hosted model access. Canonical source: [anomalyco/opencode](https://github.com/anomalyco/opencode). |
| [Aider](https://github.com/Aider-AI/aider) | Open-source terminal pair programmer centered on files, a repository map, and Git | Prefer an explicit file scope and inspectable Git changes over replacing the whole editor. |
| [Goose](https://github.com/aaif-goose/goose) | Open-source desktop/CLI agent with MCP extensions | Combine coding with broader local or service workflows. It is a general agent host, not a model family. |

The [Continue repository](https://github.com/continuedev/continue) now identifies itself as no longer actively maintained and read-only, with a final 2.0.0 release. Its source remains useful for historical comparison or maintained forks, but an old comparison presenting it as an actively maintained default is misleading.

For a concrete OpenCode first run, the [official quick start](https://opencode.ai/docs) installs the `opencode-ai` package, starts `opencode` in a checkout, and uses `/connect` and `/models` to configure inference. Preserve existing repository instructions before using any instruction-generating command. For Theia, [AI configuration](https://theia-ide.org/docs/user_ai/) is a separate setup step; prefer documented environment-based credentials over committing keys in settings.

[Agent Client Protocol](../../infrastructure/protocols/agent-ui/agent-ui-communication.md#agent-client-protocol-for-editor-integrations) connects editors to agents. [LiteLLM](https://docs.litellm.ai/docs/) adapts model APIs or operates a self-hosted gateway; [OpenRouter](../../infrastructure/hosting/gateways/openrouter-gateway.md) supplies hosted model routing. These solve different compatibility problems. An ACP adapter does not transfer subscription entitlements or remove tool-approval requirements.

Compare candidates using the assignment above: verify the diff, tests, cancellation, permission prompts, credential storage, and where source code leaves the machine. Check the licenses of the client, extensions, and model separately. Open-source client code does not make hosted inference free, open-weight, or private by default.
