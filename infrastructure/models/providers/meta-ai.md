# Meta AI and Muse models

Official sources: [Meta developer platform](https://dev.meta.ai/), [model and product overview](https://dev.meta.ai/docs/overview), [API quickstart](https://dev.meta.ai/docs/quickstart), and [pricing and data tiers](https://dev.meta.ai/docs/pricing-rate-limits).

Meta AI is a model provider as well as the supplier of several agent products. Treat those layers separately: selecting a Meta model does not install a coding harness, provision a personal agent, or grant access to a user's applications.

## Model, API, and application boundaries

- **Muse Spark** is the reasoning and multimodal model family. The developer catalog checked on September 23, 2026 lists `muse-spark-1.3`, alongside earlier versions. The documented context window is 1,048,576 tokens; input acceptance and output limits still need checking for the selected model and endpoint.
- **Meta Model API** is hosted inference. Its [integration guide](../../inference/apis/meta-model-api.md) covers authentication, request formats, tools, reasoning continuity, and data tiers.
- **Muse Code** is an executing coding agent for terminal and automation workflows. Its [coding-agent guide](../../../development/coding-agents/tools/muse-code.md) covers repository tools, permissions, extensions, and recovery.
- **Muse desktop** is a client for the personal-agent product, including a permissioned Mac integration. Its [desktop guide](../../../interfaces/desktop/apps/muse-desktop.md) explains the distinction between the local client, local application access, and cloud execution.

The catalog also separates Muse Image generation/editing, Muse Voice Transcribe speech recognition, and SAM segmentation. Those capabilities are not automatically outputs of a Spark text request. Muse Glimmer provides a separate open-weight/self-hosting route. Existing [Llama coverage](../open-source/llama.md) addresses another Meta model family; neither its availability nor its license should be generalized to all Muse products. See the [official catalog](https://dev.meta.ai/docs/overview).

## Strengths and appropriate uses

Meta positions Spark 1.3 for long-horizon coding and multimodal work involving difficult inputs. These are provider claims, not evidence that it wins every workload. The useful architectural opportunities are more specific:

- **Tool-heavy application agents:** compatible request formats reduce the amount of transport code that must change, while reasoning replay can preserve continuity between tool results.
- **Repository work:** Muse Code supplies a ready-made harness rather than requiring an application team to implement all interactive and headless execution machinery.
- **Mixed-source tasks:** multimodal inputs may avoid a separate text-only interpretation step, provided the task's evidence and required precision survive that conversion.

These fit assessments follow from the [developer platform](https://dev.meta.ai/) and [protocol documentation](https://dev.meta.ai/docs/protocols), not from a benchmark performed for this repository. Evaluate task completion, grounded answers, tool correctness, latency distributions, and cost per accepted result on representative fixtures before replacing an existing provider.

## Commercial and data-policy boundary

Standard and Contributor are different data-use choices, not merely speed or quality presets. Contributor uses distinct model IDs and authorizes training use of prompts and completions; Standard does not. Keep the current numbers and selection logic in the [API guide](../../inference/apis/meta-model-api.md), backed by [Meta's pricing page](https://dev.meta.ai/docs/pricing-rate-limits).

A consumer Muse subscription or its personal data-control toggle is not evidence of an application's API billing or data policy. Likewise, an OpenAI-compatible request is not access to OpenAI's hosted agent runtime. Choose the provider, inference contract, executing harness, and authorization boundary independently.
