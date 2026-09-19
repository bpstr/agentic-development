# Open-weight models

[Handbook](../../../README.md) · [Chapter](../README.md)

**Open weights** means trained parameters are available to obtain. It does not by itself establish open training data, unrestricted use, or a reproducible training process. The [Open Source Initiative AI definition](https://opensource.org/ai/open-source-ai-definition) describes broader requirements.

An open-weight model can run locally, on rented infrastructure, or behind a managed API. Downloadability does not imply laptop-scale operation.

## Model families

- [Kimi](kimi.md)
- [Qwen](qwen.md)
- [DeepSeek](deepseek.md)

For every artifact, record the exact revision, license, weight format, quantization, runtime, chat template, configured context limit, and tool parser. See [model cards](https://huggingface.co/docs/hub/model-cards) and [quantization](https://huggingface.co/docs/transformers/main/en/quantization/overview).

Serving software such as [vLLM](https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/) can expose familiar HTTP APIs, but compatibility should be validated separately for tools, structured output, streaming, and continuation.
