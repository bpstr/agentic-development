# Context compaction

Context compaction replaces accumulated interaction history with a smaller representation that supports continuing the task. It typically preserves goals, constraints, decisions, corrections, unresolved work, and references to important evidence. It differs from truncation, which simply removes material, and caching, which reuses computation without shortening the logical input.

A practical design keeps recent turns verbatim and summarizes older completed work. Trigger compaction before the request reaches its limit, leaving room to produce the summary itself. Provider-managed implementations may require opaque or signed continuation blocks to be preserved exactly; [Claude's compaction documentation](https://platform.claude.com/docs/en/build-with-claude/compaction) describes one such mechanism.

For a repository task, useful compacted state might retain the requested behavior, files changed, commit identifiers, failed checks, and the next unresolved action. Keep exact paths and error messages when paraphrasing would make them unusable. An intended tool call must remain distinguishable from a confirmed result.

Compaction is lossy. Preserve stable references to the original transcript, tool receipts, and authoritative records so details can be reloaded. Repeatedly summarizing summaries can accumulate omissions or strengthen an earlier uncertain conclusion.

Evaluate compaction by resuming representative tasks and checking whether constraints, identifiers, and pending work survive. A shorter summary is useful only if it retains the information required for the next decision.
