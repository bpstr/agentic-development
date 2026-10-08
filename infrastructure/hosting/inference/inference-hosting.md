# Inference hosting

Inference hosting runs a model and exposes its predictions through an API or another serving interface. The host loads model weights, schedules requests, manages hardware capacity, and returns output. Application orchestration, authorization, and business persistence remain separate responsibilities.

There are several deployment shapes: a shared on-demand endpoint, a dedicated deployment, a provisioned-throughput service, and a self-operated inference server. They trade idle capacity, startup time, scheduling control, privacy boundaries, and operational work.

For agent workloads, test more than a successful text reply. Verify streaming tool arguments, structured output, reasoning controls, multimodal inputs, cancellation, context size, and usage accounting for the exact model and endpoint. A familiar API shape does not establish feature parity.

A useful load test includes realistic prompt sizes, concurrent conversations, repeated tool turns, and failures. Track time to first useful output separately from full completion, and record both the requested model and resolved serving provider.

A model card on a repository does not establish that a host serves that model. [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index) and [dedicated Inference Endpoints](https://huggingface.co/docs/inference-endpoints/index) illustrate two different hosting contracts. Check available models, current pricing, region, retention, and capacity before selecting either.

## Publishers, gateways, and serving platforms

Model authorship, API routing, and operating inference capacity are separate roles. A provider catalog may contain third-party models; an open-source SDK does not establish that the service behind it is open-source or self-hostable.

| Surface | What it supplies | What not to infer |
| --- | --- | --- |
| [Hugging Face](hugging-face-inference.md) | Model artifacts on the Hub, routing through Inference Providers, and separate dedicated Inference Endpoints | Finding a model card does not mean a compatible endpoint is available. |
| [OpenRouter](openrouter-inference.md) | Hosted access and routing across models/providers | It is not a desktop IDE. A common request format does not imply every route supports every modality or tool feature. |
| [LiteLLM](https://docs.litellm.ai/docs/) | Open-source model-API adaptation and a self-hosted gateway/proxy | Running the gateway is not running the model weights. |
| [Replicate](https://replicate.com/docs) | Managed inference for published and custom models, with prediction jobs and deployments | Model licenses, deployment behavior, and retention must be checked per integration. It is not the Replit coding workspace. |

Hugging Face's [provider matrix](https://huggingface.co/docs/inference-providers/index) includes Replicate as a partner: these services can be layers in one request path, not just mutually exclusive alternatives. [OpenRouter multimodal requests](https://openrouter.ai/docs/guides/overview/multimodal/overview) can carry supported image, audio, or video inputs. File/video acceptance alone does not establish a full-duplex live-camera session.

## Replicate prediction and artifact lifecycle

[Replicate's prediction lifecycle](https://replicate.com/docs/topics/predictions/lifecycle) separates request submission from inference completion. Persist the returned prediction identity, inspect status through polling or an authorized webhook handler, and process output only when the operation reaches the appropriate outcome. States include `starting`, `processing`, `succeeded`, `failed`, `canceled`, and `aborted`; the last can indicate a deadline reached before execution began. A returned job ID is not a generated artifact.

The [data-retention policy](https://replicate.com/docs/topics/predictions/data-retention) currently removes API prediction inputs, outputs, files, and logs after one hour by default; web-created predictions have different retention. Copy required artifacts and evidence to application-owned storage before expiry rather than persisting only temporary output URLs. Apply access control and retention policy to those copies.

For custom models, [Cog](https://github.com/replicate/cog) is the open-source packaging and serving tool: define the environment and input/output interface, build a container, then deploy on suitable infrastructure or Replicate. Cog's availability does not make the entire managed Replicate service open-source. Keep the model checkpoint's license and required hardware separate from the container tool's license.
