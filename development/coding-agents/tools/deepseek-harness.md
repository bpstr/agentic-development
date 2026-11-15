# DeepSeek Harness

[Official documentation](https://deepseek-harness.github.io/deepseek-harness/) · [Canonical repository](https://github.com/deepseek-ai/deepseek-harness) · [MIT license](https://github.com/deepseek-ai/deepseek-harness/blob/master/LICENSE)

DeepSeek Harness, exposed through the `dsh` command, is an official DeepSeek agent harness built around a plugin architecture. It provides workspace tools and agent execution through a local Web UI, a documented desktop application, and automation profiles. It is useful when developers need an extensible execution system rather than only access to a model endpoint.

The project is in **developer preview**, and its README warns that compatibility-breaking changes are expected. The harness and the DeepSeek model API are separate components; the [model setup guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/index.md) also describes other providers and custom OpenAI-compatible endpoints.

## Setup and first task

Install Node.js and launch the official npm package from the intended project directory:

```sh
npx @deepseek-ai/dsh web
```

The launcher prints the local URL. In the Web UI, configure a model under **Settings → Models**, add and select the workspace, and start a session. A useful first request is: “Summarize this repository and identify its main packages.” Follow it with a bounded edit and a specific verification step.

The documented lifecycle supports reading and editing workspace files, running commands, delegating work and maintaining a plan. Operations that need approval depend on the active permission policy.

## Automation and desktop

The [CLI reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md) defines named profiles. After installing or otherwise making `dsh` available, examples include:

```sh
dsh --profile headless "Summarize this repository"
dsh --profile acp
dsh --profile sdk
```

Headless execution creates a persisted session and exits after its response. ACP and SDK profiles serve clients over stdio. A terminal TUI should not be assumed to be a default profile; the reference's TUI example requires that profile to be installed.

The [desktop reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.md) describes an Electron application around the shared workspace UI and optional registration of its bundled `dsh` command. Follow its release-specific setup rather than mixing executable components between installations.

Plugin installation expands the code that executes locally. Apply deliberate [permissions](../coding-agent-permissions.md), pin compatible releases for reproducibility, and retain [verification evidence](../coding-agent-verification.md). The MIT source license does not include hosted model usage or guarantee production stability.
