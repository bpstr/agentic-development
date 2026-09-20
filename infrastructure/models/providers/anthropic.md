# Anthropic

[Official model catalog](https://platform.claude.com/docs/en/models/overview) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Messages API](https://platform.claude.com/docs/en/api/messages/create)

Anthropic develops the Claude model family and serves it through the Claude API and supported partner platforms. At the model layer, Claude provides language generation, visual understanding, and tool-use behavior. Claude Code and Claude Managed Agents add separate execution environments around models.

The current catalog distinguishes Fable 5.1 for demanding reasoning, Opus 5 for complex work, Sonnet 5 for a faster capability tier, and Haiku 4.5 for lightweight work. These are provider positioning statements; they do not replace application measurements. Model pages specify thinking behavior, input and output limits, supported platforms, and exact identifiers.

A practical comparison is to run the same document-triage cases through two tiers, holding the system instruction, tool schemas, and expected labels constant. Measure incorrect classifications, unnecessary tool calls, and total time until a usable result. Include ambiguous documents and missing information instead of testing only clean examples.

Preserve the Messages API's typed content blocks and correlation between tool-use and tool-result blocks. Converting every response into a single text string loses information needed for continuation. Do not assume a model identifier or feature flag is identical on every hosting platform. A model's ability to request an action also does not authorize the application to perform it.
