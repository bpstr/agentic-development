# Open weights and local model choices

[Handbook](../../README.md) · [Chapter](README.md)

**Sources reviewed:** 2026-09-19 · **Evidence:** publisher model cards and repositories; no local inference tests.

## Separate availability, licensing, and deployment

**Open weights** means trained parameters are available to obtain. It does not by itself establish access to training data, unrestricted use, or a complete reproducible training process. The [Open Source Initiative's AI definition](https://opensource.org/ai/open-source-ai-definition) describes additional requirements for code, data information, parameters, and permissions. Use the narrower term when only weight availability is established.

An open-weight model can run on your hardware, on rented infrastructure, or behind a managed API. These choices have different operational costs. Downloadability says little about whether it fits on a laptop.

## Representative examples

This is a small set of documented examples, not a ranking or claim that these are each publisher's newest models.

| Example | What it helps explain | Official evidence |
| --- | --- | --- |
| Kimi K2.5, Moonshot AI | Multimodal input, thinking and instant modes, tool use, and a large mixture-of-experts model | [Model card, evaluations, and deployment guide](https://huggingface.co/moonshotai/Kimi-K2.5) |
| Qwen3, Alibaba's Qwen team | A family with different sizes and serving options; tool-use configuration matters | [Publisher repository](https://github.com/QwenLM/Qwen3) |
| DeepSeek-R1 and distilled variants | Reasoning models and the distinction between a full model and smaller derivatives | [Publisher repository and report](https://github.com/deepseek-ai/DeepSeek-R1) |

Kimi K2.5's card documents a **Modified MIT** license, not plain MIT. It also distinguishes the official API's options from third-party serving behavior. Read the linked license and deployment notes for the exact artifact you intend to use. The model card is useful because it includes benchmark settings as well as scores.

The Qwen3 repository describes its released open-weight models as Apache 2.0 and points to individual model licenses. DeepSeek-R1 documents MIT terms for its repository and weights while separately identifying the original Qwen and Llama bases of distilled variants. Do not assume the label attached to one release resolves every derivative's conditions. These are documentation pointers, not a legal interpretation.

## What determines local feasibility?

Parameter count is only one input. You need memory for weights, runtime overhead, and the cache used during generation; supported context length and concurrent requests affect the running workload. Mixture-of-experts models activate a subset of parameters per token, but their total stored weights still matter.

**Quantization** reduces numerical precision to lower memory requirements. It can change accuracy and performance, so evaluate the actual quantized artifact you will deploy. Hardware and runtime support vary by method. Hugging Face provides a [quantization overview](https://huggingface.co/docs/transformers/main/en/quantization/overview).

An illustrative deployment record is more useful than “we use Qwen”:

```yaml
publisher_model: Qwen/Qwen3-8B
revision: exact_commit_to_record
weight_format: record_actual_format
quantization: record_actual_method
runtime: record_engine_and_version
chat_template: record_template_revision
context_limit: record_configured_limit
tool_parser: record_parser_or_none
```

These are application records, not arguments to a serving command. A chat template formats conversation roles for a model; a tool parser turns generated tool syntax into structured calls. A mismatch can damage behavior even when ordinary text generation appears to work.

## From weights to an endpoint

Serving software loads a supported model and exposes inference. For example, [vLLM's compatible server](https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/) implements familiar HTTP APIs. Compatibility is scoped to documented endpoints and features; validate tools, structured output, streaming, and continuation separately.

For any artifact, inspect its [model card](https://huggingface.co/docs/hub/model-cards): intended use, limitations, training information, evaluation settings, and license. Then compare the deployed artifact against a hosted baseline using [the same acceptance cases](selection-and-benchmarks.md). Include infrastructure utilization and maintenance in the cost comparison, alongside tokens per second.
