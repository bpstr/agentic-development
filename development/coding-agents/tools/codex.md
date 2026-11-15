# Codex

Official documentation: [desktop app](https://learn.chatgpt.com/docs/app), [CLI](https://learn.chatgpt.com/docs/codex/cli), [IDE extension](https://learn.chatgpt.com/docs/codex/ide), [cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments), [developer commands](https://learn.chatgpt.com/docs/developer-commands), [non-interactive execution](https://learn.chatgpt.com/docs/non-interactive-mode). Source: [openai/codex](https://github.com/openai/codex), [Apache-2.0 CLI license](https://github.com/openai/codex/blob/main/LICENSE).

Codex is OpenAI's coding-agent environment. It inspects repositories, edits files, runs development tools, and iterates using their output. Calling a model API alone does not recreate its filesystem, tools, permissions, or repository workflow.

The CLI is open source under Apache-2.0. This license applies to the published CLI source, not automatically to the desktop application, hosted model service, or cloud product. Those have separate account, usage, and service terms.

## Choose the execution surface

| Surface | Where repository tools execute | Integration boundary |
| --- | --- | --- |
| Desktop app in Codex mode | The local or cloud environment selected for the task | Graphical project/session management and change review; inspect the active environment |
| Codex IDE extension | The selected local or delegated cloud environment | Editor context and review UI around the agent |
| CLI or SDK in a local checkout | The machine running the runtime | Local process, filesystem, and credentials |
| Codex Cloud | The product's configured cloud environment | ChatGPT account, connected repository, cloud task |
| OpenAI Agents API | An API-selected hosted or self-hosted environment | Platform project key, API session, events, and artifacts |

The [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) runs the agent runtime where the SDK is deployed. Hosting it in your worker does not create a Codex Cloud task. The [OpenAI Agents API](../../../infrastructure/orchestration/managed-runtimes/openai-agents-api.md) is the managed API route; do not treat a product environment ID as an API environment or reuse undocumented browser endpoints.

## Start from the desktop

Install the [ChatGPT desktop app](https://learn.chatgpt.com/docs/app), sign in, select Codex, and open the intended project or folder. Choose the work environment before assigning a task, then inspect the resulting diff and verification output. The command `codex app` launches the desktop application on supported platforms; it is not the same as starting the terminal TUI. Ordinary ChatGPT chat, Work mode, and Codex are distinct workflows within the application.

## Start a repository session

Install Codex using the official platform-specific instructions or the npm package below, then run it from a project directory:

```bash
npm install -g @openai/codex
codex
```

Sign in using a supported account method. Inspect the active model and permission settings before assigning work. Project [AGENTS.md instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md) supply persistent conventions; the task supplies the desired behavior and acceptance criteria.

For scripted analysis, non-interactive execution supports JSON Lines events:

```bash
codex exec --sandbox read-only --json \
  "Trace webhook deduplication. Cite files and identify missing evidence."
```

This requires authentication and uses the configured service allowance. Parse the event stream and process exit status; arbitrary generated text is not a machine-readable success signal.

## Configure a current cloud environment

Choose **Work in → Cloud** in the web or desktop product. A reusable environment defines repositories, dependencies, tools, and access for future tasks. Create the environment, complete setup, inspect the setup report and configuration, and publish it before starting tasks from that prepared state. Saving configuration, publishing a prepared filesystem, and sharing access are separate operations. A default environment can support repository-free work where available. [Current cloud environment guide](https://learn.chatgpt.com/docs/environments/cloud-environments)

Each task receives its own workspace. A local checkout, its uncommitted files, and the credentials of a local CLI session are not automatically present. Check the current environment's service access and secrets configuration directly.

## Legacy repository environments

The following checkout/setup lifecycle applies to **Codex Cloud (Legacy)**, which the official documentation retains for Code Review and the Linear/GitHub integrations. It is not the configuration contract for every current cloud task. [Legacy environment guide](https://learn.chatgpt.com/docs/environments/cloud-environment)

Connect GitHub in the Codex product, authorize the intended repository, and create a legacy environment in Codex settings. Select the branch or commit, runtime versions, setup, and verification requirements. The cloud container does not inherit your laptop's uncommitted files, running database, or installed packages. Review organization restrictions before assuming a repository is available.

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

Subscription eligibility, local/cloud allowances, credits, and organization controls vary by account and surface. Use the current [plan and access documentation](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) and [product pricing](https://learn.chatgpt.com/docs/pricing) rather than assuming a fixed number of tasks. Model availability in a product environment need not match an SDK/API catalog.

API-key authentication supports CLI/SDK usage billed at API rates but does not itself grant the product's cloud integrations. The separate Agents API has its own model/tool/execution billing. Never assume a ChatGPT subscription covers developer API charges.

Use narrow repository access, isolated test data, and separate publication authority. Missing dependencies or denied commands must remain visible in the verification report. Parallel worktrees do not isolate shared external services; apply the [cloud run lifecycle](../cloud-coding-agents.md) and [permission policy](../coding-agent-permissions.md) to the actual execution surface.
