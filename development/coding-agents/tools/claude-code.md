# Claude Code

Official documentation: [overview and installation](https://code.claude.com/docs/en/overview), [CLI reference](https://code.claude.com/docs/en/cli-reference), [cloud sessions](https://code.claude.com/docs/en/claude-code-on-the-web), [routines](https://code.claude.com/docs/en/routines).

Claude Code is Anthropic's coding-agent environment for repository work. It reads code, edits files, executes commands, and integrates with developer tools. Its terminal, editor, desktop, and cloud surfaces do not all execute on the same machine.

## Local execution and project context

Install through the official operating-system instructions. On macOS:

```bash
brew install --cask claude-code
cd your-project
claude
```

Complete authentication and provide a bounded task with verification criteria. For scripted output:

```bash
claude -p "Explain the invoice retry path with file references." \
  --output-format json
```

The command uses its configured account/provider, permissions, and tools; it is not an offline parser. Use project instruction files for enduring conventions, and consult [project memory](https://code.claude.com/docs/en/memory) for the distinct loading behavior of `CLAUDE.md`, supported `AGENTS.md` instructions, and automatic memory. Skills package procedures; plugins distribute extensions. None proves that a change works: preserve acceptance criteria and execution evidence separately.

## Cloud execution versus Remote Control

`--cloud` starts cloud work. `--remote-control` exposes a local session for remote interaction; its tools still execute locally. In the standard GitHub-connected workflow, the cloud VM clones the remote branch rather than your local checkout, so push intended commits first. Cloud sessions remain available after closing the local client. [Execution surfaces](https://code.claude.com/docs/en/claude-code-on-the-web)

Connect the Claude GitHub App to the intended repository during web onboarding, then select a cloud environment. Configure setup, dependencies, network access, and test credentials. Prefer selected-repository access over forwarding an account-wide `gh` token. Review the product's alternative GitHub authentication methods before choosing one.

```bash
# Run from the intended, GitHub-connected repository.
claude --cloud \
  "Read repository instructions. Audit cloud-agent coverage with file references. Do not edit or publish."
```

The current cloud interface is a research preview with plan and organization-policy requirements. It also supports bundle-upload workflows in some repository configurations. A bundle can include history and tracked local changes; inspect what is uploaded and never assume secret-name filtering removes committed secrets. The standard remote-clone example above is not a claim that every cloud start ignores local files. [Cloud handoff and bundle behavior](https://code.claude.com/docs/en/claude-code-on-the-web)

Ordinary cloud environment variables are readable by commands. For supported Pro/Max environments, proxy-injected API credentials keep raw values outside the VM and attach them to configured hosts. They are not available on Team/Enterprise in the documented configuration and do not apply to setup-script requests. GitHub has its own authentication proxy. [Cloud environment credentials](https://code.claude.com/docs/en/cloud-environments)

## Trigger a saved routine through HTTP

A routine saves a prompt, repositories, environment, and connectors. In the web UI, create the routine, add an API trigger, and copy its generated URL and one-time-displayed token. Remove unused connectors: included integrations can carry write authority during unattended runs. The saved prompt should interpret incoming payload data within a fixed task, not authorize arbitrary caller instructions. [Routine setup](https://code.claude.com/docs/en/routines)

For example, save an audit routine restricted to the selected repository, with instructions to use `<routine-fire-payload>` only to choose an audit focus and never to change publication policy.

```bash
set -euo pipefail
: "${CLAUDE_ROUTINE_URL:?Copy the generated routine fire URL}"
: "${CLAUDE_ROUTINE_TOKEN:?Set the routine-specific token}"

# URL shape: https://api.anthropic.com/v1/claude_code/routines/<trigger-id>/fire
curl --fail-with-body --silent --show-error \
  --request POST "$CLAUDE_ROUTINE_URL" \
  -H "Authorization: Bearer $CLAUDE_ROUTINE_TOKEN" \
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  --data '{"text":"Focus the saved audit on cloud execution, repository permissions, and costs."}' \
  --output routine-run.json
```

The response contains `claude_code_session_id` and `claude_code_session_url`. The token authorizes triggering one routine, not reading its session or calling the general Claude Platform API. It is not an `ANTHROPIC_API_KEY`, and the fire endpoint has no general Platform SDK integration. Calls consume the Claude Code account's usage. Request shapes and limits are experimental. [Routine API reference](https://platform.claude.com/docs/en/api/claude-code/routines-fire)

Persist the returned session identity and review the run through its authorized product interface. A green routine status can mean infrastructure execution succeeded while the requested task did not. Do not use it as test evidence. Protect the trigger token from logs, rotate it through the routine UI, and deduplicate external events in the calling service before firing another run. [Routine run interpretation](https://code.claude.com/docs/en/routines)

## Managed API and self-hosted alternatives

For application-owned agent/environment/session configuration, use [Claude Managed Agents](../../../infrastructure/orchestration/managed-runtimes/claude-managed-agents.md). Its Platform key, resource IDs, events, and billing are separate from Claude Code routines. Do not infer Platform read access from a routine's session URL.

The [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/hosting) can instead run on infrastructure you operate. That requires an actual runtime host, workspace provisioning, isolation, and credential management. A model request alone does not clone repositories or run tests.

## Costs and operational boundaries

Cloud sessions share account usage limits with other Claude/Claude Code work; the cloud documentation states there is no separate VM compute charge. Parallel work still consumes model allowance. Routine triggers do not make the resulting work free. Check [current subscription pricing](https://claude.com/pricing) and [cloud limits](https://code.claude.com/docs/en/claude-code-on-the-web) for the selected plan; Managed Agents uses developer API billing instead.

Keep one isolated workspace and test-resource set per task. Review diffs, exact test results, unavailable checks, and repository permissions before publishing. Export needed outputs before environment expiry. Tenant boundaries, approval enforcement, and merging remain application/repository responsibilities even when the product runs the agent in the cloud; see [cloud coding agents](../cloud-coding-agents.md).
