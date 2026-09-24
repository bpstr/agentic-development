# GPT-5.6 Luna

[Official model specification](https://developers.openai.com/api/docs/models/gpt-5.6-luna) · [Current model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing)

GPT-5.6 Luna was OpenAI's GPT-5.6 tier for cost-sensitive, high-volume workloads. Its API identifier is `gpt-5.6-luna`. OpenAI released **GPT-6 Luna** on September 22, 2026, and the current catalog positions `gpt-6-luna` as the efficient GPT-6 tier for focused, high-volume tasks. Treat this page as a predecessor profile and verify the current identifier before deployment.

A suitable evaluation target is a constrained classifier with a small label set and clear examples. Another is extracting a few fields from short, well-structured text. Keep such tasks narrow enough that success can be validated directly; economical inference does not remove the need for correct domain behavior.

For example, let a Luna-tier model propose a task category and a referenced project identifier. Validate the identifier against the authorized project set before using it. Route missing or conflicting evidence to an explicit clarification or stronger configuration rather than accepting a plausible invented value.

The GPT-5.6 API supported a broad range of reasoning-effort choices. Do not assume those settings, latency, context allowance, pricing, or tool support carry over unchanged to GPT-6 Luna. Compare complete request latency and retry frequency under the intended workload, and keep prompts compact even when a large context window is available.
