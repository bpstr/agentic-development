# Local inference

Local inference executes a model on hardware controlled by the application owner or user. It can run on a laptop, workstation, or private server. A local SDK or proxy is insufficient evidence: follow the request to the machine that actually executes the model.

Capacity planning includes model weights, runtime overhead, key/value cache, batch size, and concurrent contexts. Quantization reduces weight memory but can affect quality, and a model that fits in memory may still miss the latency target. Measure prefill, generation speed, queueing, and complete tool-assisted tasks.

The serving engine must support the model architecture, tokenizer, chat template, and requested capabilities. Tool calling often requires both a trained model and a compatible parser. Structured output support belongs to a specific serving configuration, not merely the model's name.

Keep inference endpoints private by default and authenticate shared access. Track model provenance and licensing. If extensions, remote tools, embeddings, or cloud fallbacks send data elsewhere, describe those paths separately from local generation.

[Ollama](https://docs.ollama.com/api/introduction), [vLLM](https://github.com/vllm-project/vllm), and [llama.cpp](https://github.com/ggml-org/llama.cpp) represent different serving priorities. Select by hardware support, workload, concurrency, and operational requirements rather than assuming one local runner fits every model.
