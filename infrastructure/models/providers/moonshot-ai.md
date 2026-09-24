# Moonshot AI and the Kimi API

[Official Kimi API quickstart](https://platform.kimi.ai/docs/overview) · [Kimi K3 repository](https://github.com/MoonshotAI/Kimi-K3)

Moonshot AI develops Kimi models and exposes hosted inference through the Kimi API Platform. Its hosted catalog and downloadable model releases are distinct inventories: access to a hosted model does not by itself establish that identical weights, serving optimizations, or tool behavior are available for self-hosting.

The current quickstart presents Kimi K3 as a general candidate for demanding coding and knowledge work, alongside task-specific Kimi K2.7 Code and K2.6 options. Kimi K3 weights are also published in the canonical repository, but the hosted API and open-weight artifact remain separate deployment surfaces. The API documents compatibility surfaces for OpenAI-style Chat Completions and Responses as well as Anthropic-style Messages. Verify the exact endpoint and supported options before reusing an existing client.

For example, replacing the inference provider behind a coding assistant can preserve the application's tool definitions and execution permissions. The integration still needs checks for argument formatting, reasoning continuation, image inputs, error handling, and the way tool results are returned. An API-compatible shape does not establish identical behavior.

Use the [Kimi open-weight profile](../open-source/kimi.md) when evaluating a downloadable deployment, including the Kimi K3 License and large-model serving requirements. For hosted inference, measure quality and latency through the intended account and region rather than inferring them from parameter counts or a consumer chat application. Keep model choice configurable and retain the original source evidence so the same workload can be evaluated against another provider.
