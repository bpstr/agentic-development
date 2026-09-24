# GPT-5.6 Terra

[Official model specification](https://developers.openai.com/api/docs/models/gpt-5.6-terra) · [Current model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing)

GPT-5.6 Terra was OpenAI's GPT-5.6 tier balancing capability and cost. Its API identifier is `gpt-5.6-terra`. The GPT-6 catalog released in September 2026 currently exposes Astra, Sol, and Luna rather than a Terra-named tier, so treat this page as documentation of the preceding family rather than evidence that Terra is a current GPT-6 option.

Terra remains a useful example of evaluating a middle model tier for bounded application work: extracting actions from a conversation, choosing among well-described tools, or answering questions from a compact set of retrieved documents. Those are workload hypotheses, not guarantees about relative accuracy or latency.

A practical selection exercise compares the configured model with a stronger baseline on the same ambiguous inputs and tool failures. Count correct outcomes, unnecessary calls, failed schemas, and escalations. A lower token price helps only if the resulting system retains acceptable completion quality.

Do not transfer GPT-5.6 Terra's reasoning controls, context limits, tool support, or pricing to a newer family by analogy. Select a current model from the catalog and evaluate it with the same permissions, evidence, and acceptance criteria.
