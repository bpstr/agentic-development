# Testing scheduled work

A manually successful agent run does not verify scheduling. Test the recurrence adapter, dispatch/claim lifecycle, worker logic, external effects and delivery separately. Then test their integration under failures.

Use a fake clock and synthetic sources for most checks. Replace real writes with a test sink that records operation identities and can intentionally lose acknowledgements. Never send real messages, open production pull requests or invoke paid models merely to test a timer.

## Failure matrix

| Scenario | Expected property |
| --- | --- |
| Same occurrence delivered twice | One business run is materialized; attempts remain observable |
| Two workers claim together | One valid owner wins for the protected resource |
| Old worker resumes after lease takeover | Its stale generation cannot update fenced state |
| Crash after result persistence | Recovery reuses the result rather than repeating research |
| Crash after remote success, before receipt | Reconcile by effect identity; do not assume failure |
| Destination lacks deduplication or reliable lookup | Unknown outcomes remain explicit rather than claiming exactly-once |
| Trigger is never emitted | Bounded reconciliation detects the missing eligible occurrence |
| Machine sleeps, restarts or loses network | Configured skip/coalesce/backfill behavior is observed |
| Spring gap or autumn repeated local time | The selected engine's explicit DST policy is preserved |
| Report crosses a clock change | Source window follows calendar boundaries, not an assumed 24 hours |
| One source fails or pagination is interrupted | No false no-change claim and no unjustified cursor advancement |
| Late event arrives after a cutoff | Look-back/cursor policy includes or reports it once |
| Retry occurs after usefulness deadline | It expires rather than delivering stale work |
| Budget or authorization is revoked | New effects stop and progress is preserved |
| Approval arrives after source/base changes | Revalidate before resuming the proposed action |
| Schedule is paused or edited | Pending/active work follows the explicit transition policy |
| Agent-generated activity retriggers development | Bounded feedback rules prevent an infinite edit/review cycle |
| Output is empty, unsupported or fails acceptance | The run is not promoted to successful delivery |

These are proposed acceptance checks, not claims that any platform passes them automatically. Scheduler-specific behavior should be verified against the relevant [environment documentation](../../infrastructure/events/scheduling/scheduled-execution-environments.md).

## A small executable calendar fixture

This Python example tests a narrow application requirement: a local calendar day is converted to UTC using its actual boundaries. It does not simulate a scheduler's gap/fold policy or prove that an external job will fire. It requires Python with `zoneinfo` and the relevant time-zone data installed.

```python
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

ZONE = ZoneInfo("Europe/Budapest")


def utc_day_window(day: date) -> tuple[datetime, datetime]:
    start = datetime.combine(day, time.min, tzinfo=ZONE)
    end = datetime.combine(day + timedelta(days=1), time.min, tzinfo=ZONE)
    return start.astimezone(timezone.utc), end.astimezone(timezone.utc)


for day, expected_hours in (
    (date(2026, 3, 29), 23),
    (date(2026, 9, 24), 24),
    (date(2026, 10, 25), 25),
):
    start, end = utc_day_window(day)
    assert (end - start).total_seconds() == expected_hours * 3600
    next_start, _ = utc_day_window(day + timedelta(days=1))
    assert end == next_start
    assert start <= start < end
    assert not (start <= end < end)
```

The dates are fixtures, not universal rules for every zone or future year. The behavior follows the installed time-zone database. Use the same version as the deployed schedule resolver when exact reproduction matters. [Python zoneinfo documentation](https://docs.python.org/3/library/zoneinfo.html).

## Test native configuration without enabling it

Parse YAML, JSON and service definitions. Validate referenced executable paths, permissions and environment variables. Enumerate the next occurrences with the intended time zone. Verify both sides of DST transitions, month ends, leap days, one-shot expiry and any holiday/business-calendar rules the application implements.

For systemd, `systemd-analyze calendar` previews calendar expressions and `systemd-analyze verify` checks unit files. These are static/local validations, not proof that a machine will be awake, connected or authorized at execution time. [Timer validation guidance](https://documentation.suse.com/smart/systems-management/html/systemd-working-with-timers/index.html).

For a hosted engine, use a staging schedule and a harmless sink only after configuration and policy tests pass. Test the actual adapter's occurrence identity, acknowledgement boundary, retries and misfire behavior. A general-purpose cron parser passing locally does not establish the cloud provider's semantics.

## Keep validation claims narrow

Record the tested code/config revision, runtime version, time-zone data, fixture inputs, asserted outcomes and what was not exercised. Separate syntax checks, deterministic policy tests, simulated crash tests, staging integration and production observations.

Track start delay, recovery time, duplicate effects, missing coverage, repeated model work, verification failures and intervention burden. Include a negative-control implementation when comparing designs: a deliberately naive replay loop should fail the lost-acknowledgement test, otherwise the fixture may not exercise the dangerous boundary.

Only enable a production recurrence after establishing an owner, failure notification, budget, pause control and replay procedure. Review initial runs and rerun the relevant fixtures when the prompt, model, permissions, worker or scheduler adapter changes.
