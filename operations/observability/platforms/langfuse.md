# Langfuse

[Official observability documentation](https://langfuse.com/docs/observability/overview) · [Canonical repository](https://github.com/langfuse/langfuse) · [Self-hosting](https://langfuse.com/self-hosting)

Langfuse is an LLM engineering platform with tracing, usage analysis, prompt management, and evaluation features. It can expose model and tool activity across a conversational execution and offers hosted and self-hosted deployment options.

Set up a project, configure the matching SDK or integration with that deployment's endpoint and credentials, then instrument a single representative request. Verify trace nesting, conversation correlation, usage fields, and export completion before enabling broad capture. Integration details vary by SDK generation, so follow the current guide for the installed version.

For a retrieval assistant, record retrieval and generation as distinct observations. This lets an operator distinguish an irrelevant document search from an answer that ignored relevant evidence. Keep application run IDs stable across telemetry and the actual work record.

Self-hosting adds responsibility for databases, storage, upgrades, backups, access control, and retention. It does not automatically make captured prompts anonymous. Choose redaction and capture rules before forwarding private tool results.

Evaluate cost and performance with realistic trace volume. Duplicate integrations can inflate observation counts, while insufficient flushing can make short-lived jobs appear absent. Trace completeness should be checked against known application runs rather than assumed from an attractive dashboard.
