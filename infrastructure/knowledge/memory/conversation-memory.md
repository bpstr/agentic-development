# Conversation memory

Conversation memory preserves an interaction's continuity. Store original messages separately from the subset assembled for a model call. The durable transcript is evidence; a summary is a derived view optimized for context limits.

Preserve active goals, constraints, unresolved questions, stable entity IDs, and completed action receipts explicitly. An utterance such as “mark that done” depends on the latest relevant entity, not merely the most semantically similar historical task.

When compacting, retain pointers to source messages. If exact wording matters, retrieve those messages before acting. A summary saying “user approved deployment” is weaker than the actual approval with its scope and target revision.

[LangGraph's conversation memory examples](https://docs.langchain.com/oss/python/langgraph/add-memory) discuss trimming, deleting, and summarizing messages. These mechanisms manage request size; they should not erase the application's authoritative history by accident.

Keep conversation time and event time distinct. A user can discuss last week's incident today. Store tool outputs with their observation time so later answers do not present them as current facts.

Test continuity with realistic references: “same as before,” “continue,” and “undo the last change.” Verify that the correct object and prior decision survive compaction. Retrieval can supplement older history, but bounded explicit state is usually more reliable for the active task than repeated broad searches.
