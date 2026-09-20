# Memory retrieval

Memory retrieval selects stored information relevant to the current interaction. Selection should consider scope, explicit identity, relevance, validity, and available context. Semantic similarity is only one signal.

First resolve the active user, workspace, project, and task from trusted application state. Then retrieve eligible memories within those boundaries. Rank candidates using relevance and provenance, and discard superseded or expired records before assembling context.

For “use our usual deployment process,” an exact project convention may be more useful than ten similar deployment conversations. For “why did we change the process?”, historical memories and their original source messages become relevant again.

A practical memory record can distinguish `valid_from`, `valid_until`, `supersedes`, and `source_message_ids`. This is an application modeling choice, not a universal memory API.

[LangGraph's store documentation](https://docs.langchain.com/oss/python/langgraph/persistence#memory-store) illustrates namespaced data and optional semantic search. Namespace selection still needs authenticated application logic; a user-supplied namespace is not authorization.

Budget memory alongside retrieved documents and live tool results. Repeating the same preference in several forms wastes context and may give it disproportionate influence. Log which memories were selected so incorrect behavior can be traced to stale or mis-scoped input.

Evaluate useful recall, missed relevant memories, incorrect scope, and stale influence. A high search relevance score cannot establish that a memory remains true.
