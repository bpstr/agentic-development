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

## Iterating on blueprints and architecture specifications

An architecture review must ask whether a proposal satisfies its drivers, not whether the next draft is longer or contains more familiar patterns. The [Architecture Tradeoff Analysis Method](https://sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/) evaluates interacting quality attributes through scenarios and risks. A [2025 study of LLM-assisted Attribute-Driven Design](https://arxiv.org/abs/2506.22688) explores structured architect-led iteration, while reporting only partial satisfaction of design drivers in its cases. Neither source establishes that repeated unconstrained rewriting improves a blueprint.

Use the following workflow as an engineering synthesis, not a claim that one rubric can mechanically prove an architecture correct.

### Preserve the original decision context

Keep a compact authoritative brief outside the chat transcript: goals, non-goals, expected workloads, team and operating constraints, data boundaries, quality attributes, existing systems, and unresolved assumptions. Give important requirements stable identifiers. Treat load estimates and provider capabilities as assumptions or sourced facts, not convenient inventions.

Maintain explicit decision states: proposed, accepted, rejected, and superseded. An architecture decision record should capture context, considered alternatives, the choice, consequences, and what evidence would reopen it. An accepted decision is not eternally correct, but a new model pass is not itself evidence for reversing it.

Separate requirements from implementation choices. “Recover accepted work after a worker crash” is a requirement; “use a particular queue product” may only be one proposed mechanism. Freezing every initial design choice would prevent legitimate discovery just as surely as rewriting everything would destroy continuity.

### Review scenarios rather than adjectives

A useful quality-attribute scenario states the stimulus, operating context, affected system part, expected response, and a measurable response criterion. Where a numeric target is not yet known, mark it unresolved instead of inventing a precise requirement.

For the webhook example:

| Review question | Evidence needed | Unsupported substitute |
| --- | --- | --- |
| What happens after acceptance but before dispatch when a process crashes? | Persistence/dispatch boundary and a recovery sequence | “The queue makes it reliable” |
| Can two tenants submit the same provider event ID safely? | Identity and uniqueness scope traced through storage and workers | “The API uses authentication” |
| Can a deployment be rolled back while pending events exist? | Schema/protocol compatibility and replay rules | “Git can revert the code” |
| Who operates each additional component? | Ownership, monitoring, recovery, and capacity assumptions | “Microservices improve scalability” |

Review performance, security, operability, maintainability, and cost separately. A weighted average must not hide a hard isolation or data-loss violation. Some architectures are incomparable without an explicit stakeholder tradeoff; do not force an automatic winner.

### Require a reason for added complexity

An illustrative brief might constrain a product to a small team, one region, and an existing SQL database. A later draft proposing independent services and a streaming platform must name the unsatisfied driver it addresses, why simpler options fail, the operational cost, and the new failure modes. The change may be justified; its popularity is not the justification.

Use a complexity ledger for consequential additions: deployment units, state stores, synchronization paths, external dependencies, and recovery responsibilities. This is a review aid, not a universal ban on distributed architecture or a rule that fewer components always win.

### Revise in bounded passes

Start with a coherent candidate. Run a read-only review for a specific concern, such as requirement coverage, consistency, failure recovery, or implementation feasibility. Require a finding to reference a requirement and a concrete section or sequence. Permit “no necessary change.” Patch affected sections and re-check cross-references, names, contracts, and decisions elsewhere.

Explore genuinely different architectures as separate candidates from the same brief before synthesizing them. Do not accumulate mutually incompatible alternatives into one master design. A fresh critic should receive the authoritative evidence and accepted decisions, not merely the latest persuasive explanation.

Use schemas, contract examples, small feasibility spikes, load experiments, or executable state models where they can resolve a specific uncertainty. These checks validate particular claims, not the entire architecture. Record which conclusions remain judgment-based or unverified.

Stop when agreed drivers are sufficiently addressed for the next authorized stage, no new supported blocker appears, or further progress requires missing evidence or a stakeholder decision. Keep an unresolved-risk register rather than polishing uncertainty into certainty. Apply the [evaluator–optimizer acceptance policy](../../patterns/evaluator-optimizer-pattern.md) to retain the best supported draft, not automatically the most recent one.
