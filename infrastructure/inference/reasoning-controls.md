# Reasoning controls

Reasoning controls influence how much computation a model applies before producing its answer. Providers expose different abstractions: qualitative effort levels, thinking budgets, or model-specific modes. These settings are not interchangeable across providers.

For example, this is an OpenAI Responses configuration fragment:

```json
{
  "reasoning": {"effort": "low"}
}
```

It belongs inside a complete request. Allowed values and defaults depend on the selected model; an unsupported value can be rejected. The [OpenAI reasoning guide](https://developers.openai.com/api/docs/guides/reasoning) defines the current contract. Claude has separate [thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) and [effort](https://platform.claude.com/docs/en/build-with-claude/effort) controls; Gemini documents its own [thinking configuration](https://ai.google.dev/gemini-api/docs/thinking).

## Allocate effort to the task

A narrow classification and a multi-step migration review need different levels of deliberation. Evaluate settings against representative tasks rather than increasing effort globally. Compare correctness, tool choices, output length, cost, and completion time. More computation is useful only when its measured benefit justifies the delay.

Reasoning effort differs from answer verbosity. A short answer may require substantial reasoning; a long explanation can be generated with little. Output-token limits can also interact with internal reasoning usage, depending on the API.

Provider-returned reasoning summaries are not a complete trace of internal computation. Use actual tool events and operation receipts for operational evidence. Preserve opaque reasoning or signature fields when the API requires them for continuation; treating them as ordinary editable prose can break the next request.
