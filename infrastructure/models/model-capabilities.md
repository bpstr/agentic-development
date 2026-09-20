# Model capabilities

A capability is a behavior a particular model and serving interface can support. Useful capability categories include language generation, image understanding, audio understanding, code generation, tool selection, structured output, embedding generation, and media synthesis. A product label such as “multimodal” is too broad to establish compatibility.

Describe capabilities as contracts with testable conditions:

- **Inputs:** accepted modalities, file formats, context limits, and preprocessing.
- **Outputs:** text, typed objects, tool calls, audio, images, or video.
- **Controls:** reasoning budget, sampling, constrained decoding, and output limits.
- **Interaction:** streaming, continuation, parallel tool calls, and interruption.

For example, a document assistant might require image input for scanned pages, typed extraction for invoice fields, and tool calls for a database lookup. A model supporting image input and prose output does not necessarily support all three through the chosen endpoint. [Model cards](https://huggingface.co/docs/hub/model-cards) document intended uses, limitations, and evaluation evidence; verify the serving contract separately.

Separate advertised support from measured reliability. “Supports tools” can mean that a model emits a valid function object once, while an application needs it to choose the right function, fill arguments correctly, decline unauthorized actions, and recover after errors.

Maintain a small acceptance case for each required capability. For an extraction task, include a readable page, a rotated page, missing fields, and contradictory values. A larger context window raises an input ceiling; it does not establish accurate retrieval or reasoning over every token in that window.
