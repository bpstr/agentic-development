# GPT-5.6 Terra

[Official model specification](https://developers.openai.com/api/docs/models/gpt-5.6-terra) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

GPT-5.6 Terra is OpenAI's GPT-5.6 tier balancing capability and cost. Its API identifier is `gpt-5.6-terra`. The specification describes its relationship to the smaller model tier in earlier GPT families and lists its supported inputs, tools, and reasoning controls.

Terra is a useful candidate to evaluate for bounded application work: extracting actions from a conversation, choosing among well-described tools, or answering questions from a compact set of retrieved documents. Those are workload hypotheses, not guarantees about relative accuracy or latency.

A practical selection exercise compares Terra with a stronger baseline on the same ambiguous inputs and tool failures. Count correct outcomes, unnecessary calls, failed schemas, and escalations. A lower token price helps only if the resulting system retains acceptable completion quality.

The documented effort choices range from `none` through `max`. Avoid treating increased reasoning effort as a substitute for supplying missing evidence or precise tool schemas. If an application routes difficult cases elsewhere, make the escalation condition observable, such as failed validation or contradictory source records. The model's own confidence estimate should not be the sole condition without evidence that it is calibrated.
