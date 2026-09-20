# GPT-6 Astra

[Official model specification](https://developers.openai.com/api/docs/models/gpt-6-astra) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

GPT-6 Astra is OpenAI's general-purpose model for demanding reasoning, coding, research, computer use, and document work. The API identifier is `gpt-6-astra`. Its model specification documents the supported endpoints, modalities, tools, context capacity, and reasoning settings.

A suitable evaluation workload is a repository migration that requires connecting changes across several modules. Check whether the model identifies dependencies, proposes a valid order of operations, and detects incompatible assumptions. Supply actual repository evidence through the application's tools; model capability does not grant access to that evidence automatically.

The documented reasoning-effort choices include `low`, `medium`, `high`, `xhigh`, and `max`. Increase effort only when the added task success justifies the latency and cost. These settings describe the API model contract; a product interface may expose a different set of labels.

Benchmark evidence is useful when its harness resembles the intended task. Evaluate Astra within the same permissions, tool budget, and success criteria used for smaller candidates. A capable model may still perform unnecessary work when the instruction is underspecified. Its final answer and any displayed reasoning summary do not replace tool receipts or verification of the resulting artifact.
