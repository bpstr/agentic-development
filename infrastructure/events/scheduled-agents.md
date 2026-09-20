# Scheduled agents

Scheduled agents perform work at defined times or intervals. They support recurring reports, synchronization, maintenance, and monitoring without requiring an open conversation or browser.

Separate the schedule from the work definition. A scheduler creates a durable run containing the job identity, intended execution time, and relevant parameters; a worker performs the actual agent loop.

For example, a weekday report can use the cron expression `0 9 * * 1-5` with an explicit `Europe/Budapest` time zone. That represents local 09:00, whose UTC offset changes seasonally. A fixed UTC schedule expresses a different requirement.

## Define missed and overlapping runs

Decide whether a missed run should be skipped, executed late, or combined with later work. Specify whether an unfinished run permits another instance to start.

Use the job identity and scheduled occurrence as a deduplication key. Scheduler retries should refer to the same occurrence instead of creating indistinguishable copies.

[Kubernetes CronJob documentation](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) illustrates time-zone and concurrency configuration, and explicitly warns that scheduling does not guarantee exactly one job creation. The same design question applies to other schedulers.

Recheck credentials, delegation, and current source data when the run executes. A schedule defines when to attempt work; it does not preserve permissions forever or guarantee delivery by a deadline.
