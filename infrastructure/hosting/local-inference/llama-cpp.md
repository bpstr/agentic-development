# llama.cpp

Official source: [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp). Documentation: [HTTP server](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md), [Build guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md).

llama.cpp is a C/C++ inference engine supporting multiple hardware backends and quantized model execution. Its server exposes APIs and a web interface; its command-line tools also support direct local use. It is useful when hardware portability and control over local model files matter.

Install a release binary or build for the intended backend. The current repository quickstart uses a unified `llama` command. This small model is its documented serving example, not a quality recommendation:

```bash
llama serve -hf ggml-org/Qwen3.5-0.8B-GGUF
```

The command retrieves the model from Hugging Face and starts serving it. Inspect `llama serve --help` for network binding, context, offload, and concurrency options. Existing installations may expose the `llama-server` executable directly; use the CLI documented by the installed release.

The HTTP server documents compatible chat, Responses, embeddings, and other supported routes. Check the exact model's chat template and function-calling configuration before using it as an agent backend. A JSON response schema constrains output syntax; it does not validate business facts.

Choose quantization and CPU/GPU offload using measured quality, memory, and latency. Reserve capacity for the context cache, and benchmark under realistic concurrency. Keep a local server private or add authentication before sharing it. Record model source, license, quantization, and runtime version so results can be reproduced.
