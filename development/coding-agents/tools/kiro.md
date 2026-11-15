# Kiro

Official sources: [documentation](https://kiro.dev/docs/), [IDE overview](https://kiro.dev/docs/ide/), [installation](https://kiro.dev/docs/getting-started/installation/), [steering](https://kiro.dev/docs/steering/), [hooks](https://kiro.dev/docs/hooks/), and [license](https://kiro.dev/license/).

Kiro is an agentic development product with a desktop IDE, terminal CLI, and additional web and mobile surfaces. Its desktop workflow combines a VS Code-based editor with coding agents and structured specifications. It is useful when requirements, design decisions, and implementation tasks should remain explicit repository artifacts throughout development.

## A specification-oriented workflow

1. Install the IDE through the official distribution, sign in, and open the repository.
2. Describe the feature and review the generated requirements, design, and task breakdown before implementation.
3. Add project conventions through steering files. Keep broadly applicable guidance short and make specialized context selective.
4. Execute a bounded task, inspect the edits, and run the checks that establish the required behavior.
5. Update the specification when implementation reveals a changed assumption; do not allow the plan and working code to drift silently.

Specs make intent inspectable, but a completed task checklist does not demonstrate that the application works. Use the same [verification criteria](../coding-agent-verification.md) as for other coding agents.

## Configuration and automation

Kiro uses `.kiro` configuration and supports project steering, hooks, skills, MCP connections, and custom agents. The [steering reference](https://kiro.dev/docs/steering/) explains workspace guidance and `AGENTS.md` support. Treat these files as [repository context](../repository-context.md), with explicit ownership and a review process.

Hooks can run commands or inject agent prompts on documented events. The [hooks reference](https://kiro.dev/docs/hooks/) provides the current schema and a surface support matrix. A shared configuration format does not mean that every hook or local file reference works in the IDE, CLI, web, and mobile environments. Validate the specific event and execution location before depending on automation.

## License and execution boundaries

Kiro IDE and Kiro CLI are proprietary distributions under AWS product terms. The [CLI product page](https://kiro.dev/cli/) distinguishes them from the earlier open-source Amazon Q Developer CLI repository. Public issue trackers and open-source dependencies do not change the current product's license.

Model access, local tools, and cloud execution are separate boundaries. Check the active account, working directory, hook authority, and environment before delegating work. See [coding-agent permissions](../coding-agent-permissions.md) for tool controls and [cloud coding agents](../cloud-coding-agents.md) for remote execution concerns.
