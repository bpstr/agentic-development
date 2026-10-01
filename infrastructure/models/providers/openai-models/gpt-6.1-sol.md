# GPT-6.1 Sol

[Official model specification](https://developers.openai.com/api/docs/models/gpt-6.1-sol) · [Current model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing)

GPT-6.1 Sol is OpenAI's current complex-work tier below Astra. Its API identifier is `gpt-6.1-sol`. OpenAI released it on September 29, 2026 as an upgrade to GPT-6 Sol and positions it for complex coding, computer use, and professional work where Astra-level capability is not required on every request.

The model accepts text and image input and produces text output. For tool calling, use the Responses API; the model's Chat Completions support does not include tool calling. Its documented reasoning-effort values are `low`, `medium`, `high`, `xhigh`, and `max`; `none` and `minimal` are not supported.

The current specification documents a 1,050,000-token context window and 128,000 maximum output tokens. Long-context requests can have different pricing multipliers, so do not estimate a large agent run from the short-context token rate alone. Region and processing-tier support also differ: for example, the model supports US and EU data residency while Fast mode is unavailable with EU data residency.

Use a fixed evaluation set when choosing between Sol and Astra. Compare accepted outcomes, retries, tool mistakes, latency, and total request cost rather than inferring application quality from provider benchmarks. Pin the explicit identifier when reproducibility matters and re-run evaluations before changing aliases, reasoning effort, processing tier, or tool configuration.
