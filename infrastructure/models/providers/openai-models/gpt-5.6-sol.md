# GPT-5.6 Sol

[Official model specification](https://developers.openai.com/api/docs/models/gpt-5.6-sol) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

GPT-5.6 Sol is the flagship tier of OpenAI's GPT-5.6 family for complex professional work. Its explicit identifier is `gpt-5.6-sol`; the specification also documents `gpt-5.6` as an alias routing to Sol. Prefer the explicit name when comparing this tier with Terra and Luna.

Sol accepts text and image input and produces text output. Image synthesis or speech therefore requires the appropriate separate capability or tool. Its documented reasoning-effort range includes `none`, `low`, `medium`, `high`, `xhigh`, and `max`.

For example, evaluate Sol as the primary model for a document assistant that must combine retrieved evidence, resolve ambiguity, and request structured tool actions. Score factual grounding and correct action selection separately from prose quality. A polished explanation can conceal an incorrectly selected document or assignee.

The official specification includes promotional pricing and a different tariff for sufficiently long prompts. Calculate costs with the actual input length, caching behavior, output usage, and tools rather than one headline token rate. Compare total task cost with a smaller model that may need extra retries. Changing effort or model tier should trigger the same bounded application evaluation used for a prompt change.
