# Google Antigravity

Official sources: [product surfaces](https://antigravity.google/docs/overview), [getting started](https://antigravity.google/docs/getting-started), [features](https://antigravity.google/docs/features), [FAQ](https://antigravity.google/docs/faq), and [terms](https://antigravity.google/terms).

Google Antigravity is an agentic development product spanning a standalone desktop App, a standalone IDE, editor integrations, a terminal CLI, and a programmatic SDK. It implements repository work through an agent that can inspect code, edit files, run tools, and present plans and artifacts for review. The App provides a central interface for managing agent work beyond one editor window.

## Choose and configure a surface

Use the App when coordinating tasks and reviewing their outcomes is the main activity. Use an editor integration when code navigation and interactive development remain central. Choose the CLI for terminal work or an explicitly scripted invocation. The standalone App and standalone IDE are distinct distributions; follow the setup guide for the selected surface.

1. Install through the official getting-started flow and select an authentication method supported by the chosen surface and account.
2. Open the repository and check the agent's working directory and tool permissions.
3. Start with one bounded task and inspect the proposed plan or resulting diff.
4. Run the relevant checks and review the actual application behavior before accepting the change.

After installing the CLI, the documented terminal entry points include:

```sh
agy
agy -p "Explain the repository's test commands without changing files"
```

Interactive and noninteractive invocation are separate execution choices; a prompt requesting read-only work is not an enforced permission policy. Configure permissions before using scripts for unattended changes.

## Boundaries

Antigravity's [feature reference](https://antigravity.google/docs/features) distinguishes approval policy from terminal sandboxing. Inspect both rather than treating one as proof of the other. Parallel agent sessions also need coordination when they touch shared files or services; see [repository context](../repository-context.md) and [coding-agent permissions](../coding-agent-permissions.md).

Antigravity is a vendor-distributed product under Google's terms. Its support for open models or external tools does not make the product itself an open-source harness. The FAQ documents differences in account support between the App, CLI, integrations, and standalone IDE. It also distinguishes supported API access for third-party coding agents from Antigravity account credentials.

For evaluation, compare complete tasks, review effort, and [verification results](../coding-agent-verification.md). Keep local tool execution separate from where model inference is hosted.
