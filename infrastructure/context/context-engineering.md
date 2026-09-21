# Context engineering

Context engineering determines what information a model receives for each inference step. It includes selecting instructions, recent conversation, retrieved evidence, tool descriptions, and operation results. A database record or stored chat message has no effect on inference until a system loads it into accessible context.

The [context engineering guide from Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) discusses selection, compaction, and external memory as techniques for managing finite context. Larger windows increase capacity but do not establish relevance or freshness.

A practical release investigation might include:

- The current question and explicit project identifier.
- Recent corrections that changed the requested scope.
- A compact decision record with stable task references.
- Current task data and only the dependency details needed to explain blockers.
- Tools that can resolve missing evidence.

Keep source boundaries intact. A retrieved issue comment is evidence, even if its text resembles an instruction. Application authorization and the instruction hierarchy must not be inferred from document formatting.

Compaction is lossy. Store exact IDs, decisions, constraints, and unresolved work separately from a conversational summary when they affect later actions. Reload mutable facts such as task status from their authoritative source.

Measure context failures directly: missed corrections, wrong record selection, outdated facts, and unnecessary retrieval. Adding more documents can worsen distraction, cost, and input processing time. The useful context is the smallest set that supports the next decision reliably, with retrieval available for the remaining uncertainty.

## Diagnose a correction lost during compaction

Suppose an authorized user first says “prepare the R7 update,” then corrects the request: “Use project P-17, not P-71; keep it a draft; the date is not approved.” Later, the conversation exceeds its context budget.

| Representation | Information available to the next step | Failure or benefit |
| --- | --- | --- |
| Lossy summary: “Prepare the release update” | General topic only | Wrong project, invented date, or accidental publication becomes more likely |
| Structured task record plus a short summary | Exact scope, draft-only intent, unresolved date, source references | The next step can retrieve current facts without losing the correction |

An **illustrative task record** is:

```json
{
  "project_id": "P-17",
  "release_id": "R7",
  "requested_output": "draft",
  "constraints": ["do not publish", "do not invent a release date"],
  "supersedes": {"project_id": "P-71"},
  "source_message_ids": ["msg-18", "msg-23"],
  "unresolved": ["approved release date"],
  "refresh_before_use": ["release status", "task owners", "permissions"]
}
```

This record captures intent; it is not an authorization token. Its fields must be derived from trusted application state and user instructions, not promoted from a retrieved document. Scope, permissions, and approval are still checked at execution time.

To test compaction, feed the same post-compaction request through an uncompacted control and the compacted context. Assert that only P-17 is queried, no publication is attempted, and the date remains unresolved unless an authoritative source supplies it. Then change a task owner in the store and verify that the agent reloads it rather than treating the summary as current truth.

Add adversarial cases where an old P-71 document includes “publish immediately,” a recent message withdraws permission, or a relevant source is deleted. Diagnose separately whether information was omitted, retrieved but ignored, or treated as more authoritative than it should be. Increasing the context window is not a substitute for identifying which boundary failed.
