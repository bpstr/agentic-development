# Agent state management

Agentic applications maintain several kinds of state with different purposes and lifetimes:

- **Conversation state:** messages, tool observations, and summaries used as model context.
- **Execution state:** current step, checkpoints, pending calls, budgets, leases, and cancellation.
- **Domain state:** authoritative tasks, documents, orders, and permissions.
- **Artifacts:** files or structured outputs that users need after execution ends.

A conversation summary helps the next inference call. It is not an authoritative record of an approval or completed payment. Store business outcomes in application records and associate them with tool receipts.

Use separate identifiers for the application conversation, provider session, run, tool call, and business operation. A provider session can expire without changing the identity of the user's document. Scope all retrieval by the authorized user or tenant; possession of a session ID is insufficient authorization.

## Private and shared state in a multi-agent system

A [multi-agent system](multi-agent-systems.md) needs a more precise sharing contract than a common chat transcript. Preserve the original request and constraints as immutable revisions. Give each inquiry a private local goal, selected context, dependency set, and checkpoint. Store reservations and lifecycle transitions in an authoritative coordination ledger. Publish findings into a separate claim/evidence ledger with immutable artifact references.

Private state is an access policy, not merely a field name. Framework-local channels or a separate prompt do not automatically prevent other agents, streaming clients, logs, or administrators from reading a value. Enforce scope at storage, retrieval, tool, and delivery boundaries.

Sharing should normally mean access to selected versioned facts or candidates, not permission for every worker to overwrite the same answer. A finding can be proposed, challenged, checked, superseded, or retracted. Record who performed a check, against which candidate and source revisions, and what the check establishes. A model's self-reported confidence is not a verification receipt.

For an explanatory task, the sunlight inquiry and scattering inquiry can share accepted source passages without sharing every intermediate message. A perception-related objection remains visible until checked; a renderer must not erase it simply to produce a smooth narrative.

## Consistency, ownership, and leases

Use a coherent evidence snapshot for an inquiry, then track the dependencies actually used. Conditional writes compare the expected task or record version atomically. A stale result should not silently replace a newer one. Distinguish an obsolete user request from an unrelated new finding: changing one source may invalidate only its dependent claims, not the entire run.

A lease identifies the current worker attempt. Add a monotonic lease epoch or fencing token and require the mutation boundary to reject older attempts. Lease expiry alone cannot stop a delayed process from writing; fencing must be enforced where consequential writes occur. External operations that cannot enforce such fencing need their own idempotency and reconciliation strategy.

Budget reservation, task admission, and permission changes require appropriate transactional invariants. Two children must not each reserve the same remaining budget. [PostgreSQL's isolation levels](https://www.postgresql.org/docs/current/transaction-iso.html) illustrate the distinction between snapshot visibility and protection against concurrent anomalies. Choose transaction boundaries and retry semantics deliberately rather than assuming a database connection makes the workflow atomic.

## Delivery, replay, and recovery

Checkpoint at recoverable boundaries. Store pending external operations before execution and their outcomes afterward. If a worker dies between those writes, recovery must reconcile the operation rather than assume failure. Schema versions help long-lived runs resume after code changes.

A transactional outbox can persist an event alongside a state transition for eventual delivery. It does not make every downstream side effect exactly once. Stable operation identifiers, consumer deduplication, and domain-level idempotency remain necessary. Keep transport receipt, task acceptance, execution completion, and verification as separate events.

Cancellation must propagate to children and release unused reservations without pretending to undo completed effects. Results arriving after cancellation should be recorded or discarded according to an explicit policy, not silently promoted into the accepted answer. Bound pending messages and retained artifacts as well as active calls.

Recover from checkpoints using recorded model responses and tool receipts where available. Reissuing the same model prompt is another inference attempt, not deterministic replay. Preserve the source snapshot, model/backend identifier, prompt version, and application version needed to explain the result. Define migrations for old checkpoints and stop safely when a state schema is no longer supported.

[LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) provides examples of thread checkpoints and stores. In-memory implementations serve local development; durable storage is a separate configuration decision. Its [graph API](https://docs.langchain.com/oss/python/langgraph/graph-api) describes state reducers; an append reducer alone does not deduplicate retries or make concurrent effects safe.

## Shared evidence and derived indexes

Separate source artifacts, extracted candidate claims, accepted findings, and searchable projections. A graph or vector index can lag behind the authoritative record. Expose a revision or sequence watermark, and verify source status and authorization when retrieving content for a consequential decision.

When a source is corrected or removed, trace derivation links to mark dependent claims, summaries, and caches stale. Permission changes must reach derived content as well as original documents. Preserve audit history only within the applicable retention and access policy. [Provenance](https://www.w3.org/TR/prov-o/) records derivation; it does not establish that the underlying assertion is true.

[CRDTs](https://arxiv.org/abs/1805.06358) can support convergent replica updates under their data-type assumptions. Converging replicas can still contain contradictory claims. Use explicit claim identities and objections; do not interpret a merge operation as scientific consensus. Scarce budgets and authorization invariants need suitable coordination or a separately proven allocation design.

## Failure-oriented validation

Exercise duplicate delivery, worker loss after an external effect, lease expiry followed by late completion, cancellation during delegation, conflicting source updates, index lag, revoked access, and resumption after a schema change. Check both the resulting state and the side-effect receipts. A run that produces plausible final prose but loses a contradiction or repeats an operation has not passed state-management validation.
