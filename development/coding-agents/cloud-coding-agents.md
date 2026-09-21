# Cloud coding agents

A cloud coding agent works on a repository in a remote execution environment: it reads files, edits code, runs commands, and produces reviewable results without requiring a developer's laptop to stay online. Remote model inference alone is not cloud execution. A local CLI can call a hosted model while every filesystem operation and test still runs locally.

Separate three deployment choices:

| Choice | What it provides | What the caller still owns |
| --- | --- | --- |
| Coding-product cloud task | A ready-made coding workflow with repository connection, environment configuration, and review UI | Task scope, repository authorization, setup, review, and publication decisions |
| Managed agent API | Provider-operated agent loop, sessions, events, and optional execution environments | Application identity, task admission, tool authorization, event recovery, verification, and result delivery |
| Agent SDK on your infrastructure | A programmable agent runtime inside your worker | Worker lifecycle, isolation, credentials, networking, persistence, upgrades, and compute billing |

[Codex](tools/codex.md) and [Claude Code](tools/claude-code.md) expose product workflows. [OpenAI Agents API](../../infrastructure/orchestration/managed-runtimes/openai-agents-api.md) and [Claude Managed Agents](../../infrastructure/orchestration/managed-runtimes/claude-managed-agents.md) expose application-controlled sessions. An SDK deployed to a cloud VM is your cloud deployment, not automatically a task in the provider's coding product. Remote control of a local session moves the interface, not the execution host. The [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) and [Claude SDK hosting guide](https://code.claude.com/docs/en/agent-sdk/hosting) describe the runtime boundary.

## Harness, environment, and session

The **harness** manages the model/tool loop. The **environment** supplies compute, files, dependencies, and network access. The **session** binds a conversation and its work to configuration. A **turn** is one period of work within that session; it can contain many model requests and tool calls.

