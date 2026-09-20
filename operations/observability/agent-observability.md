# Agent observability

Observability makes an agent's behavior explainable from recorded execution evidence. It connects user requests, model calls, retrieval, tools, state transitions, and final outcomes. Text transcripts alone omit queueing, failed attempts, permission checks, and actions that committed before a response failed.

Use complementary signals: traces reconstruct a particular execution; metrics show workload distributions; logs record diagnostic events. [OpenTelemetry's signals](https://opentelemetry.io/docs/concepts/signals/) provide a framework-independent foundation. Add application identifiers such as run ID and prompt revision so a failed task can be traced across services.

For example, a support assistant might acknowledge instantly but take twenty seconds to finish. A useful view shows queue delay, two model calls, a slow account lookup, and response delivery. An overall “agent duration” cannot identify which dependency needs attention.

Define the outcomes operators need to distinguish: completed, failed, awaiting input, approval required, cancelled, and budget exhausted. Record both attempted and completed effects; they answer different questions during an incident.

Choose payload capture deliberately. Prompts, retrieved documents, and tool results may contain private content. Redaction, access control, retention, sampling, and exporter capacity are part of the design. Observability can explain recorded operations; it cannot reveal unexposed provider internals or prove semantic correctness without outcome evaluation.
