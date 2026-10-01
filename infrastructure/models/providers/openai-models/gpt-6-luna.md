# GPT-6 Luna

[Official model specification](https://developers.openai.com/api/docs/models/gpt-6-luna) · [Current model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing)

GPT-6 Luna is OpenAI's efficient GPT-6 tier for focused, high-volume work. Its API identifier is `gpt-6-luna`. OpenAI released the model on September 22, 2026.

The model accepts text and image input and produces text output. The Responses API supports built-in tools and function calling. Chat Completions supports function calling only when `reasoning_effort` is `none`. The documented reasoning-effort range is `none`, `low`, `medium`, `high`, `xhigh`, and `max`.

The current specification documents a 1,050,000-token context window and 128,000 maximum output tokens. EU data residency is available with Standard, Flex, and Batch processing. Processing tier, long-context pricing, and tool charges remain separate deployment choices and should be checked against the current model page.

Luna is a candidate for constrained classification, extraction, routing, summarization, and high-volume agent steps, but the tier name is not a quality guarantee. Compare it against a stronger baseline on the same ambiguous inputs and tool failures, and measure successful task completion rather than only per-token cost.
