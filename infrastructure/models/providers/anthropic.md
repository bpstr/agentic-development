# Anthropic

[Official model catalog](https://platform.claude.com/docs/en/models/overview) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Messages API](https://platform.claude.com/docs/en/api/messages/create)

Anthropic develops the Claude model family and serves it through the Claude API and supported partner platforms. At the model layer, Claude provides language generation, visual understanding, and tool-use behavior. Claude Code and Claude Managed Agents add separate execution environments around models.

The current catalog recommends **Claude Opus 5.5** (`claude-opus-5-5`) as the starting point for most workloads, with **Fable 5.2** (`claude-fable-5-2`, released November 9, 2026) for demanding reasoning and long-horizon agentic work, **Sonnet 5.5** (`claude-sonnet-5-5`, released September 28, 2026) for a faster balance of speed and intelligence, and **Haiku 5.5** (`claude-haiku-5-5`, released October 7, 2026) for high-volume, latency-sensitive classification, extraction, and routing. Opus 5.5 was released on September 22, 2026 and replaced Opus 5 as the current Opus recommendation. These are provider positioning statements; they do not replace application measurements. Model pages specify thinking behavior, input and output limits, supported platforms, and exact identifiers.

A practical comparison is to run the same document-triage cases through two tiers, holding the system instruction, tool schemas, and expected labels constant. Measure incorrect classifications, unnecessary tool calls, and total time until a usable result. Include ambiguous documents and missing information instead of testing only clean examples.

Preserve the Messages API's typed content blocks and correlation between tool-use and tool-result blocks. Converting every response into a single text string loses information needed for continuation. Do not assume a model identifier or feature flag is identical on every hosting platform. A model's ability to request an action also does not authorize the application to perform it.

## Migration-sensitive model behavior

The [Sonnet 5.5 model guide](https://platform.claude.com/docs/en/models/sonnet-5-5/overview) documents incompatible behavior for applications migrating from Sonnet 5: forced tool choice is rejected, turning off up-front thinking uses `between_tools` (at supported effort), and thinking blocks are tied to the originating model and conversation. Previously visible text between tool calls may instead arrive as thinking content, so a naive text-only streaming UI can appear stalled. Check computer-use tool versions rather than copying an older declaration.

The [Haiku 5.5 guide](https://platform.claude.com/docs/en/models/haiku-5-5/overview) documents adaptive thinking and a newer tokenizer; the same content can count for more tokens than on Haiku 4.5. Non-default `temperature`, `top_p`, or `top_k` settings are rejected by current Sonnet 5.5 and Haiku 5.5. Version prompts, context budgets, tool schemas, and token/cost evaluations with the model ID before switching traffic; do not silently reuse legacy generation parameters.

## Fast-mode migration and text watermark boundaries

[Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) accelerates **output tokens per second**, not necessarily time to first token; it has model-specific availability and premium rates. Fast mode for `claude-opus-4-8` is deprecated and scheduled for **removal November 30, 2026**. Requests using that model with `speed: "fast"` will then fail. Migrate and re-evaluate against Opus 5.5 before the deadline; don't infer that changing a model ID preserves performance, pricing, or supported fields.

Anthropic introduced a [text watermark](https://platform.claude.com/docs/en/build-with-claude/text-watermark) for supported model/platform combinations in November 2026, including Claude Mythos 5, Opus 4.7, and Sonnet 4.6 on the listed deployments. It does not insert hidden characters or extra tokens, and it is not a user-authentication or action-verification mechanism. In Sonnet 4.6, non-default `temperature`, `top_p`, or `top_k` can prevent the watermark; inspect supported models and platforms rather than assuming every Claude answer is watermarked.

## Fable 5.2 and Mythos 5.2 migration boundaries

[Anthropic's November 9, 2026 release notes](https://platform.claude.com/docs/en/release-notes/overview) introduce **Claude Fable 5.2** for demanding long-horizon work and **Claude Mythos 5.2** with access restricted to verified organizations. Both use a 1M-token context window, up to 128k output tokens, and always-on adaptive thinking. Fable 5.2's published price is $8 per million input and $40 per million output tokens; check the current price before production use. The [Fable 5.2 migration guide](https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2) recommends beginning with Opus 5.5 for most tasks and escalating based on application evaluations.

**Four migration failures matter:** (1) Fable 5.2 and Mythos 5.2 strictly bind thinking blocks to the original prompt/tool/message prefix for *all* accounts, returning HTTP 400 after earlier content is edited; (2) only these two models can read their thinking blocks, so other models silently drop those blocks on a switch; (3) declaring legacy `computer_20251124` returns 400 except through Amazon Bedrock—use the supported `computer_toolset_20260801` toolset; and (4) beta advisor delegation requires a Fable 5.2 or Mythos 5.2 advisor when either is executor. The documented `thinking-binding-controls-2026-08-01` / `drop_block` workaround is not a substitute for preserving immutable history; dropped blocks can increase output tokens.

Both models require **30-day data retention** unless Anthropic expressly authorizes an exception; they are not a general zero-data-retention model choice. Preserve model IDs, platform, thinking-block provenance, and retention eligibility when routing or resuming conversations. See [Messages API continuation](../../inference/apis/anthropic-messages-api.md#fable-52-preserved-thinking-and-continuation).
