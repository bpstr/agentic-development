# OpenAI

[Handbook](../../README.md) · [Chapter](README.md)

**Sources reviewed:** 2026-09-19 · **Evidence:** official model and API documentation; no live calls or original benchmark runs.

## The model family

The following are the documented model roles at the review date. They help form a shortlist; task-specific performance still needs measurement.

| Model | Documented positioning | Practical evaluation candidate |
| --- | --- | --- |
| [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), `gpt-6-astra` | Highest-capability option for complex reasoning, coding, research, computer use, and document work | Difficult investigations and work requiring several kinds of tools |
| [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), `gpt-5.6-sol` | Flagship tier within GPT-5.6 for complex professional work | A comparison baseline for demanding general-purpose tasks |
| [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), `gpt-5.6-terra` | Balance between capability and cost | Routine agent work with meaningful reasoning needs |
| [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna), `gpt-5.6-luna` | Cost-sensitive, high-volume workloads | Classification, extraction, and bounded tool tasks |

The [model catalog](https://developers.openai.com/api/docs/models) is the source for the family positioning. The “evaluation candidate” column is handbook guidance, not a claim that one model wins those workloads. The `gpt-5.6` alias currently maps to Sol; explicit IDs make recorded comparisons easier to understand.

Astra and Sol accept text and image input and produce text output. Their ability to invoke image or computer tools should not be confused with every modality being native model output. Check the individual model cards for supported tools, context limits, output limits, and access tiers.

## Model API, SDK, and managed agent

| Surface | Who owns the loop? | Use when |
| --- | --- | --- |
| Responses API | Your application coordinates subsequent calls and custom tool results | You want direct control over inference and application behavior |
| Agents SDK | SDK runs inside your application | You want agent-loop utilities while owning deployment and integrations |
| Agents API | OpenAI runs a managed harness | You want durable sessions with managed orchestration and recovery |

These are distinct integration choices, even when they use the same model. The [Agents SDK guide](https://developers.openai.com/api/docs/guides/agents/sdk) describes application-owned execution. The [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview) describes managed sessions, context compaction, tools, and execution environments.

## A minimal model request

Illustrative request body for `POST /v1/responses`; this is a generation request, not an agent definition:

```json
{
  "model": "gpt-6-astra",
  "reasoning": { "effort": "low" },
  "instructions": "Summarize supplied project facts. Keep task IDs and flag missing evidence.",
  "input": "REL-42 is blocked by REL-38. REL-38 needs a database review. Write a two-sentence status update."
}
```

The [prompting guide](https://developers.openai.com/api/docs/guides/prompt-engineering) documents this request structure. For tools, Astra requires the Responses API. Its documented reasoning settings start at `low`; `none` is unsupported. Do not copy `temperature` or `top_p` from unrelated model examples. These compatibility details are in the [Astra guide](https://developers.openai.com/api/docs/guides/latest-model).

## Benchmarks, price, and a practical comparison

Use the [Astra guide's evaluation links](https://developers.openai.com/api/docs/guides/latest-model#introduction) to reach published evidence, and the [official model-selection guidance](https://developers.openai.com/api/docs/guides/model-selection) to design your own comparison. For Sol, begin with its [model card](https://developers.openai.com/api/docs/models/gpt-5.6-sol) and check the current [SWE-bench results](https://www.swebench.com/) for available model/harness submissions. A missing comparable result should remain “not established.”

Get current rates from [OpenAI pricing](https://developers.openai.com/api/docs/pricing). Account for cached input, cache writes, long-context pricing, output usage, service tiers, tools, and containers where applicable. ChatGPT or coding-product subscription limits are not API token prices.

For a project assistant, compare Sol and Astra on the same difficult cases, then try Terra or Luna on bounded tasks. Record completion quality, tool calls, latency, and total spend as described in [Selection and benchmarks](selection-and-benchmarks.md).
