# Droid / Factory CLI

Official documentation: [Droid quickstart](https://docs.factory.com/droid-cli/quickstart), [CLI reference](https://docs.factory.com/droid-cli/cli-reference). Official product/distribution repository: [Factory-AI/factory](https://github.com/Factory-AI/factory).

Droid is Factory's coding agent, available through a terminal interface and other Factory integrations. The CLI supports interactive repository work and non-interactive tasks for scripts and CI. The official repository carries an all-rights-reserved notice; its public availability is not evidence that the proprietary agent runtime is open source.

## Start interactive work

The official repository documents npm installation alongside operating-system installers:

```bash
npm install -g droid
cd your-project
droid
```

Complete the prompted Factory authentication. Give the agent a scoped task with a verifiable result, such as finding a handler and explaining its tests. The terminal exposes review and autonomy controls; choose them according to the work being delegated instead of assuming every command has the same authority.

Useful documented session operations include `/review` for code review, `/sessions` for existing sessions, and `/mcp` for tool integrations. Use the installed command reference when configuring permission rules, plugins, or custom droids.

## Automation

`droid exec` runs a task without the interactive interface:

```bash
droid exec "Summarize the authentication implementation and cite its files."
```

For non-interactive authentication, the CLI reference documents `FACTORY_API_KEY`. Supply credentials through the runner's secret configuration; do not store them with prompts or repository files. A single-shot command can still execute a multi-step agent loop, so inspect its tool use and final result before treating it as a successful check.

## Distribution and execution boundaries

The standalone installer and npm distribution have different update behavior. Factory documents that npm binaries disable automatic updates by default, while standalone installations normally update themselves. Pin an approved package version for reproducible runners and record that version with results.

The CLI, model access, and Factory-hosted execution are distinct concerns. Running `droid` in a checkout does not make every connected service local, and delegating work does not transfer responsibility for repository permissions or merge decisions. Use isolated checkouts for concurrent modifications, retain exact build/test output, and review the resulting patch before publication.
