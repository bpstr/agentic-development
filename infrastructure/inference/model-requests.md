# Model requests

A model request specifies the context to process and the constraints on the generated result. Its main parts are a model identifier, instructions, input content, generation settings, and optional tools or output schemas. The exact field names belong to a provider API.

Keep instructions distinct from task data. For example, “extract the invoice number” is an instruction; the uploaded invoice is evidence. A sentence inside that invoice that asks the assistant to change its behavior remains document content.

## A concrete request

This body uses the OpenAI Responses contract. It is an illustrative request for a model documented to support Responses:

```json
{
  "model": "gpt-6-astra",
  "instructions": "Define the requested term in one plain sentence.",
  "input": "What is an inference request?"
}
```

Send provider requests from a trusted backend with its configured credentials. The [Responses API guide](https://developers.openai.com/api/docs/guides/migrate-to-responses) describes the endpoint and accepted input items.

## Construct a bounded context

Include the current request, relevant prior decisions, and the evidence needed for this step. Fetching every available document increases input size without guaranteeing better answers. Keep stable instructions early when the provider's caching model benefits from repeated prefixes.

Validate configuration before dispatch: model compatibility, supported content types, token limits, and mutually exclusive fields. Put a request timeout and correlation ID in the transport layer. Avoid interpreting a client timeout as proof that the provider performed no work.

Provider adapters should translate application concepts deliberately. A common `messages` array cannot represent every API's instructions, media, tool results, and opaque continuation items without additional rules.
