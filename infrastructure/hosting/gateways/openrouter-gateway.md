# OpenRouter as an AI gateway

Official documentation: [Provider routing](https://openrouter.ai/docs/guides/routing/provider-selection), [Quickstart](https://openrouter.ai/docs/quickstart).

OpenRouter routes model requests across eligible serving providers and exposes a shared API. Its gateway role covers provider selection, fallbacks, and a unified access path. The application still defines its agent loop and executes application-owned tools.

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

For a production setup, create the API credential, choose a model and eligible providers, send a representative tool/structured-output request, and inspect resolved-provider metadata. Verify fallback behavior deliberately rather than only testing a successful first route.

Restrict data destinations according to the application's requirements. A common endpoint does not make provider retention or regions uniform. Configure routing and logging together so the actual data path is auditable.

Coordinate request retries with application limits, and preserve failed-attempt timing. If a prior tool may have changed business state, recover its operation receipt before repeating the action. Gateway availability and correct business effects are different concerns.
