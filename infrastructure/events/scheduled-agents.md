# Scheduled agents

Scheduled agents perform work at defined times or intervals: summaries, maintenance, synchronization, and recurring development. A schedule initiates an attempt; it does not establish that the work completed. Whether execution continues without an open application depends on the selected runtime.

Separate three responsibilities: a **trigger** determines when work becomes eligible, a **worker** executes it, and a **durable record** tracks progress and effects. A timer can start a local process directly for a small installation. A queue becomes useful when workers restart, multiple hosts compete, or load must be controlled. Neither architecture makes arbitrary external effects exactly-once. [Google SRE: distributed periodic scheduling](https://sre.google/sre-book/distributed-periodic-scheduling/).

## Choose the trigger from the requirement

| Requirement | Suitable trigger | Important distinction |
| --- | --- | --- |
| Send a digest each morning | Calendar recurrence in the recipient's time zone | Local morning is not a fixed UTC offset |
| Check status periodically | Fixed-rate or completion-relative interval | Starting every ten minutes differs from waiting ten minutes after completion |
| React to a pull request or message | Authenticated event, optionally with reconciliation | Polling is a fallback when the event cannot be consumed reliably |
| Work through an approved backlog | Queue-driven bounded work, with permitted operating hours | Continuous availability does not require continuous model inference |
| Resume after approval or another job | Durable signal or dependency completion | A guessed clock delay is not a dependency |
| Execute once before a deadline | One-shot trigger with an expiry | Remove or expire the schedule after its terminal outcome |

[Webhooks](webhooks.md), [background work](../../patterns/background-work.md), and scheduling can use the same worker. Avoid separate implementations of the business task for each trigger.

## Write an execution contract

Before choosing cron syntax, specify the task's owner, purpose, authoritative inputs, allowed effects, completion evidence, and failure destination. Then specify time, lateness, overlap, recovery, budget, and retention policies.

The following is an **illustrative application-owned configuration**, not an accepted format for any particular provider. The numerical limits are example policy choices, not measured recommendations.

```yaml
id: workspace-morning-digest
revision: 1
owner: workspace-admin
trigger:
  type: calendar
  expression: "0 8 * * 1-5"
  dialect: posix-five-field
  timezone: Europe/Budapest
  dst_gap: next_valid_time
  dst_fold: once
execution:
  concurrency_key: "workspace_id:morning-digest"
  max_active: 1
  overlap: coalesce
  misfire: latest_useful
  max_start_lateness_seconds: 1800
  timeout_seconds: 600
  max_attempts: 3
  retry_within_original_deadline: true
inputs:
  window: since_last_materialized_cutoff
  required_sources: [tasks, comments]
output:
  type: cited_summary
  max_words: 300
  no_change: record_success_without_notification
  partial_data: report_degraded_coverage
permissions:
  source_access: read_only
  destination: configured_workspace_digest
  source_mutation: forbidden
limits:
  model_calls: 4
  output_tokens: 2000
  daily_budget_policy: workspace_digest_budget
state:
  store: application_database
  occurrence_identity: "workspace_id:schedule_id:intended_time_utc"
```

A scheduler adapter must implement these policies or reject unsupported combinations. It must not silently translate one provider's DST, interval, or overlap behavior into another's. Budget enforcement belongs in the harness or tool gateway, not only in the prompt.

Keep the schedule identity stable across edits. Store the instruction/configuration revision with each occurrence, but do not automatically make it part of the deduplication key: changing wording should not silently authorize a second delivery for the same period. Explicit reprocessing is a separate operation with a documented effect policy.

## Identify the work before executing it

Persist the intended occurrence, not just the actual start time. A worker starting late should process the correct reporting window. A retry is a new attempt of the same occurrence, not a new business task.

A useful lifecycle is `eligible → claimed → running → result_ready → delivered`, with separate terminal or suspended outcomes such as `no_change`, `expired`, `blocked`, `cancelled`, and `failed`. Result creation and delivery are separate: a successfully generated report with a failed notification is not delivered work.

Keep source cursors, artifact references, effect receipts, and task progress outside the conversation. A previous assistant message is useful context but is not a transactional run ledger.

## Decide what success means

A daily digest succeeds when the agreed source window is accounted for, the artifact passes its evidence/format checks, and delivery or intentional silence is recorded. A development run succeeds when the bounded change meets acceptance checks and produces a reviewable artifact; creating a commit is insufficient evidence.

Measure intended-to-start delay, queue delay, execution duration, source freshness, verified completion, delivery lag, duplicate effects, cost per useful result, and time awaiting intervention. Include an independent check for expected occurrences that never started. Otherwise a stopped scheduler can look quieter rather than broken.

## Keep authority explicit

Recheck current credentials and delegation at execution. Connected tools available during setup may be unavailable or unauthorized later. Inject secrets at runtime; never put access tokens in schedule text, repository files, container build arguments, image layers, or logs. An unattended task should fail with a clear authentication requirement rather than wait indefinitely for browser login.

Default to read-only analysis or reviewable changes. Sending messages, opening pull requests, merging code, deploying, changing permissions, and spending funds are different authorities. A schedule is not blanket approval for all of them. [Scoped credentials](../identity/scoped-credentials.md) and [tool authorization](../../operations/security/tool-authorization.md) remain independent of model instructions.

## Design the failure behavior before enabling recurrence

Select [timing semantics](scheduling/schedule-timing.md), an [execution environment](scheduling/scheduled-execution-environments.md), and [recovery rules](../../operations/reliability/scheduled-run-recovery.md). Rehearse the [failure cases](../../operations/reliability/schedule-testing.md) with harmless fixtures first.

Start with a manually invoked dry run, inspect the resulting artifact, enable a narrow recurrence, and review its early outcomes. Changing the prompt, model, tools, or scheduling policy should trigger regression checks. Pause future starts separately from cancelling active work, and define how already-started external operations are reconciled.
