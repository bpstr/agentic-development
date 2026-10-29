# Anthropic

[Official model catalog](https://platform.claude.com/docs/en/models/overview) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Messages API](https://platform.claude.com/docs/en/api/messages/create)

Anthropic develops the Claude model family and serves it through the Claude API and supported partner platforms. At the model layer, Claude provides language generation, visual understanding, and tool-use behavior. Claude Code and Claude Managed Agents add separate execution environments around models.

The current catalog recommends **Claude Opus 5.5** (`claude-opus-5-5`) as the starting point for most workloads, with **Fable 5.1** (`claude-fable-5-1`) for demanding reasoning and long-horizon agentic work, **Sonnet 5.5** (`claude-sonnet-5-5`, released September 28, 2026) for a faster balance of speed and intelligence, and **Haiku 5.5** (`claude-haiku-5-5`, released October 7, 2026) for high-volume, latency-sensitive classification, extraction, and routing. Opus 5.5 was released on September 22, 2026 and replaced Opus 5 as the current Opus recommendation. These are provider positioning statements; they do not replace application measurements. Model pages specify thinking behavior, input and output limits, supported platforms, and exact identifiers.

A practical comparison is to run the same document-triage cases through two tiers, holding the system instruction, tool schemas, and expected labels constant. Measure incorrect classifications, unnecessary tool calls, and total time until a usable result. Include ambiguous documents and missing information instead of testing only clean examples.

Preserve the Messages API's typed content blocks and correlation between tool-use and tool-result blocks. Converting every response into a single text string loses information needed for continuation. Do not assume a model identifier or feature flag is identical on every hosting platform. A model's ability to request an action also does not authorize the application to perform it.

## Migration-sensitive model behavior

The [Sonnet 5.5 model guide](https://platform.claude.com/docs/en/models/sonnet-5-5/overview) documents incompatible behavior for applications migrating from Sonnet 5: forced tool choice is rejected, turning off up-front thinking uses `between_tools` (at supported effort), and thinking blocks are tied to the originating model and conversation. Previously visible text between tool calls may instead arrive as thinking content, so a naive text-only streaming UI can appear stalled. Check computer-use tool versions rather than copying an older declaration.

The [Haiku 5.5 guide](https://platform.claude.com/docs/en/models/haiku-5-5/overview) documents adaptive thinking and a newer tokenizer; the same content can count for more tokens than on Haiku 4.5. Non-default `temperature`, `top_p`, or `top_k` settings are rejected by current Sonnet 5.5 and Haiku 5.5. Version prompts, context budgets, tool schemas, and token/cost evaluations with the model ID before switching traffic; do not silently reuse legacy generation parameters.
