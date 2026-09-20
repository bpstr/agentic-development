# Long-term memory

Long-term memory preserves selected information across conversations or runs. Examples include confirmed preferences, durable project conventions, lessons from completed work, and facts that would otherwise need repeated discovery.

A useful memory item has content, scope, source, time, and status. Record whether it was explicitly stated, observed through a tool, or inferred. “The project uses PostgreSQL” and “the user prefers PostgreSQL” are different claims with different possible sources.

Choose scope deliberately. A personal preference should not silently become a team policy; a project convention should not affect unrelated repositories. Retrieve memory within the authenticated user, workspace, and project boundaries.

Use a write policy as well as a retrieval policy. Avoid saving every conversational remark as a durable fact. Candidate memories may need confirmation, deduplication, contradiction checks, expiration, or a clear supersession relationship.

The [Mem0 documentation](https://docs.mem0.ai/open-source/overview) describes extracting and managing memories from interactions. Whatever the implementation, application ownership of correction and deletion remains necessary.

For example, a newly confirmed deployment command can supersede an older command while preserving its historical source. Do not simply append both as equally current memories. Measure useful recall and harmful stale recall separately; a system that remembers more can still perform worse if outdated instructions frequently enter context.
