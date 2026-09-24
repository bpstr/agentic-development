# Scheduled execution environments

An execution environment determines what a scheduled worker can access, how long it can run, what survives a restart, and who operates it. The location of the model is a separate question: a local CLI can call cloud inference, and a hosted scheduler can dispatch work to a private worker.

Choose the least complex environment that satisfies the task's availability, authority, persistence, and timing requirements. Move the trigger without rewriting the task by giving every adapter the same occurrence identity and worker contract.

## Match the environment to the workload

| Environment | Good fit | Boundary to design around |
| --- | --- | --- |
| Open terminal or agent session | Temporary polling while working | Session lifetime, idle-time execution, laptop sleep |
| Desktop application or OS scheduler | Local files, personal workflows, development experiments | Power, login context, local permissions, unattended authentication |
| Always-on machine or VM | Repeated CLI work with stable tools and private network access | You own patching, restart recovery, storage and monitoring |
| Application scheduler plus queue | Existing product jobs and tenant-scoped workflows | Multiple app replicas, durable enqueue, shared locks and fairness |
| CI runner | Repository checks, bounded maintenance and review artifacts | Ephemeral execution, checkout/bootstrap cost and trigger reliability |
| Scheduled container job | Reproducible dependencies, browsers, compilers and batch work | Durable data must outlive the container; duplicate jobs remain possible |
| Managed scheduler plus short function | Lightweight reads, dispatch and summaries | Invocation limits are not a durable long-running workflow |
| Managed scheduler plus queue/worker | Variable workloads and continuous backlog processing | Queue visibility, leases, backpressure and independently tracked completion |
| Durable workflow engine | Multi-step work, approvals, timers and recovery across days | Workflow history, effect boundaries and operational complexity |
| Hosted assistant or low-code automation | Personal digests and connector-centric workflows | Plan/tool availability, delegated permissions and runtime-specific persistence |

The table is a design guide, not a performance ranking. The runtime must be tested with the actual source connections and destination permissions.

## Local OS scheduling

