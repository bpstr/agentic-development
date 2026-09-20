# Agent audit logs

Agent audit logs record events needed to reconstruct accountable system behavior: identity, configuration changes, tool invocations, policy decisions, approvals, credential use, and consequential outcomes. They explain who or what acted, on which resource, under which authority, and with what result.

Use structured records with stable event identifiers, timestamps, initiating and executing principals, operation identifiers, and relevant resource references. Connect an authorization decision to the resulting execution receipt. For example, a published document should be traceable to the approved revision, destination, acting identity, and provider acknowledgment.

Protect audit records from ordinary application edits and define retention and access controls separately from the operational tables they describe. Preserve failed and denied attempts when relevant, while excluding unnecessary secrets or complete sensitive payloads. A resource identifier and payload digest may be more appropriate than copying an entire document.

The [OpenTelemetry logs data model](https://opentelemetry.io/docs/specs/otel/logs/data-model/) supplies useful fields for timestamps, attributes, and trace correlation. It does not itself provide immutable storage or an audit policy; those are application and storage responsibilities.

Model narration can supplement an event but cannot replace it. “I updated the account” is weaker evidence than an attributable operation record linked to the actual outcome and affected resource.
