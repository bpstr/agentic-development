# GPT-5.6 Luna

[Official model specification](https://developers.openai.com/api/docs/models/gpt-5.6-luna) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

GPT-5.6 Luna is OpenAI's tier for cost-sensitive, high-volume workloads. Its API identifier is `gpt-5.6-luna`. The model specification relates this tier to earlier nano models and documents supported capabilities and reasoning settings.

A suitable evaluation target is a constrained classifier with a small label set and clear examples. Another is extracting a few fields from short, well-structured text. Keep such tasks narrow enough that success can be validated directly; economical inference does not remove the need for correct domain behavior.

For example, let Luna propose a task category and a referenced project identifier. Validate the identifier against the authorized project set before using it. Route missing or conflicting evidence to an explicit clarification or stronger configuration rather than accepting a plausible invented value.

The API supports effort choices from `none` through `max`; the cheapest model tier does not imply that every configuration has the same response time. Compare complete request latency and retry frequency under the intended workload. A larger context allowance also does not make sending all available history efficient. Compact relevant context and well-defined tool contracts can matter more than expanding the prompt.
