# Agent-facing APIs

Agent-facing APIs expose operations with names, schemas, and semantics that models and runtimes can use reliably. Good operations express domain intent, bound their inputs and outputs, return stable identifiers, and provide errors that support an appropriate next action.

For example, `assign_task(task_id, assignee_id, expected_revision)` expresses a specific mutation. Its implementation can validate identity, authorization, allowed transitions, and concurrent edits. A generic “execute this database command” interface shifts those responsibilities into generated instructions.

Separate discovery from mutation. Search can return candidate IDs and concise descriptions; a read operation supplies current details; a mutation commits an authorized change. Include pagination and result limits so a broad search cannot accidentally fill the entire context window.

[OpenAPI](https://spec.openapis.org/oas/latest.html) describes HTTP operations, parameters, request bodies, responses, and security requirements. A machine-readable schema clarifies the contract but does not enforce every business invariant.

Return a durable receipt for committed changes and distinguish invalid input, denied access, conflicts, temporary failure, and unknown outcome. Support idempotency where repeated requests could duplicate effects, and preserve operation identity across retries.

Evaluate complete interactions, including ambiguous names and stale revisions. Syntactically valid arguments can still target the wrong object; server-side checks must remain authoritative regardless of how confidently the model selected them.
