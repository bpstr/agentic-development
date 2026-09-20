# Open-weight models

**Open weights** means a model's trained parameters are available to obtain. It does not by itself establish open training data, a reproducible training process, or unrestricted use. The [Open Source Initiative AI definition](https://opensource.org/ai/open-source-ai-definition) describes broader requirements than downloadability alone. The directory name `open-source` is a navigation category; inspect each artifact's actual terms.

An open-weight deployment combines weights, architecture, tokenizer or processor, prompt template, generation settings, and serving software. Fine-tuned, distilled, and quantized derivatives should be identified as distinct artifacts. A community conversion can alter precision or formatting without changing the family name displayed to users.

For example, a team can serve a small instruction-tuned model for internal task labeling while keeping a hosted model for difficult analysis. The local model still needs authorized input data, output validation, monitoring, and a process for updates. Running locally changes control over deployment; it does not automatically improve correctness.

Before adoption, record the publisher, revision, file checksums, license, weight format, quantization, runtime, configured context limit, and chat template. [Model cards](https://huggingface.co/docs/hub/model-cards) provide a place to examine intended uses and limitations.

Download size is not a reliable memory budget. Loading weights, maintaining the attention cache, and serving concurrent requests can require substantially more memory. Evaluate the exact configuration on [local hardware](local-models.md), and keep [licensing](model-licensing.md) attached to the specific artifact rather than the entire model family.
