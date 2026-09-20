# Deterministic boundaries

A deterministic boundary places critical behavior in ordinary software with explicit rules instead of relying on probabilistic model output. Identity resolution, authorization, accounting, schema validation, transactions, and idempotency are common examples.

The model may propose an operation and its arguments. Application code decides whether those arguments identify valid resources, whether the caller has authority, and whether the current state permits the change. Only that code commits the effect and returns its receipt.

For example, a model can suggest assigning `APP-42` to a teammate. The server resolves the teammate's ID within the workspace, checks task access, compares the expected revision, performs the update, and records the actor. A fluent explanation cannot substitute for any of those checks.

[PostgreSQL's transaction documentation](https://www.postgresql.org/docs/current/tutorial-transactions.html) illustrates grouping related database changes into one committed unit. A transaction alone does not coordinate arbitrary external services; those need explicit reconciliation or compensation behavior.

Deterministic does not mean infallible. Validation rules can be wrong, permissions can be misconfigured, and concurrent operations can expose races. Make the boundary small enough to inspect and verify with representative cases.

Keep failures machine-readable. The agent can then ask for missing information, refresh stale state, or stop after denied access instead of improvising a workaround that bypasses the application's rules.
