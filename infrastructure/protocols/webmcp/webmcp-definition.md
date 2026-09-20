# WebMCP

[Official WebMCP draft](https://webmachinelearning.github.io/webmcp/) · [Canonical repository](https://github.com/webmachinelearning/webmcp) · [Chrome preview announcement](https://developer.chrome.com/blog/webmcp-epp)

WebMCP exposes web-application operations to agents through the browser's live document context. A website can provide a named JavaScript operation and input schema instead of requiring an agent to infer every action from screenshots or DOM controls.

It is a browser API, not a remote MCP server or a JSON-RPC transport binding. A website can independently provide a remote MCP service when clients also need access outside an open page.

## Imperative registration

The **17 September 2026 Community Group draft** places the API on `document.modelContext`. This module-script example registers a read-only tool:

```javascript
if (document.modelContext) {
  await document.modelContext.registerTool({
    name: "get_page_title",
    description: "Read the current page title.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    },
    annotations: { readOnlyHint: true },
    execute: async () => ({ title: document.title })
  });
}
```

This example uses draft syntax. Earlier preview material may use `navigator.modelContext`; check the browser implementation and draft together rather than treating those APIs as identical.

## Declarative exposure

Declarative WebMCP describes exposing form-based operations through HTML. The draft's declarative section remains incomplete and points to a separate explainer. Treat it as an evolving authoring approach, not a universally implemented browser feature.

## Preserve application guarantees

Use the same server-side authorization and validation that the corresponding UI operation requires. A browser session does not grant unrestricted authority over every backend object. Keep tool names precise about effects, and represent consequential operations accurately.

Tool descriptions and returned page content can contain untrusted material. They must not become privileged instructions merely because a browser exposes them through a structured API.

WebMCP is a Community Group draft, not a W3C Standard. Feature detection and a working ordinary interface are necessary when supporting browsers with different implementations.
