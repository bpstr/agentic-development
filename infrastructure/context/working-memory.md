# Working memory

Working memory is the task state an agent maintains while completing current work. It includes the current goal, intermediate findings, pending calls, temporary variables, and recent observations. Its scope is the active task rather than a general profile intended for future conversations.

Separate structured state from the conversation transcript. A deployment assistant might retain `release_id`, `approval_status`, `last_observed_revision`, and `pending_operation_id`. These fields let the runtime resume the correct operation even if older dialogue has been compacted. Store hypotheses separately from confirmed observations, and update completion fields only after receiving a corresponding result.

Working memory can be checkpointed to durable storage without becoming long-term personal memory. Durability describes survival across process failures; memory scope describes how the information is used. [LangGraph's persistence documentation](https://docs.langchain.com/oss/python/langgraph/persistence) distinguishes thread checkpoints from stores used across threads.

When several workers contribute, define which component owns each field and how updates merge. An append-only observation list behaves differently from a single current status that concurrent writes can overwrite.

Working memory is not authoritative domain state. Recheck external records before consequential actions, especially after a pause or handoff. Apply retention and deletion rules when the task ends, and promote information into longer-lived memory only through an explicit policy that preserves provenance and scope.
