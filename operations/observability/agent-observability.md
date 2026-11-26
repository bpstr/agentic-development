# Agent observability

Observability makes an agent's behavior explainable from recorded execution evidence. It connects user requests, model calls, retrieval, tools, state transitions, and final outcomes. Text transcripts alone omit queueing, failed attempts, permission checks, and actions that committed before a response failed.

Use complementary signals: traces reconstruct a particular execution; metrics show workload distributions; logs record diagnostic events. [OpenTelemetry's signals](https://opentelemetry.io/docs/concepts/signals/) provide a framework-independent foundation. Add application identifiers such as run ID and prompt revision so a failed task can be traced across services.

For example, a support assistant might acknowledge instantly but take twenty seconds to finish. A useful view shows queue delay, two model calls, a slow account lookup, and response delivery. An overall “agent duration” cannot identify which dependency needs attention.

Define the outcomes operators need to distinguish: completed, failed, awaiting input, approval required, cancelled, and budget exhausted. Record both attempted and completed effects; they answer different questions during an incident.

Choose payload capture deliberately. Prompts, retrieved documents, and tool results may contain private content. Redaction, access control, retention, sampling, and exporter capacity are part of the design. Observability can explain recorded operations; it cannot reveal unexposed provider internals or prove semantic correctness without outcome evaluation.

## Provider-side OpenTelemetry export

Anthropic's [OpenTelemetry export](https://platform.claude.com/docs/en/manage-claude/opentelemetry) is in beta for the Messages API and Claude Managed Agents. SDK tracing captures client requests and client-run tools; API-side tracing can add internal model requests, server tools, and Managed Agents turns. Combining them produces a more complete trace, but **request, model, and server spans may report the same token usage**, so aggregating every span's usage double-counts spend. Follow the provider's documented counting rules and reconcile to authoritative billing records.

API traces require a configured destination and appropriate console permissions; SDK traces require tracer setup in the client. Link request traces through W3C `traceparent` where supported, noting Claude Platform on AWS may emit separate API traces. The default `metadata_only` export excludes prompt/response bodies, while full-content capture expands sensitive-data exposure and can be truncated by size limits. Sampling, provider delivery failures, privacy, and retention remain application responsibilities. Provider telemetry is diagnostic evidence, not a guarantee that a business operation committed.

## Historical usage and cost reconciliation

Anthropic's [Usage and Cost Analytics API](https://platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api) is a beta for organization-level historical billing analysis. It provides `GET /v1/organizations/analytics/usage` and `/cost`, using `anthropic-beta: analytics-usage-cost-2026-08-24` plus `anthropic-version`. Query usage or USD costs by model, workspace, API key, or actor using an authorized organization-level credential. The old [Usage and Cost API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api) still exists but is not the recommended starting point for new integrations.

Do not adapt legacy reporting code by changing only the endpoint: results use rows grouped by dimensions, optional `time_bucket_width` rather than legacy `bucket_width`, and pagination counts rows rather than time buckets. Analytics data usually refreshes within four hours and can take up to 24 hours; it **cannot** replace per-run latency, tool traces, or near-real-time spend controls. Reconcile historical reports against authoritative billing with clear time windows and avoid summing overlapping request/model/server span usage as independent charges.
