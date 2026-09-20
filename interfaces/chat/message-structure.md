# Message structure

A message is an authored contribution to a conversation. A run is an execution attempt, and a tool call is one operation within that attempt. These identities are related but not interchangeable: one run may create several messages, and a single message can contain multiple content parts.

Store typed parts rather than flattening everything to text. An illustrative application record is:

```json
{
  "id": "msg_42",
  "conversationId": "conv_12",
  "runId": "run_8",
  "role": "assistant",
  "parts": [
    {"id": "part_1", "kind": "text", "text": "I found the release."},
    {
      "id": "part_2",
      "kind": "tool",
      "callId": "call_3",
      "name": "change_deadline",
      "state": "awaiting_approval",
      "approvalId": "approval_6"
    }
  ]
}
```

This is a domain schema, not a provider request. Keep the provider-to-domain conversion at the transport boundary. Provider-specific sequence numbers and item identifiers can be retained for correlation without becoming the only identifiers your application understands.

Use stable part IDs during streaming. Store file identity and access rules separately from a temporary download URL. Represent citations with source identity and supporting locations so renderers can place links beside the relevant claim. Preserve the difference between absent content, an unfinished part, and a completed empty result.

Define how edits, branches, and deletion affect history. A deleted chat bubble must not silently erase an audit receipt for a completed external action. Conversely, retaining an operation record does not require retaining every sensitive tool argument indefinitely.

[AI SDK's message documentation](https://github.com/vercel/ai/blob/main/content/docs/04-ai-sdk-ui/02-chatbot.mdx) demonstrates a concrete parts-based UI format. Its wire contract should be adapted explicitly when the application uses a different durable representation.
