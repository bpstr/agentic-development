# Inference providers and gateways

Source-reviewed: 2026-09-19. The comparisons describe documented product surfaces; no provider integration was executed for this chapter.

An **inference service** runs a model and returns its output. A **gateway** sits between an application and one or more inference services, often translating requests or applying routing policy. A service can offer additional products; identify the endpoint you are using rather than assigning one capability to an entire company.

## Representative surfaces

| Surface | Role | What you still need to decide |
| --- | --- | --- |
| Direct OpenAI, Anthropic, Google, or xAI model API | Provider-specific model access and available hosted tools | Model/endpoint compatibility, application policy, run state, tool ownership |
| OpenRouter model API | A common access and routing layer across model providers | Eligible providers, fallback policy, feature support, data handling |
| Hugging Face Inference Providers | Access to partner inference services through Hugging Face interfaces | Model/provider combination, task support, credentials and billing route |
| Hugging Face Inference Endpoints | Dedicated deployment of a model using managed inference infrastructure | Model image, hardware, scaling, endpoint access, workload economics |
| LiteLLM gateway | A gateway you deploy to centralize access and routing | Operating the gateway, credentials, budgets, routing rules, compatibility tests |

OpenRouter documents its API alongside client and agent SDKs; calling its model endpoint alone does not establish that a remote service owns your complete application workflow. Read [OpenRouter's integration options](https://openrouter.ai/docs/quickstart) for the particular surface you intend to use.

Hugging Face separates [Inference Providers](https://huggingface.co/docs/inference-providers/index) from [dedicated Inference Endpoints](https://huggingface.co/docs/inference-endpoints/index). The Hub is a model and dataset repository; [Spaces](https://huggingface.co/docs/hub/spaces-overview) hosts applications and demos. A model card on the Hub is not proof that the model is available on a particular hosted inference endpoint.

[LiteLLM](https://docs.litellm.ai/docs/) supplies a Python integration layer and a deployable gateway, with documented routing, virtual keys, and usage tracking. Its gateway is an operational component you own when self-hosting it. Proxying an API does not remove the upstream provider's limits.

## Compatibility is a contract to test

“OpenAI-compatible” commonly means support for some familiar request/response shapes. It does not guarantee identical models, tools, reasoning parameters, multimodal support, streamed events, cache accounting, or error behavior.

For example, your application might require streamed tool arguments, structured output, and image input. A fallback that only passes a text completion test may fail that application. Maintain a small contract test for each required capability, and preserve the selected model and actual serving provider in your trace.

An application-level routing policy might look like this; it is illustrative JSON, not an OpenRouter or LiteLLM configuration file:

```json
{
  "workload": "task-triage",
  "required_capabilities": ["tool_calls", "structured_output"],
  "allowed_deployments": ["primary-tested", "fallback-tested"],
  "max_attempts": 2,
  "record_resolved_provider": true
}
```

Evaluate fallbacks against latency and cost as well as correctness. If the first request ran for twenty seconds before failing, a fast fallback does not erase those twenty seconds. If an earlier tool may already have changed application state, recover using its action receipt before repeating it.

## Read next

Use the [model chapter](../02-models-and-providers/README.md) for current model descriptions and official pricing links. Use [managed runtimes](managed-agents.md) when you want a service to own more than inference. Use [tracing](../09-evaluation-and-operations/tracing.md) to see which layer actually consumes time.
