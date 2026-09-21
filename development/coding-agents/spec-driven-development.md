# Specification-driven development with coding agents

Specification-driven development makes intended behavior explicit before using an agent to implement it. The useful output is a traceable chain from requirement to code change to observed acceptance evidence, not a large collection of planning documents. [GitHub Spec Kit](https://github.github.io/spec-kit/) provides a concrete implementation of specification, planning, and implementation workflows; this article describes the underlying practice without requiring that tool.

A specification records behavior, constraints, and unresolved decisions. A plan proposes how to realize them. Neither is evidence that the change works. Start by inspecting [repository context](repository-context.md), and finish with [coding-agent verification](coding-agent-verification.md) against the actual diff.

## Turn a request into a bounded contract

Suppose the request is “Deduplicate webhook deliveries without changing our public response contract.” An **illustrative compact specification** could be:

```text
Goal: repeated delivery of one event schedules one business job.
Event identity: authenticated tenant + provider + provider event ID.
Scope: inbound webhook handler, event store, job enqueue boundary.
Non-goals: new queue product, unrelated refactors, API redesign.
Invariants:
  S1: duplicate deliveries do not enqueue an additional business job.
  S2: different event identities remain independent.
  S3: concurrent duplicates cannot both win acceptance.
  S4: crash recovery cannot mark an event complete while losing its job.
  S5: status codes and response bodies retain their documented behavior.
Unresolved: how long must deduplication records remain valid?
```

The retention question needs an explicit product decision because deleting the record can permit a later duplicate. Do not let the implementation silently choose an arbitrary duration and then write tests that endorse it. Authenticate the delivery and derive tenant identity from trusted context before applying the deduplication rule.

## Connect acceptance conditions to verification

| Requirement | Acceptance case | Evidence to inspect |
| --- | --- | --- |
| S1 | Deliver one identity twice | One durable event and one logical job |
| S2 | Deliver two distinct identities; repeat across tenants | Separate jobs with correct scope |
| S3 | Release two concurrent handlers at the acceptance boundary | Only one wins; no duplicate logical job |
| S4 | Interrupt between event persistence and dispatch | Pending work resumes without loss or duplication |
| S5 | Compare existing and changed handler responses | Same supported status/body contract |

Tests must check the behavior, not merely that a helper named `deduplicate` was called. A unique constraint may protect event acceptance while still leaving a gap between acceptance and job dispatch. A transaction or transactional outbox can address that local gap; downstream workers still need their own idempotency contract. Avoid claiming globally exactly-once execution from a database constraint alone.

## Implement and revise without losing intent

Give the coding agent the scoped specification, relevant source paths, baseline test command, forbidden changes, and decisions it must not invent. Ask it to reproduce the failing behavior before editing where feasible. Review a small diff and run targeted acceptance tests plus the relevant regression suite.

When implementation reveals a missing assumption, update the specification and record why before changing acceptance criteria. Distinguish a requirement correction from a test weakened to accommodate broken behavior. Keep the accepted behavior stable when experimenting with implementation details.

The completion report should map each requirement to its test result, tested commit, environment, and any unresolved limitations. A green unit test does not establish concurrent database behavior, and a generated test command is not evidence that it ran. Preserve failing output when a requirement is not yet met.

For a small typo fix, the issue text and one check may be enough. More artifacts are justified by ambiguity, risk, coordination, or long-lived decisions—not by the presence of an agent. Specifications constrain scope and make review possible; they do not replace human judgment about product intent or deployment risk.
