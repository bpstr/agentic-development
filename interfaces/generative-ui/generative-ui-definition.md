# Generative UI

Generative UI lets model output influence the interface shown to a person. The term covers several mechanisms with different degrees of freedom. Selecting a weather card, assembling a form, and generating JavaScript require different execution and validation rules.

| Mechanism | Model output | Application responsibility |
| --- | --- | --- |
| Tool-bound component | A structured tool result | Select and populate a predefined renderer |
| Declarative interface | Component descriptions and data | Validate against a catalog and render trusted components |
| Generated code | HTML, JavaScript, or framework source | Review or isolate execution and control capabilities |

For a search assistant, a predefined results list may be sufficient. A scheduling assistant may benefit from a generated form whose fields depend on the selected meeting type. A design assistant may produce a disposable interactive prototype that needs a separate execution environment.

Choose the smallest expressive surface that serves the task. A fixed component can still contain flexible data, and a declarative surface can still contain unsafe or misleading values. Schema validity establishes structural correctness; it does not establish that an action is authorized or a claim is true.

Preserve the output's schema or component-catalog version alongside a readable fallback. Saved conversations must remain understandable after the renderer changes. In a stream, display partial layouts carefully and delay consequential actions until their inputs are complete.

[OpenUI](frameworks-and-protocols/openui.md) provides a language and rendering framework; [A2UI](frameworks-and-protocols/a2ui.md) specifies declarative surfaces; [MCP Apps](frameworks-and-protocols/mcp-apps.md) embeds interactive resources in supporting hosts. MCP Apps can contain hand-written UI, so an embedded app is not automatically generative UI.
