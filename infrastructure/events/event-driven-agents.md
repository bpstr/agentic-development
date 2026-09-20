# Event-driven agents

Event-driven agents begin or resume work when another system reports a change. Sources include repository updates, monitoring alerts, application events, and inbound messages. The event selects a workflow; it does not itself supply unrestricted instructions or authority.

This illustrative CloudEvents object identifies a changed task:

```json
{
  "specversion": "1.0",
  "id": "event-42",
  "source": "https://tasks.example.com",
  "type": "com.example.task.updated",
  "subject": "tasks/TASK-42",
  "data": {"version": 7}
}
```

[CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) standardizes event context; the combination of source and ID identifies an event. It does not guarantee delivery, ordering, or exactly-once execution.

## Convert delivery into durable work

Validate the source, persist the event, and enqueue work with a deduplication key. A worker loads the authorized current resource, decides whether the event still requires action, and records the outcome.

Use the supplied version to detect stale work. If task version 9 already supersedes version 7, generating a report from the old payload may be misleading.

Prevent feedback loops when an agent's own update triggers the same workflow again. Record causation and apply a bounded triggering policy.

Duplicate delivery and worker retries must not repeat business effects. Event acknowledgement means receipt; a separate run outcome establishes whether the requested work succeeded.
