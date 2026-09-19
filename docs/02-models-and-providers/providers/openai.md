# OpenAI

**Sources reviewed:** 2026-09-19 · **Evidence:** official model and API documentation; no live calls or original benchmark runs.

OpenAI exposes model inference, SDK-level agent tooling, and managed agent execution. These are separate integration layers.

Current model candidates include [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), Terra, and Luna. Use the [model catalog](https://developers.openai.com/api/docs/models) for exact IDs, modalities, context limits, tools, and access requirements.

- **Astra** — positioned for demanding reasoning, coding, research, computer-use, and document work.
- **Sol** — flagship GPT-5.6 tier for complex professional work.
- **Terra** — capability/cost balance.
- **Luna** — high-volume and cost-sensitive workloads.

Treat these as vendor positioning and shortlist guidance. Evaluate exact models on your workload.

## API and agent surfaces

- **Responses API** — direct inference; your application owns surrounding domain behavior and custom tool execution.
- **Agents SDK** — agent-loop utilities that run with your application. See [Agents SDK](https://openai.github.io/openai-agents-python/).
- **Agents API** — managed agent harness. See the [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview).

Get current rates from [OpenAI pricing](https://developers.openai.com/api/docs/pricing). ChatGPT and coding-product subscriptions are not API token pricing.