A managed harness can use either provider-hosted or self-hosted execution. Moving the sandbox does not necessarily move the harness, model inference, or stored transcript into your network. Reusing an environment definition does not imply a shared filesystem. [OpenAI architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture) and [Claude environments](https://platform.claude.com/docs/en/managed-agents/environments) document these boundaries.

An integration should maintain its own job record rather than treating a provider session as its entire business workflow. Record the requesting principal, tenant, repository, base commit, task specification, configuration revision, provider session ID, outcome, and publication receipt. Keep credentials out of this record.

## Repository-to-result lifecycle

```text
Authorize task and reserve budget
  → select repository and immutable commit
  → prepare isolated workspace and dependencies
  → inspect, edit, test, and revise
  → collect patch, report, and test evidence
  → independently verify
  → authorize branch / pull request publication
  → review and separately authorize merge / deployment
```

Resolve a moving branch to a commit before execution. Include intended submodules and large-file assets explicitly; a shallow checkout does not guarantee that every dependency is available. Local uncommitted work is absent from a remote checkout unless a product deliberately uploads it. Inspect uploaded bundles as data exports, not just as convenient Git operations.

Prepare trusted setup independently of the agent's task. Pin runtime and dependency versions, make setup fail on missing prerequisites, and use synthetic test data. Cache dependencies without caching credentials or another tenant's workspace. Record cold-start and warm-start behavior separately. The [Codex cloud environment lifecycle](https://learn.chatgpt.com/docs/environments/cloud-environment) illustrates checkout, setup, cache maintenance, and agent execution as distinct phases.

Give each concurrent task its own workspace and test resources. Separate worktrees do not isolate a shared database, package cache with executable hooks, or external API. Shared publication must detect stale bases and conflicts rather than let the last finishing agent overwrite newer work.

## Completion is an application decision

Use separate states for accepted, preparing, running, waiting for approval, budget-paused, failed, cancellation-requested, stopped, and awaiting verification. These are suggested application states, not portable provider enum names.

A successful HTTP submission proves acceptance, not task completion. A finished turn marks an execution boundary, not proof that tests passed. An idle session can be waiting for tool input. Save authoritative output and execution receipts before marking the business job successful. [OpenAI session outcomes](https://developers.openai.com/api/docs/guides/agents-api/sessions) and [Claude session events](https://platform.claude.com/docs/en/managed-agents/events-and-streaming) expose different lifecycle signals.

Make the browser connection disposable. Persist the provider identity as soon as it is returned, restore state from authoritative history after a disconnect, and deduplicate application submissions. Do not invent universal event replay, idempotency headers, or cancellation semantics: implement each provider's actual contract. An ambiguous submission timeout needs reconciliation, not an immediate second job.

Cancellation is not rollback. A pushed commit or sent message may already exist. Reconcile side effects before reporting what stopped, and make retries reuse existing publication receipts where possible.

## Worked acceptance contract

For a repair task, use a contract such as: reproduce duplicate webhook processing with a synthetic fixture; add a regression test; implement the smallest correction; run the targeted test and existing relevant suite; return a patch and evidence without production access.

The verification worker checks the exact base SHA, applies the patch in a fresh workspace, runs the declared checks independently, and compares changed paths with the authorized scope. Preserve command, exit status, relevant output, and tested commit. A claimed passing test without execution evidence is unverified; an unavailable database is a limitation, not a passing result.

Publication is a separate authorized step. A backend can create a task branch and draft PR after validating the patch, without giving the agent a general GitHub write credential. Require an independent merge gate. Repository policy and credentials enforce this boundary; a prompt saying "do not merge" does not. See [coding-agent permissions](coding-agent-permissions.md).

## Failure scenarios to exercise

Use disposable repositories, synthetic secrets, stubbed provider events, and isolated services. The scenarios below are test designs, not reported test results.

| Injected condition | Required observation |
| --- | --- |
| Revoke the repository token before checkout | Authorization failure is visible; no fallback to a broader credential |
| Expire a short-lived token during a long run | Existing local work remains attributable; the broker refreshes only the authorized capability |
| Remove a required runtime or test service | Setup/check fails explicitly; verification is not marked passed |
| Repeat a webhook or lose the submit response | One business job is admitted; uncertain remote creation is reconciled before retry |
| Disconnect during a tool call | Restore the same session and authoritative output without duplicating the side effect |
| Request approval or exhaust the budget | Waiting and budget states remain distinct from success; no automatic permission or budget escalation |
| Cancel while publication is in progress | Record any completed branch/PR operation; stopping does not claim to undo it |
| Advance the target branch before publication | Detect the stale base, rebase or reject deliberately, then rerun relevant verification |
| Place a secret-exfiltration instruction in a fixture | Credentials and tool/network policies prevent unauthorized disclosure; refusal alone is not the test |
| Reuse an artifact filename in another turn | Select the intended session, turn/version, and path rather than an older matching name |
| Run two tenants against similar repository names | Neither credentials, artifacts, histories, nor caches cross the tenant boundary |

Include a normal successful run alongside failures. Verify required user notifications and cleanup as well as provider status transitions.

## Cost and operating limits

Estimate a run as model input, cache writes/reads, model output, hosted tools, execution time, storage, and external services. Count requests across the entire loop, including retries and subagents. Initial prompt length and a high cache-hit percentage do not determine the total bill.

Use admission limits, concurrency limits, deadlines, and provider-enforced budgets where available. Distinguish an alert or model-advisory budget from a spending control, and allow for in-flight work at a stop boundary. Measure cost per accepted change, verification success, and rework, not just cost per started session. Concrete billing examples belong in the implementation pages rather than this concept.

Before processing private code, check where inference, tool execution, transcripts, credentials, and artifacts reside independently. Define retention and deletion for both provider and application copies. Export durable deliverables before sandbox expiry. Self-hosting increases control over execution but also makes isolation, patching, resource quotas, monitoring, and cleanup your responsibility.
