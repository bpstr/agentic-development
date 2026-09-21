# Codex

Official documentation: [CLI](https://learn.chatgpt.com/docs/codex/cli), [cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment), [developer commands](https://learn.chatgpt.com/docs/developer-commands), [non-interactive execution](https://learn.chatgpt.com/docs/non-interactive-mode). Source: [openai/codex](https://github.com/openai/codex).

Codex is OpenAI's coding-agent environment. It inspects repositories, edits files, runs development tools, and iterates using their output. Calling a model API alone does not recreate its filesystem, tools, permissions, or repository workflow.

## Choose the execution surface

| Surface | Where repository tools execute | Integration boundary |
| --- | --- | --- |
| CLI or SDK in a local checkout | The machine running the runtime | Local process, filesystem, and credentials |
| Codex Cloud | The product's configured cloud environment | ChatGPT account, connected repository, cloud task |
| OpenAI Agents API | An API-selected hosted or self-hosted environment | Platform project key, API session, events, and artifacts |

The [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) runs the agent runtime where the SDK is deployed. Hosting it in your worker does not create a Codex Cloud task. The [OpenAI Agents API](../../../infrastructure/orchestration/managed-runtimes/openai-agents-api.md) is the managed API route; do not treat a product environment ID as an API environment or reuse undocumented browser endpoints.

## Start a repository session

Install Codex using the official platform-specific instructions, open a project directory, and run:

```bash
codex
```

Sign in using a supported account method. Inspect the active model and permission settings before assigning work. Project [AGENTS.md instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md) supply persistent conventions; the task supplies the desired behavior and acceptance criteria.

For scripted analysis, non-interactive execution supports JSON Lines events:

```bash
codex exec --sandbox read-only --json \
  "Trace webhook deduplication. Cite files and identify missing evidence."
```

This requires authentication and uses the configured service allowance. Parse the event stream and process exit status; arbitrary generated text is not a machine-readable success signal.

## Configure a cloud repository

Connect GitHub in the Codex product, authorize the intended repository, and create an environment in Codex settings. Select the branch or commit, runtime versions, setup, and verification requirements. The cloud container does not inherit your laptop's uncommitted files, running database, or installed packages. Review organization restrictions before assuming a repository is available. [Cloud workflow](https://developers.openai.com/codex/cloud)

For a Markdown-only repository, begin with minimal setup and the actual documentation checks. For an application, use the dependency and service setup it really requires. For example, this Bash setup fragment assumes a trusted repository with a root Go module and/or root npm lockfile:

```bash
set -euo pipefail
git rev-parse --verify HEAD
if [[ -f go.mod ]]; then
  command -v go
  go mod download
fi
if [[ -f package-lock.json ]]; then
  command -v npm
  npm ci
fi
```

Adapt paths for a monorepo. This prepares dependencies; it does not prove tests passed. Review package lifecycle scripts before running setup with secrets, and configure required test services separately.

Setup has internet access. Agent-phase internet access is off by default and has separate controls for allowed domains and HTTP methods. Ordinary environment variables are available throughout; secrets are setup-only and removed before agent execution. Do not write them into files retained by the environment cache. Use maintenance scripts or reset the cache when dependencies become incompatible. [Environment configuration](https://learn.chatgpt.com/docs/environments/cloud-environment), [internet policy](https://learn.chatgpt.com/docs/cloud/internet-access)

## Submit and inspect cloud work

Use a current CLI signed in with a cloud-capable ChatGPT account. Discover the configured environment ID interactively, then submit a bounded task:

```bash
codex cloud
```

```bash
: "${CODEX_ENV_ID:?Set the environment ID shown by codex cloud}"
codex cloud exec --env "$CODEX_ENV_ID" --attempts 1 \
  "Read AGENTS.md. Audit cloud-agent documentation coverage. Cite exact files. Do not edit, publish, or merge."

codex cloud list --env "$CODEX_ENV_ID" --json --limit 10
```

The cloud command is documented as experimental. `--attempts` is best-of-N execution, not a free retry allowance. Submission failure gives a nonzero exit; successful submission does not mean the remote work finished. The list response has a `tasks` array and optional pagination `cursor`; persist the returned task ID and inspect its status and result. [Command reference](https://learn.chatgpt.com/docs/developer-commands)

For an authorized change-producing task, review its cloud diff and checks before creating a PR. The CLI also supports applying the latest cloud diff locally:

```bash
: "${CODEX_TASK_ID:?Set the completed cloud task ID}"
codex apply "$CODEX_TASK_ID"
```

Run this only in the intended checkout after reviewing local changes. Applying a diff is not publishing or merging it. Verify again if the base branch changed.

## Account permissions and costs

As of September 21, 2026, advertised individual subscriptions include Plus at $20/month and Pro from $100/month. Local and cloud usage share allowances; additional usage can consume credits. Current credits are token-based, not a universal fixed charge per task. Account limits, speed settings, and model availability matter; the product's cloud model availability need not match the SDK/API catalog. [Product pricing](https://learn.chatgpt.com/docs/pricing)

API-key authentication supports CLI/SDK usage billed at API rates but does not itself grant the product's cloud integrations. The separate Agents API has its own model/tool/execution billing. Never assume a ChatGPT subscription covers developer API charges.

Use narrow repository access, isolated test data, and separate publication authority. Missing dependencies or denied commands must remain visible in the verification report. Parallel worktrees do not isolate shared external services; apply the [cloud run lifecycle](../cloud-coding-agents.md) and [permission policy](../coding-agent-permissions.md) to the actual execution surface.
