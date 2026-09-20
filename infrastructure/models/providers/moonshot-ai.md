# Moonshot AI and the Kimi API

[Official Kimi API quickstart](https://platform.kimi.ai/docs/overview) · [Kimi K2.5 repository](https://github.com/MoonshotAI/Kimi-K2.5)

Moonshot AI develops Kimi models and exposes hosted inference through the Kimi API Platform. Its hosted catalog and downloadable model releases are distinct inventories: access to a newer hosted model does not imply that the corresponding weights have been published.

The current quickstart presents Kimi K3 as a general candidate for demanding coding and knowledge work, alongside task-specific Kimi K2.7 Code and K2.6 options. It documents compatibility surfaces for OpenAI-style Chat Completions and Responses as well as Anthropic-style Messages. Verify the exact endpoint and supported options before reusing an existing client.

For example, replacing the inference provider behind a coding assistant can preserve the application's tool definitions and execution permissions. The integration still needs checks for argument formatting, reasoning continuation, image inputs, error handling, and the way tool results are returned. An API-compatible shape does not establish identical behavior.

Use the [Kimi open-weight profile](../open-source/kimi.md) when evaluating a downloadable deployment. For hosted inference, measure quality and latency through the intended account and region rather than inferring them from parameter counts or a consumer chat application. Keep model choice configurable and retain the original source evidence so the same workload can be evaluated against another provider.
