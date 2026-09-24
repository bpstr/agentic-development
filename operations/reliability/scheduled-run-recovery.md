# Scheduled-run recovery

Recovery should resume a known unit of work, not blindly repeat the last prompt. A scheduler, queue, model request, tool call and notification each have independent failure boundaries. Recording one as successful does not prove the others succeeded.

## Separate occurrence, attempt and effect identity

An **occurrence** is the intended business execution, such as a workspace's weekday digest at a particular instant. An **attempt** is one execution effort. An **effect** is an externally visible action, such as delivering that digest to a recipient.

Use stable identities with distinct scopes:

```text
occurrence = tenant + schedule_id + intended_time_utc
attempt = occurrence + attempt_number
effect = tenant + report_type + reporting_period + recipient
```

These are illustrative key components, not a recommended delimiter encoding. Serialize unambiguously or use structured database columns. Validate identifiers and isolate tenants. A retry must reuse the occurrence and effect identities. Instruction revisions and actual start times belong in metadata, not automatically in the business deduplication key.

Persist the original inputs or their immutable references, configuration/model revision, source window, state, attempt count, lease generation, budget usage, artifact references, effect status and receipt. Keep sensitive source material under appropriate retention and access policies.

A unique constraint on occurrence identity prevents duplicate creation. A transaction that claims an eligible record prevents two healthy workers from both winning the initial claim. Neither alone prevents every duplicate external action. [AWS's idempotent API guidance](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) explains why explicit request identity matters when a response is lost.

## Recover ownership safely

Use a lease with heartbeat when workers can disappear. A new claimant receives a monotonically increasing generation, sometimes called a fencing token. Updates to protected state must require the currently valid generation. Otherwise a paused worker can wake after its lease expired and overwrite the replacement worker's progress.

Fencing only protects destinations that enforce it. A remote email API does not become fenced because a database lock exists. Protect external effects with the destination's idempotency contract, an operation identity that can be queried, or a controlled effect dispatcher. Where these are unavailable, explicitly preserve an uncertain outcome instead of claiming exact-once execution.

Do not hold a database transaction open throughout model inference. Claim briefly, do bounded work, heartbeat when appropriate, and commit checkpoints with ownership checks. Observe cancellation and ownership loss before starting another effect. Already-started remote work may still need reconciliation.

## Treat an uncertain effect differently from a failed effect

Suppose a notification is accepted remotely, but the worker crashes before saving the receipt. On restart, “no receipt in our database” does not mean “nothing was sent.”

| Failure boundary | Recovery action |
| --- | --- |
| Before durable job acceptance | The trigger may retry using the same occurrence identity |
| After job acceptance, before worker start | A queue/ledger reconciliation resumes the accepted work |
| After model result is saved | Reuse the saved result rather than regenerating it unnecessarily |
| Before the external action starts | Dispatch the prepared effect |
| External outcome is unknown | Query by operation identity or retry under the provider's idempotency contract |
| Effect confirmed, receipt saved | Return the recorded outcome without repeating the action |
| Outcome cannot be established safely | Mark uncertain and escalate or apply an explicitly approved duplicate-risk policy |

Persist a validated result and an outbox entry in the same database transaction. This prevents losing the intention to deliver after saving the artifact. It does **not** make the subsequent remote send atomic with that transaction: the dispatcher still needs deduplication and reconciliation. [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html).

Keep idempotency records long enough to cover retries, late arrivals and authorized replay. A provider may retain its keys for less time than the application's replay window. Reusing an expired key is not a reliable deduplication strategy.

## Bound recovery rather than amplifying an outage

Classify failures before retrying. Transient network errors and rate limits may warrant retry; invalid permissions, revoked authorization, incompatible input, or an exhausted budget usually require intervention or a policy change.

Use capped exponential backoff with jitter, honor supported server retry hints, and stop at both an attempt limit and the occurrence's usefulness deadline. Count retries already performed by SDKs, queues and workflow engines. Multiple independent retry layers can multiply requests and cost.

Persist retry eligibility rather than sleeping inside an expensive worker for a long delay. Exhausted work goes to a failed-work queue or explicit blocked state with enough context to inspect and safely replay. A dead-letter queue without an owner, alert and replay procedure is storage, not recovery.

Apply admission control per tenant, repository, destination and model budget. Backfill should not starve current user-facing work. Coalesce redundant reconciliation triggers while retaining actual unprocessed tasks in the durable backlog.

## Recover missing triggers and partial data

A scheduler can fail before producing a job. Reconcile expected eligible occurrences against the run ledger within a bounded look-back window. Apply the configured skip, coalesce or backfill policy rather than materializing every possible old occurrence.

Source progress is distinct from delivery progress. Advance a source/materialization checkpoint only when the covered input and resulting artifact or intentional no-op are durably recorded. Advance delivery state only after confirmed delivery. When one source is unavailable, preserve its own cursor and report degraded coverage; do not move it forward based on another source's success.

Pausing a schedule should block future admissions. Cancelling active work, revoking effect authority, and compensating completed operations are separate controls. Recheck authorization after a long wait or approval before resuming a write.

These rules complement [idempotency](idempotency.md), [cancellation](cancellation.md), and [durable execution](../../infrastructure/orchestration/durable-execution.md); they do not replace the destination-specific contract.
