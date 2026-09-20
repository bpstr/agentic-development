# A2UI

Official documentation: [A2UI](https://a2ui.org/) and [v0.9.1 protocol](https://a2ui.org/specification/v0.9.1-a2ui/). Canonical repository: [a2ui-project/a2ui](https://github.com/a2ui-project/a2ui).

A2UI is a protocol for agent-generated declarative interfaces, originally created by Google. An agent describes a surface with components and data; a client renders that description using an agreed component catalog. Its transport is separate from its UI message contract.

Use A2UI when an agent needs to assemble interfaces while the host controls which native or web components are available. It does not require executing arbitrary generated application code.

## Minimal surface exchange

The following two messages use the v0.9.1 format. First create a surface with an agreed catalog:

```json
{
  "version": "v0.9.1",
  "createSurface": {
    "surfaceId": "release_summary",
    "catalogId": "https://a2ui.org/specification/v0_9_1/catalogs/basic/catalog.json"
  }
}
```

Then provide a root component:

```json
{
  "version": "v0.9.1",
  "updateComponents": {
    "surfaceId": "release_summary",
    "components": [
      {"id": "root", "component": "Text", "text": "Three release blockers remain."}
    ]
  }
}
```

The catalog identifier identifies a shared contract; it does not require the renderer to download arbitrary code from that URL. Further messages can update components or the data model, and `deleteSurface` removes the surface.

Choose the same protocol and catalog versions on producer and renderer. The official documentation distinguishes v0.9.1 from the v1.0 candidate; examples from other versions can use different fields. Preserve message order and clear framing over the selected transport.

The [client setup guide](https://a2ui.org/guides/client-setup/) describes renderer integration. Its React packages are:

```bash
npm install @a2ui/react @a2ui/web_core
```

Connect the message processor to the incoming transport and render its surfaces through the React integration. Define allowed actions, validate their context on the server, and handle incomplete component references during progressive rendering. Schema validity does not prove that a proposed business action is authorized.

A2UI describes UI content. AG-UI describes an agent-to-application event interface, and MCP Apps supplies an embedded application mechanism. These can be combined but are not interchangeable specifications.
