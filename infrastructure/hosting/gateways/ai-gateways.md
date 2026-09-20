# AI gateways

An AI gateway mediates requests between applications and model-serving endpoints. It can centralize credentials, routing, budgets, logging, caching, and request-format translation. A gateway can be self-hosted or provided as a managed service.

Routing policy should express required capabilities and allowed deployments. A fallback must satisfy tool-calling, structured-output, modality, and data-handling requirements; a model that accepts plain text is not automatically a compatible replacement.

Preserve the selected model, actual provider, attempts, and usage in traces. A failed first attempt still contributes latency and may incur cost. Coordinate gateway retries with application retries so that two independent retry loops do not multiply traffic.

A gateway generally sees prompts and responses. Treat its credentials and logs as sensitive application infrastructure. Define log retention, redaction, tenant isolation, and which destinations may receive data.

Inference retry is distinct from business-operation retry. If a model-driven tool might already have changed application state, reconcile its receipt before repeating that action. Gateway failover cannot supply exactly-once semantics for external tools.

[LiteLLM](https://docs.litellm.ai/docs/proxy/quick_start), [OpenRouter](https://openrouter.ai/docs/quickstart), and [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) illustrate gateway implementations with different operational ownership. Compare the specific routing and observability contract, not only the shared endpoint format.
