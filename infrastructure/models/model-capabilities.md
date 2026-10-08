# Model capabilities

A capability is a behavior a particular model and serving interface can support. Useful capability categories include language generation, image understanding, audio understanding, code generation, tool selection, structured output, typed decision inference, embedding generation, and media synthesis. A product label such as “multimodal” is too broad to establish compatibility.

Describe capabilities as contracts with testable conditions:

- **Inputs:** accepted modalities, file formats, context limits, and preprocessing.
- **Outputs:** text, typed objects, tool calls, audio, images, or video.
- **Controls:** reasoning budget, sampling, constrained decoding, and output limits.
- **Interaction:** streaming, continuation, parallel tool calls, and interruption.

For example, a document assistant might require image input for scanned pages, typed extraction for invoice fields, and tool calls for a database lookup. A model supporting image input and prose output does not necessarily support all three through the chosen endpoint. [Model cards](https://huggingface.co/docs/hub/model-cards) document intended uses, limitations, and evaluation evidence; verify the serving contract separately.

Separate advertised support from measured reliability. “Supports tools” can mean that a model emits a valid function object once, while an application needs it to choose the right function, fill arguments correctly, decline unauthorized actions, and recover after errors.

Maintain a small acceptance case for each required capability. For an extraction task, include a readable page, a rotated page, missing fields, and contradictory values. A larger context window raises an input ceiling; it does not establish accurate retrieval or reasoning over every token in that window.

## Typed decision inference

Some inference interfaces evaluate evidence against questions whose answer space is fixed by the application: a truth probability, a category, or an ordered rating. This is useful when software needs a small judgment, not a paragraph. A decision model can select a route, rank retrieved candidates, or flag a record for review; it does not perform the selected operation.

Keep neighboring capabilities distinct:

| Capability | Contract |
| --- | --- |
| Embedding generation | Produce a vector for indexing, similarity, or downstream prediction. |
| Typed decision inference | Evaluate a supplied condition or finite set of choices and expose the resulting values or distributions. |
| Schema-constrained generation | Generate content conforming to an application schema, including extracted fields or explanations. |
| Agent execution | Combine inference with tools, permissions, state transitions, and outcome verification. |

[TypeSafe Jev](https://docs.typesafe.ai/introduction) is a concrete decision model: its System One API evaluates a shared `state` against named `questions`. `noul` returns a truth probability; `choice` and `score` return values and distributions. It is not an embedding generator or a drop-in coding-agent LLM. The [model catalog](https://docs.typesafe.ai/models) currently documents text-only input, including textual JSON state, not image, audio, or video ingestion. The [HTTP reference](https://docs.typesafe.ai/api) and [quick start](https://docs.typesafe.ai/introduction/quickstart) define the executable contract.

[OpenAI Decisions](../inference/apis/openai-responses-api.md#decisions-api-for-bounded-judgments) exposes a separate text/image decision endpoint with similar uses, but different request and response schemas. Similar outputs do not establish identical architectures, calibration, or API compatibility. [Kev](https://github.com/jaredpalmer/kev) is an independent family of trainable, self-hostable Jev-like decision models; its released weights are not Jev's weights. An open client SDK alone does not make a hosted model open-weight.

Ask narrow questions and combine their answers in code. A probability distribution is not a guarantee of correctness; a reported confidence statistic need not equal the probability that the chosen answer is correct. Measure calibration and error costs on held-out application examples before setting per-route thresholds. TypeSafe's [confidence reference](https://docs.typesafe.ai/confidence) explains its probability-derived statistic; do not transfer its thresholds to another provider without validation. See the [router pattern](../../patterns/router-pattern.md#confidence-gated-decision-routing) for execution boundaries.
