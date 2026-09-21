# Agentic web interaction models

Agents can interact with a web service through several surfaces. Choose an interface according to the task, authority boundary, and available application contract rather than treating browser automation as the default.

## Structured service interfaces

A normal HTTP API is usually the most direct surface when the application already exposes the required operation. It can provide stable identifiers, explicit schemas, authentication, idempotency, and authoritative results.

[MCP](../infrastructure/protocols/mcp/mcp-definition.md) can expose tools and resources to an agent host. [A2A](../infrastructure/protocols/agent-communication/a2a.md) is useful when the remote party is itself an independently executing agent service rather than a collection of callable tools.

These interfaces do not require a visible web page.

## Browser-native tools

[WebMCP](../infrastructure/protocols/webmcp/webmcp-definition.md) lets a web application expose structured tools from the live document context. The current Community Group draft describes JavaScript tools with natural-language descriptions and structured schemas. Chrome documents WebMCP as a progressive enhancement for agent interaction and currently exposes it experimentally through an origin trial.

WebMCP is useful when the agent and user share a browser session or when page state matters. It is not a remote replacement for MCP. A service may expose both.

Official sources: [WebMCP draft](https://webmachinelearning.github.io/webmcp/) and [Chrome WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp).

## DOM and accessibility interaction

When no structured action exists, a browser agent can inspect semantic HTML, forms, accessibility information, and application state. This retains more structure than pure visual automation, but the agent still has to infer how interface elements map to the intended business operation.

Semantic HTML remains useful even when WebMCP is present because people, assistive technologies, crawlers, and agents may all consume the same document.

## Visual computer use

[Computer use](../infrastructure/computer-use/computer-use-definition.md) can operate legacy interfaces through screenshots, pointer movement, keyboard input, or other browser-control mechanisms.

Use it when no stronger interface is available, not because imitating a human is intrinsically more agentic. Visual success indicators are observations, not authoritative proof that a backend operation completed.

## Match the surface to the task

A single service can intentionally provide several paths:

| Need | Suitable interface |
| --- | --- |
| Read stable public documentation | Markdown or structured content |
| Query authoritative application state | HTTP API or MCP tool |
| Act inside the user's live page/session | WebMCP |
| Delegate a goal to another agent service | A2A |
| Operate a legacy interface | DOM or computer use |
| Perform a purchase | Commerce contract plus bounded payment authority |

The strongest interface is the one that exposes the needed semantics and preserves application guarantees with the least inference. That choice can differ within one workflow.
