# Conversation state

Conversation state is the information required to continue a discussion coherently. Three distinct stores often participate:

- **Product state:** authoritative tasks, documents, permissions, and object versions.
- **Conversation history:** messages, corrections, tool results, and references.
- **Model context:** the bounded subset supplied to this inference.

Keeping these separate lets a conversation outlive a model provider session and lets context shrink without deleting the original discussion.

## Continuation mechanisms

Some APIs accept the complete relevant history on each request. Others allow a reference to stored history. For example, OpenAI Responses accepts `previous_response_id`; current Gemini Interactions accepts `previous_interaction_id`. These IDs identify provider state, not application users or projects. [OpenAI conversation state](https://developers.openai.com/api/docs/guides/conversation-state), [Gemini conversation examples](https://ai.google.dev/gemini-api/docs/get-started).

Illustrative application mapping:

```json
{
  "conversation_id": "discussion-42",
  "provider": "selected-provider",
  "provider_continuation_id": "opaque-provider-id",
  "last_committed_message": 18
}
```

This is an application record, not a provider schema. Apply retention and access controls to both its transcript and continuation identity.

## Preserve what future work needs

Retain tool call/result relationships, user corrections, unresolved work, and references to authoritative objects. When carrying history manually, preserve opaque provider items required for continuation. Claude, for example, requires returned thinking blocks and signatures to remain unmodified where that contract applies. [Messages reference](https://platform.claude.com/docs/en/api/messages/create).

A summary can preserve intent while losing exact details. Retrieve the original message or current object when an operation depends on a precise identifier, deadline, or permission. Do not infer a task's current status from an old conversation summary.
