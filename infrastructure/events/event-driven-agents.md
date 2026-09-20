# Event-driven agents

Event-driven agents begin or resume work in response to external events rather than an interactive user message. Sources include webhooks, queues, repository events, monitoring alerts, schedules, email, and application-domain events.

Events should be durable, identifiable, deduplicated, and safe to retry. An event starts work; it does not remove the need for authorization and idempotency.