On Linux, a timer/service pair keeps recurrence separate from process execution. [systemd timer guidance](https://documentation.suse.com/smart/systems-management/html/systemd-working-with-timers/index.html) covers calendar and monotonic timers, inspection, and user-session behavior. User units may need lingering to operate after logout; their environment does not automatically match an interactive shell.

This example is a **deployment template**, not a supplied agent implementation. Provision the `agent-jobs` account, working directory and executable first. The worker must resolve eligible occurrences from its durable ledger rather than treating every invocation as new work.

```ini
# agent-digest.service
[Unit]
Description=Materialize eligible digest work

[Service]
Type=oneshot
User=agent-jobs
WorkingDirectory=/opt/agent-jobs
ExecStart=/opt/agent-jobs/bin/digest-worker
TimeoutStartSec=600
TimeoutStopSec=30
StateDirectory=agent-jobs
NoNewPrivileges=true
```

```ini
# agent-digest.timer
[Unit]
Description=Weekday digest eligibility check

[Timer]
OnCalendar=Mon..Fri *-*-* 08:07:00 Europe/Budapest
Persistent=true
RandomizedDelaySec=30
Unit=agent-digest.service

[Install]
WantedBy=timers.target
```

`Persistent=true` permits a missed calendar activation to be handled when the timer becomes active again; it is not an instruction to replay every historical reporting period. [SUSE persistence example](https://documentation.suse.com/sles/15-SP4/html/SLES-all/cha-systemd.html). For a oneshot service, use `TimeoutStartSec` to bound its activating execution; `RuntimeMaxSec` is not the equivalent limit. [systemd service manual distributed by Debian](https://manpages.debian.org/bookworm-backports/systemd/systemd.service.5.en.html).

Validate without enabling recurrence:

```sh
systemd-analyze calendar --iterations=5 \
  'Mon..Fri *-*-* 08:07:00 Europe/Budapest'
systemd-analyze verify ./agent-digest.service ./agent-digest.timer
```

On macOS, `launchd` provides calendar scheduling. Apple's archived guide distinguishes waking from sleep from being powered off: `StartCalendarInterval` can run missed work on wake, but does not imply powered-off execution. Verify the installed macOS behavior and privacy permissions. [Apple scheduling guide](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/ScheduledJobs.html).

On Windows, explicitly review `StartWhenAvailable`, `MultipleInstances`, `ExecutionTimeLimit`, `WakeToRun`, battery and network conditions, and the execution account. A task that works in an interactive session can fail under a service identity. [Task Scheduler settings](https://learn.microsoft.com/en-us/windows/win32/taskschd/tasksettings).

Plain cron is reasonable for a small always-on host when an external wrapper supplies locking, timeout, logs and state. Do not assume cron itself provides missed-run recovery. A container restart policy restarts a process; it does not create calendar scheduling or a durable job ledger.

## CI scheduling

[GitHub Actions schedules](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) run from the default branch and can be delayed or dropped under load. Current documentation supports an IANA `timezone`; older UTC-only advice is incomplete. Treat Actions as a useful trigger and bounded executor, not a precise delivery clock.

This is an illustrative workflow template. `scripts/reconcile-approved-work` is an application-owned executable that must exist, bootstrap its dependencies, claim approved tasks, and implement recovery. The schedule does not authorize arbitrary changes.

```yaml
name: Reconcile approved work
"on":
  workflow_dispatch:
  schedule:
    - cron: '17 * * * *'
      timezone: Europe/Budapest
permissions:
  contents: read
concurrency:
  group: approved-work-reconciler
  queue: single
  cancel-in-progress: false
jobs:
  reconcile:
    runs-on: ubuntu-latest
    timeout-minutes: 25
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      - run: ./scripts/reconcile-approved-work
```

The action tag illustrates syntax, not a claim about the latest release; pin an approved immutable commit in a production workflow. Configure scoped credentials separately only for intended effects. The example's `contents: read` does not allow pushing code.

Here, `queue: single` intentionally retains only the newest pending reconciliation trigger because the durable task queue retains the actual work. Current Actions also supports `queue: max`, allowing up to 100 pending runs, but that bounded execution queue is not a substitute for an application backlog. `cancel-in-progress: false` alone does not preserve all pending runs. [Concurrency documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).

Persist task records and artifacts outside runner-local disk. Do not use a cache as the sole correctness-critical ledger. Supply the business occurrence/window explicitly or compute it from persisted eligibility; a CI run ID is not the identity of a missed morning report.

## Containers and managed cloud triggers

[Kubernetes CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) expose `.spec.timeZone`, `concurrencyPolicy`, and `startingDeadlineSeconds`. `Forbid` applies to jobs from the same CronJob, not every writer in the cluster. A start deadline is not an execution timeout. Job creation can repeat or be missed, so the worker still needs deduplication. Choose a cluster only when its operational model already fits the workload.

A managed scheduler can publish an occurrence to a queue or call an authenticated dispatch endpoint. Acknowledge dispatch only after the work is durably accepted, then track the worker's outcome separately. [Google Cloud Scheduler](https://docs.cloud.google.com/scheduler/docs/overview) documents at-least-once delivery and exposes the original scheduled time in `X-CloudScheduler-ScheduleTime`; combine it with the job identity after authenticating the request.

[EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html) provides rate, cron and one-shot schedules. Even with a flexible window disabled, its documented target-invocation precision is 60 seconds. A successful target API call is not proof that a downstream container or agent finished successfully.

[Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) use UTC. Use a durable application-level calendar resolver for recipient-local requirements that cannot be expressed by a fixed UTC schedule. Keep work within the selected runtime's current limits or dispatch to an appropriate longer-running executor.

## Durable workflows and product-native automation

A durable workflow is useful when the job must wait for approvals, resume multi-stage progress, or coordinate timers with external events. [Temporal Schedules](https://docs.temporal.io/schedule) make overlap, catch-up, backfill and pause policies explicit. Pausing future scheduled starts does not cancel an already-running workflow. Persist nondeterministic model/tool outcomes at the workflow's supported effect boundaries; durable control flow does not eliminate external-effect reconciliation.

[ChatGPT scheduled-task documentation](https://learn.chatgpt.com/docs/automations?surface=app) distinguishes web tasks using connected context from desktop project tasks requiring the machine and application to remain running. A folder on the user's computer is not automatically available to a hosted task. [Claude Code's scheduling comparison](https://code.claude.com/docs/en/scheduled-tasks) similarly separates session loops, desktop schedules, and cloud routines. Verify the selected mode, not just the product name.

[The n8n Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger) uses workflow/instance timezone settings and requires a published workflow. Its documented missed-execution options depend on version and use of the durable scheduler; an in-memory instance is not equivalent. Low-code configuration does not remove the need for a source checkpoint and a delivery receipt.

## Preflight every unattended environment

Run the exact worker command under the intended identity with a clean environment. Check executable paths, working directory, dependency versions, network access, repository access, source scopes, destination permissions, writable state storage, secret refresh, exit codes and artifact collection. Test expired credentials as well as valid credentials.

Use runtime secret injection rather than baking credentials into images. Do not silently switch a subscription-authenticated CLI to paid API execution when authentication or quota fails. Such a fallback changes billing and possibly data handling; it needs an explicit policy. Pause on unavailable credentials or exhausted budget, preserve progress, and report the reason without opening an interactive login prompt.
