# OpenRouter as an AI gateway

Official documentation: [Provider routing](https://openrouter.ai/docs/guides/routing/provider-selection), [Model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks), [Quickstart](https://openrouter.ai/docs/quickstart), [Data policies](https://openrouter.ai/docs/guides/privacy/provider-logging).

OpenRouter routes model requests across eligible serving providers and exposes a shared API. Its gateway role covers provider selection, fallbacks, and a unified access path. The application still defines its agent loop and executes application-owned tools.

This capability belongs under inference hosting and gateways. OpenRouter access can be used by supported coding agents, but the gateway does not become their desktop client, repository checkout, shell, or permission system. Its hosted service is also distinct from the licenses of open-source clients that connect to it.

## Select the model and the serving provider

Model selection chooses what model to request; provider routing chooses an eligible backend serving it. A provider fallback can preserve the requested model, while a [model fallback](https://openrouter.ai/docs/guides/routing/model-fallbacks) changes the model and can change behavior. Record both choices when comparing agents or investigating a failed run.

A routing policy should specify which request features must survive translation. This fragment belongs inside an OpenRouter chat-completion request:

```json
{
  "provider": {
    "require_parameters": true,
    "allow_fallbacks": false
  }
}
```

It is not a complete request: also supply the selected model and messages. `require_parameters` excludes providers that cannot support requested parameters. `allow_fallbacks` controls fallback behavior; explicit provider ordering or allowlists are separate policy settings.

| Routing control | Decision it expresses |
| --- | --- |
| `provider.order` | Prefer specific serving providers in order. |
| `provider.allow_fallbacks` | Permit or prevent routing to additional eligible providers. |
| `provider.require_parameters` | Exclude providers that do not support required request parameters. |
| `provider.data_collection` | Restrict providers according to their declared data-collection policy. |
| `provider.zdr` | Enforce the configured zero-retention routing policy; account/guardrail choices can also permit Safety Retention endpoints. |

Confirm the selected model and route support the agent's tool calls, output format, context requirements, and streaming behavior. A familiar API shape does not guarantee complete behavioral compatibility.

For a production setup, create the API credential, choose a model and eligible providers, send a representative tool/structured-output request, and inspect resolved-provider metadata. Verify fallback behavior deliberately rather than only testing a successful first route.

## Connect coding agents

Use a client's documented OpenRouter provider setup. Examples covered here include [OpenCode](../../../development/coding-agents/tools/opencode.md), [Cline](../../../development/coding-agents/tools/cline.md), [goose](../../../development/coding-agents/tools/goose.md), [Zed](../../../development/coding-agents/tools/zed-agent.md), and [Junie](../../../development/coding-agents/tools/junie.md). Their implementation pages link to official configuration references. The minimal API path is documented in [accessing inference through OpenRouter](../inference/openrouter-inference.md).

The agent continues to execute file and shell tools and enforce approvals. Its subscription does not automatically pay for OpenRouter inference, and a gateway key does not grant access to a vendor's proprietary agent product.

## Data handling and failure recovery

Restrict data destinations according to the application's requirements. A common endpoint does not make provider retention or regions uniform. No-training and zero-retention policies are different. The current [ZDR documentation](https://openrouter.ai/docs/guides/features/zdr) explains Safety Retention eligibility and policy exceptions; setting `zdr: true` alone is not a blanket promise that nothing is ever retained. Enabled server tools and plugins have additional data paths. Configure routing and logging together so the actual path is auditable.

Coordinate request retries with application limits, and preserve failed-attempt timing. If a prior tool may have changed business state, recover its operation receipt before repeating the action. Gateway availability and correct business effects are different concerns.
