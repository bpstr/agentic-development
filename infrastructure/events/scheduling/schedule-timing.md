# Schedule timing semantics

A recurrence is a rule for producing intended execution times. It is not a promise about when a worker will start or finish. Correct scheduling requires a clock model, a recurrence dialect, and policies for ambiguous, missed, and overlapping occurrences.

## Calendar time versus elapsed time

Use a named IANA time zone for a human requirement such as 08:00 in Europe/Budapest. Store resolved occurrence instants in UTC, alongside the original zone and rule. A fixed UTC offset cannot represent seasonal changes. UTC is appropriate when the requirement is explicitly global time, not a shortcut for a recipient's local morning.

Distinguish calendar recurrence, fixed-rate intervals measured from an anchor, and completion-relative delays. A job that starts every ten minutes can overlap a fifteen-minute execution. A job that waits ten minutes after completion cannot maintain the same fixed start cadence. Use a monotonic clock for elapsed process timeouts where available, and persisted timestamps for recovery across processes. [SUSE's timer documentation](https://documentation.suse.com/smart/systems-management/html/systemd-working-with-timers/index.html) illustrates calendar timers and activation/deactivation-relative timers.

Do not copy expressions between engines without checking the dialect. POSIX-style cron commonly has five fields; EventBridge Scheduler uses six including the year. RFC 5545 recurrence rules have their own semantics, including recurrence termination through COUNT or UNTIL. A scheduler's subset may be narrower than the full specification. [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545.html).

## Daylight saving time is a policy decision

A clock change can create a nonexistent local time in spring or two instances of the same local time in autumn. Specify whether to skip, advance, or otherwise resolve a gap, and whether a repeated local time should produce one or two occurrences.

Provider policies are not interchangeable. [EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html) skips a nonexistent cron time and invokes once during a repeated time. Its rate-based day remains a 24-hour duration. [GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) advances a spring-gap scheduled time to the next valid time when a timezone is configured. Verify the relevant engine's full behavior rather than extrapolating its spring rule to autumn.

For a local-day digest, construct the next local calendar boundary and convert both endpoints to UTC. Do not create every window by adding 86,400 seconds. Record the time-zone database version in reproducibility-sensitive tests, and preview occurrences across both transitions before deployment.

## Missed runs are not automatically a backlog

| Policy | Meaning | Suitable example |
| --- | --- | --- |
| Skip | Expire stale occurrences | A notification that is no longer actionable |
| Run late | Execute the original occurrence within a lateness limit | A delayed but still useful morning digest |
| Coalesce | Produce one current job covering outstanding useful work | Catching up a repository freshness scan |
| Backfill | Materialize separate historical windows | Rebuilding auditable daily aggregates |

Coalescing notifications must not discard source data. A digest can combine outstanding coverage into one artifact while explicitly accounting for all included windows. Backfill should have its own rate limit and usually suppress historical notifications unless authorized.

Treat a schedule edit as an effective-dated change. Decide what happens to already-created occurrences and pending work. Pausing, resuming, changing zones, or changing a task's start date must not accidentally replay months of old work.

## Separate four time limits

An intended start, maximum start lateness, execution timeout, and delivery deadline answer different questions. A report started at 08:00 can still miss an 08:05 delivery deadline. Include queue delay, setup, retries, verification, and delivery in the budget.

Spread flexible work across minutes rather than making every job compete at the top of the hour. Apply bounded jitter to reduce synchronized demand, but never let jitter consume an explicit deadline. Randomization is a load-management policy, not a way to hide scheduler lateness.

For dependent work, wait for a verified upstream result or event rather than scheduling the downstream job five minutes later and hoping the first one finishes. When no relevant input changed, the trigger can record a cheap no-op instead of invoking a model.

Persist the intended time even when execution is delayed. Use it for occurrence identity and data-window selection; use actual start and completion times for latency measurements. These are complementary timestamps, not substitutes.
