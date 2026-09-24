# Qwen open-weight models

[Canonical Qwen3.8 repository](https://github.com/QwenLM/Qwen3.8) · [Official Qwen documentation](https://qwen.readthedocs.io/) · [Publisher model collection](https://huggingface.co/collections/Qwen/qwen38)

Qwen is Alibaba's model family with downloadable releases for different sizes and capabilities. **Qwen3.8** is the current documented open-model series, following Qwen3.5 and Qwen3.6. The publisher positions it for coding, professional work, research, and long-horizon agentic tasks, with explicit `reasoning_effort` control and optional preservation of reasoning context between turns. These are model capabilities and publisher claims, not measurements performed by this repository.

The exact artifact matters. The August 2026 Qwen3.8 releases include a large mixture-of-experts model and a smaller dense model; downstream runtimes do not necessarily support every checkpoint, modality, reasoning control, or tool parser on the same schedule. Pin the model revision, tokenizer or processor, serving runtime, and chat/tool template together.

The canonical repository currently demonstrates an OpenAI-compatible local server through Transformers:

```bash
transformers serve Qwen/Qwen3.8-27B --port 8000 --continuous-batching
```

Running this example downloads substantial model artifacts and requires a compatible current Transformers release and suitable hardware. It is documentation-grounded, not a claim of local validation. Other supported runtimes such as SGLang, vLLM, llama.cpp, MLX, and third-party quantizations have their own compatibility boundaries; verify support for the exact model revision before deployment.

Tool-call behavior depends on more than the weights. A runtime may require a model-specific reasoning parser, tool-call parser, or chat template. A model generating fluent JSON has not yet demonstrated a correct agent loop: validate schema selection, arguments, continuation after tool results, and failure recovery through the actual serving configuration.

Do not generalize the license of an older Qwen generation to a newer checkpoint or derivative. Read the license distributed with the exact model weights, and evaluate quantized or repackaged artifacts as separate distributions with their own provenance and terms.
