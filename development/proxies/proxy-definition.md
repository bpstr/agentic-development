# Model and agent proxies

A proxy mediates traffic between a client and an upstream service. In agentic development it commonly forwards model requests, translates API formats, or exposes an existing tool connection through another endpoint.

A model proxy operates at the inference boundary. It can receive a client's request and relay it to a provider. A gateway often adds routing, policy, credentials, and usage accounting. An MCP proxy instead mediates tool-protocol connections. None of these roles inherently owns the application's agent loop.

## Understand the boundary

Consider an IDE using the Anthropic Messages format through a bridge to a Responses-based upstream. The bridge changes the request and response representation. The upstream model still generates the answer, and the IDE still owns its local tools unless the integration explicitly delegates execution elsewhere.

The location of a proxy also says little about inference locality. A process listening on localhost may forward every request to a remote service. Account authentication, proxy authentication, and downstream service authorization remain separate concerns.

[Codex Proxy](tools/codex-proxy.md) is a concrete compatibility bridge. [Protocol translation](protocol-translation.md) explains why valid text output alone is insufficient evidence that an agent workflow is preserved.

Evaluate a proxy against a direct integration using the same workload. Inspect streaming, tool-call correlation, cancellation, errors, and usage reporting. Additional layers can simplify client integration, but they also introduce latency and another component whose failures must be observable.
