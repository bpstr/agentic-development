# MCP Apps

Official documentation: [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview) and [build guide](https://modelcontextprotocol.io/extensions/apps/build). Canonical repository: [modelcontextprotocol/ext-apps](https://github.com/modelcontextprotocol/ext-apps).

MCP Apps is an MCP extension for associating a tool with an interactive HTML resource. Supporting hosts can render the resource inside a sandboxed frame and mediate communication with the server. An app may use ordinary hand-written UI or a generative renderer.

## Tool and resource contract

A tool declaration can advertise an app resource through metadata:

```json
{
  "name": "release_status",
  "description": "Show the current release status.",
  "inputSchema": {"type": "object", "properties": {}},
  "_meta": {"ui": {"resourceUri": "ui://release/status.html"}}
}
```

The server must also register that resource and return its HTML with the MIME type required by the extension. A declared URI alone does not serve a page. The SDK's `registerAppTool`, `registerAppResource`, and `RESOURCE_MIME_TYPE` helpers support this setup.

In an HTML bundle served as the resource, a minimal client can receive tool results:

```ts
import { App } from "@modelcontextprotocol/ext-apps";

const output = document.createElement("p");
document.body.append(output);

const app = new App({ name: "Release status", version: "1.0.0" });
app.ontoolresult = result => {
  output.textContent = result.content
    ?.filter(part => part.type === "text")
    .map(part => part.text)
    .join("\n") ?? "No status returned.";
};
await app.connect();
```

Install `@modelcontextprotocol/ext-apps` in the app project and use the build guide's server and bundling setup. Register callbacks before connecting so an initial result cannot arrive before its handler exists. Add user-triggered `app.callServerTool` calls only when the host permits them.

App-to-host communication uses JSON-RPC over `postMessage`; it is distinct from the server's stdio or HTTP transport. Host support and enabled capabilities vary. Provide a normal text result for clients without the extension.

Bundle assets or declare required origins through the extension's CSP metadata. Treat every UI-requested action as a server-authorized tool call. Frame isolation protects the host boundary but does not validate the app's claims or business logic.
