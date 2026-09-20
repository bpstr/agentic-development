# vLLM

Official documentation: [Quickstart](https://docs.vllm.ai/en/latest/getting_started/quickstart/). Source: [vllm-project/vllm](https://github.com/vllm-project/vllm).

vLLM is an inference and serving engine designed for efficient model execution and concurrent requests. Its serving APIs expose supported models to applications while the operator owns the model hardware, server configuration, and capacity planning.

Follow the installation instructions for the actual accelerator and operating system. For the documented Python/accelerator setup, the quickstart uses `uv` with automatic PyTorch backend selection:

```bash
uv venv --python 3.12
source .venv/bin/activate
uv pip install vllm --torch-backend=auto
```

Set `MODEL_ID` to a supported model repository, then start a loopback-only development server:

```bash
vllm serve "$MODEL_ID" --host 127.0.0.1 --port 8000
```

From another terminal, `curl http://127.0.0.1:8000/v1/models` inspects the served catalog. Point a compatible chat client at `http://127.0.0.1:8000/v1` and use the served model identifier.

Validate the model architecture, chat template, tool parser, structured-output features, and multimodal path before treating compatibility as complete. The quickstart notes that a model repository's `generation_config.json` can affect default sampling behavior; make production settings intentional.

Size capacity for weights, key/value cache, context lengths, and concurrency. A high token-throughput benchmark does not directly establish interactive latency under saturation. Put authentication and access policy around shared deployments, record queue and generation timing, and pin reproducible model and server versions. vLLM supplies inference, not application tool execution or durable agent orchestration.
