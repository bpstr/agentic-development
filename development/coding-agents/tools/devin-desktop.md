# Devin Desktop and Devin Local

Official sources: [Devin Desktop overview](https://docs.devin.ai/desktop/introducing-devin-desktop), [Windsurf migration FAQ](https://docs.devin.ai/desktop/devin-desktop-faq), [Devin Local](https://docs.devin.ai/desktop/devin-local/overview), [ACP integration](https://docs.devin.ai/desktop/acp), and [legacy Cascade reference](https://docs.devin.ai/desktop/cascade).

Devin Desktop is the current name of the Windsurf desktop IDE. It combines an editor with an Agent Command Center for local and cloud agents. **Devin Local** is its primary local coding agent, sharing a harness with Devin CLI. This combination is useful when a developer wants code navigation, task delegation, and review in one desktop application.

## Product and agent distinctions

The desktop application is the interface; Devin Local executes against local files and tools. Devin Cloud is a separate hosted execution product. Third-party agents connected through ACP bring additional runtime and authentication boundaries. Selecting an agent does not imply that every model, credential, or setting is shared across these execution paths.

Windsurf remains a useful historical search term. Its former Cascade agent is documented as legacy: current desktop documentation says new sessions start with Devin Local and old Cascade conversations no longer open. The migration FAQ separately identifies the Windsurf JetBrains plugin as being in maintenance mode and directs users toward Devin over ACP.

## First repository task

1. Follow the setup link from the desktop overview, install the application, and open the repository.
2. Select Devin Local for work in the local development environment, or explicitly select a different execution target.
3. Describe one observable behavior to implement. Inspect the plan, requested permissions, and working directory.
4. Use the documented worktree workflow when isolating a change from the main checkout or another agent session.
5. Review the diff, run relevant checks, and exercise the affected behavior before integrating the result.

The migration FAQ documents compatibility with existing Windsurf rules and the preferred `.devin/rules/` location. Preserve useful existing configuration while checking which files the active agent loads; see [repository context](../repository-context.md).

## Operational boundaries

Devin Desktop is a commercial application. ACP interoperability and support for open models are not an open-source license for the application or hosted service. Local execution also does not mean model requests remain on the machine.

Devin Local's documentation describes separate permissions and OS-level sandbox controls. Review those controls before unattended work. A worktree separates source changes but does not isolate shared credentials, databases, or services. Use [coding-agent permissions](../coding-agent-permissions.md), [verification](../coding-agent-verification.md), and the [cloud-coding distinction](../cloud-coding-agents.md) when comparing its execution surfaces.
