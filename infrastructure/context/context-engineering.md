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
