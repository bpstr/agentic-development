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

## Design for misses and change

A cache miss should change performance, not correctness. Always provide or reference the context required by the API. Caching does not make context free, remove it from the model's context window, or guarantee indefinite memory.

Use stable document versions and tool schemas when repeated content really is unchanged. Do not retain obsolete instructions merely to improve a hit rate. When permissions change, rebuild the authorized context instead of relying on a previously permitted copy.

Measure cached input separately from total input and include cache creation or retention charges where applicable. Compare repeated requests and cold requests: a warm benchmark alone can conceal the latency new users experience.
