# Context caching

Context caching reuses previously processed input to reduce repeated inference work. It differs from answer caching: the provider still generates an answer, but may reuse processing associated with a matching prompt prefix or an explicitly stored context.

Imagine twenty requests that use the same long API contract:

```text
Stable instructions
Stable API contract
Request-specific question
```

This arrangement gives prefix-based caching a stable region. Placing a random request ID at the beginning can prevent that region from matching. Keep identifiers in transport metadata when they are not model context.

Providers expose different mechanisms. OpenAI documents [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching); Claude supports [cache-control breakpoints and automatic caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching); Gemini documents [implicit and explicit caching](https://ai.google.dev/gemini-api/docs/caching). Minimum sizes, retention, billing, and supported modalities belong to those contracts.

## OpenAI cache lifetimes and write accounting

For GPT-5.6 and newer models in the [Responses API](https://developers.openai.com/api/docs/guides/prompt-caching), `prompt_cache_options.ttl` selects the **minimum** cache lifetime: `"30m"` by default or `"12h"` for stable prefixes reused across longer gaps. The 30-minute write rate is **1.25×** the ordinary input-token rate, versus **2.5×** for 12-hour writes. These are total write prices, not surcharges; cached-read pricing is identical for both. A 12-hour minimum is **not** a guaranteed deletion deadline or durable memory.

A compatible Responses request may include:

```json
{"model":"gpt-6.1-sol","input":"Review this API design.","prompt_cache_options":{"ttl":"12h"}}
```

A `prompt_cache_breakpoint.ttl` can override the request default for an explicit prefix. Upgrading a still-valid 30-minute entry to 12-hour coverage can charge a fresh 12-hour write for its tokens. Use `usage.input_tokens_details.cache_write_tokens_details` (including `ttl_30m_tokens` and `ttl_12h_tokens`) when calculating cost, not a single multiplier on all input. New `ttl` options are distinct from older `prompt_cache_retention`. Cache hits still count toward token rate limits; review regional and data-retention constraints before extending cache lifetime.

## Design for misses and change

A cache miss should change performance, not correctness. Always provide or reference the context required by the API. Caching does not make context free, remove it from the model's context window, or guarantee indefinite memory.

Use stable document versions and tool schemas when repeated content really is unchanged. Do not retain obsolete instructions merely to improve a hit rate. When permissions change, rebuild the authorized context instead of relying on a previously permitted copy.

Measure cached input separately from total input and include cache creation or retention charges where applicable. Compare repeated requests and cold requests: a warm benchmark alone can conceal the latency new users experience.
