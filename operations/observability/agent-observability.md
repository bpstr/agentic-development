# Agent observability

Observability makes an agent's behavior explainable from recorded execution evidence. It connects user requests, model calls, retrieval, tools, state transitions, and final outcomes. Text transcripts alone omit queueing, failed attempts, permission checks, and actions that committed before a response failed.

Use complementary signals: traces reconstruct a particular execution; metrics show workload distributions; logs record diagnostic events. [OpenTelemetry's signals](https://opentelemetry.io/docs/concepts/signals/) provide a framework-independent foundation. Add application identifiers such as run ID and prompt revision so a failed task can be traced across services.

For example, a support assistant might acknowledge instantly but take twenty seconds to finish. A useful view shows queue delay, two model calls, a slow account lookup, and response delivery. An overall “agent duration” cannot identify which dependency needs attention.

Define the outcomes operators need to distinguish: completed, failed, awaiting input, approval required, cancelled, and budget exhausted. Record both attempted and completed effects; they answer different questions during an incident.

Choose payload capture deliberately. Prompts, retrieved documents, and tool results may contain private content. Redaction, access control, retention, sampling, and exporter capacity are part of the design. Observability can explain recorded operations; it cannot reveal unexposed provider internals or prove semantic correctness without outcome evaluation.

## Provider-side OpenTelemetry export

Anthropic's [OpenTelemetry export](https://platform.claude.com/docs/en/manage-claude/opentelemetry) is in beta for the Messages API and Claude Managed Agents. SDK tracing captures client requests and client-run tools; API-side tracing can add internal model requests, server tools, and Managed Agents turns. Combining them produces a more complete trace, but **request, model, and server spans may report the same token usage**, so aggregating every span's usage double-counts spend. Follow the provider's documented counting rules and reconcile to authoritative billing records.

API traces require a configured destination and appropriate console permissions; SDK traces require tracer setup in the client. Link request traces through W3C `traceparent` where supported, noting Claude Platform on AWS may emit separate API traces. The default `metadata_only` export excludes prompt/response bodies, while full-content capture expands sensitive-data exposure and can be truncated by size limits. Sampling, provider delivery failures, privacy, and retention remain application responsibilities. Provider telemetry is diagnostic evidence, not a guarantee that a business operation committed.
