# Inference hosting

Inference hosting runs a model and exposes its predictions through an API or another serving interface. The host loads model weights, schedules requests, manages hardware capacity, and returns output. Application orchestration, authorization, and business persistence remain separate responsibilities.

There are several deployment shapes: a shared on-demand endpoint, a dedicated deployment, a provisioned-throughput service, and a self-operated inference server. They trade idle capacity, startup time, scheduling control, privacy boundaries, and operational work.

For agent workloads, test more than a successful text reply. Verify streaming tool arguments, structured output, reasoning controls, multimodal inputs, cancellation, context size, and usage accounting for the exact model and endpoint. A familiar API shape does not establish feature parity.

A useful load test includes realistic prompt sizes, concurrent conversations, repeated tool turns, and failures. Track time to first useful output separately from full completion, and record both the requested model and resolved serving provider.

A model card on a repository does not establish that a host serves that model. [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index) and [dedicated Inference Endpoints](https://huggingface.co/docs/inference-endpoints/index) illustrate two different hosting contracts. Check available models, current pricing, region, retention, and capacity before selecting either.
