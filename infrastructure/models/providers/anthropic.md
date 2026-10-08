# Anthropic

[Official model catalog](https://platform.claude.com/docs/en/models/overview) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Messages API](https://platform.claude.com/docs/en/api/messages/create)

Anthropic develops the Claude model family and serves it through the Claude API and supported partner platforms. At the model layer, Claude provides language generation, visual understanding, and tool-use behavior. Claude Code and Claude Managed Agents add separate execution environments around models.

The current catalog recommends **Claude Opus 5.5** (`claude-opus-5-5`) for most workloads, **Claude Fable 5.1** for demanding reasoning and long-horizon agents, **Claude Sonnet 5.5** (`claude-sonnet-5-5`) for a faster intelligence/cost balance, and **Claude Haiku 5.5** (`claude-haiku-5-5`) for high-volume classification, extraction, routing, and subagent tasks. Opus 5.5 was released on September 22, Sonnet 5.5 on September 28, and Haiku 5.5 on October 7, 2026. These are provider recommendations rather than substitute benchmarks. The [Haiku 5.5 migration guide](https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide) documents breaking differences from Haiku 4.5, including adaptive thinking, token accounting, request parameters, and computer use. Model pages remain authoritative for platform-specific IDs, pricing, limits, and availability.

A practical comparison is to run the same document-triage cases through two tiers, holding the system instruction, tool schemas, and expected labels constant. Measure incorrect classifications, unnecessary tool calls, and total time until a usable result. Include ambiguous documents and missing information instead of testing only clean examples.

Preserve the Messages API's typed content blocks and correlation between tool-use and tool-result blocks. Converting every response into a single text string loses information needed for continuation. Do not assume a model identifier or feature flag is identical on every hosting platform. A model's ability to request an action also does not authorize the application to perform it.
