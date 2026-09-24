# Scheduled summaries

A scheduled summary turns a defined source window into a concise, attributable artifact and delivers it through an approved destination. The model should synthesize verified input; it should not decide which days have already been covered or whether a notification was actually sent.

This pattern fits daily project digests, morning inbox summaries, learning updates, weekly status reports and periodic research scans. A condition monitor adds a decision about whether a meaningful change warrants notification.

## Define coverage before prose

Specify the recipient and audience, source scope, time zone, intended reporting window, freshness requirement, maximum length, required sections, destination and no-change policy. Distinguish a previous local calendar day from the period since the last successful materialization.

For a weekday digest, querying only the previous 24 hours on Monday can omit the weekend. Either request the full period since the previous cutoff or deliberately report a named calendar window and account for excluded periods. Late execution must not silently change what the report covers.

Use half-open windows such as `[previous_cutoff, current_cutoff)` so adjacent windows do not overlap at the boundary. Construct calendar boundaries in the relevant time zone before converting to UTC. When source APIs paginate or offer cursors, finish the required pages and preserve the cursor with the materialized result.

Distinguish event time from discovery time. A document published yesterday but discovered today may still need inclusion. Use an overlap/look-back policy plus stable source IDs and revisions, or source-native change cursors. Record corrections and late arrivals explicitly rather than pretending the original report was complete.

## Keep collection deterministic where possible

Use APIs and connectors to retrieve known records, versions and changes. Filter duplicates, calculate counts, identify changed items and enforce source access before asking a model to write. A model is useful for prioritization and explanation; it is unnecessary for checking whether a source revision changed.

Keep source references with every material claim. Preserve publication/event dates separately from retrieval dates. For web research, follow [source selection](../infrastructure/knowledge/web-research/source-selection.md) and [citations and provenance](../infrastructure/knowledge/rag/citations-and-provenance.md).

Set a maximum amount of source material and an explicit overflow policy. A large input should produce a scoped summary, batching or an overflow notice, not silent truncation of whatever happened to appear last.

## Separate materialization from delivery

A practical lifecycle is:

```text
resolve reporting window
  -> verify source access and collect changes
  -> deduplicate and calculate deterministic facts
  -> synthesize with evidence
  -> validate claims, scope and output format
  -> persist artifact, source checkpoints and delivery intent
  -> deliver through a controlled dispatcher
  -> record destination receipt
```

A source checkpoint can advance once its input coverage and resulting artifact or intentional no-op are durably recorded. It need not wait for a temporarily unavailable notification service when a durable outbox retains delivery intent. Delivery has its own status and receipt. Do not rerun expensive research solely because notification failed. [Scheduled-run recovery](../operations/reliability/scheduled-run-recovery.md).

Use a stable delivery identity such as recipient, report type and reporting period. A retry should reuse the saved artifact and existing operation identity. Regenerating slightly different prose does not make a second delivery a new authorized report.

When required source access fails, do not report “nothing changed.” Mark the result as degraded or blocked, identify the unavailable source, and retain its checkpoint. If partial delivery is allowed, make missing coverage visible to the recipient.

## Write a task instruction that survives a fresh session

The following is a reusable instruction pattern. The scheduler and application supply the bracketed values; it is not an instruction to create a live automation.

```text
Create the [report type] for [audience], covering [window] in [timezone].
Read [authoritative sources] using the currently authorized connections.
Use saved source cursors and deduplicate previously covered records.

Explain the important changes, their implications, blockers, and the next
useful action. Limit the report to [length]. Link each material factual
claim to its source. Separate documented changes from your interpretation.

Do not infer that no change occurred when a source is unavailable. Follow
[partial-source policy] and record what could not be checked.

Persist the report and coverage checkpoint. Deliver only to [destination]
through the application's duplicate-safe delivery path. Do not modify the
source records, contact other recipients, or expand the research scope.

When no meaningful change is found, follow [no-change policy]. Record the
successful check even when no user notification is sent.
```

A learning summary needs an additional curriculum/progress state: what was taught, what was reviewed, and what should come next. A freshness scan needs a source/revision checkpoint. Neither should reconstruct its entire history from a growing prompt every morning.

## Condition monitoring is not a stream of repeated digests

Prefer an authorized event trigger when an appropriate source event exists. Otherwise use a cheap periodic check and invoke deeper analysis only on a relevant delta. Match the cadence to the value and volatility of the signal, not the maximum frequency a platform allows.

Track the previous condition state and last notification. Notify on meaningful transitions or materially new evidence, not every time the same condition remains true. Add a cooldown, aggregation window or hysteresis when a fluctuating signal would otherwise produce noise. Escalation policies should distinguish source failure from an unchanged condition.

## Measure usefulness and reliability

Track source coverage, late-arriving items, unsupported claims, duplicate notifications, stale reports, delivery lag, no-op rate, user corrections and cost per useful digest. A high successful-run count does not establish accurate summaries.

Begin with a manual source fixture and a dry-run destination. Inspect several outputs before enabling delivery. Re-test when tools, prompts, source schemas, time-zone policy or recipients change. Keep a visible owner and a way to pause the schedule without losing its checkpoint.
