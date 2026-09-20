# Llama open-weight models

[Canonical Llama model repository](https://github.com/meta-llama/llama-models) · [Llama 4 license](https://github.com/meta-llama/llama-models/blob/main/models/llama4/LICENSE)

Llama is Meta's model family with downloadable artifacts and reference inference tooling. Releases differ substantially in architecture, modality support, size, context behavior, and license conditions. Text-only and vision variants should be evaluated as separate deployment targets.

The official `llama-models` package provides discovery and inspection commands:

```bash
python -m pip install llama-models
llama-model list
llama-model list --show-all
```

After choosing an exact identifier, use the CLI's `describe`, `prompt-format`, and download commands as documented in the repository. Inspecting the prompt format matters because the model's expected role delimiters and tool conventions are part of inference behavior. These are documentation commands, not a recorded installation or inference test.

For example, a team selecting a local document assistant should first verify whether the intended Llama variant accepts images, then test extraction and refusal behavior using the actual runtime and quantization. A text-only deployment cannot acquire vision support by receiving an image URL as ordinary text.

Meta's release-specific community licenses and acceptable-use policies require separate review from the inference code. Hardware requirements also vary sharply: the reference repository describes multi-GPU full-precision inference for Llama 4. A small parameter count for active experts does not establish laptop feasibility, and a long advertised context requires memory and retrieval-quality testing under the chosen configuration.
