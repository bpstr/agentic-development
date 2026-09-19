# Generative UI: choosing components and composing interfaces

Generative UI lets model output influence the interface presented to a user. The term covers several mechanisms with different amounts of freedom. A model selecting a weather card, composing a form from a catalog, and generating JavaScript are three different engineering decisions.

## Choose how much freedom is useful

| Mechanism | What the model produces | What the application owns | Example |
| --- | --- | --- | --- |
| Tool-bound component | A tool call and structured result | A predefined renderer for that tool | Search results displayed as a list of documents |
| Declarative interface | Component descriptions and data | Catalog, renderer, validation, action handlers | A form assembled from approved fields |
| Generated code | HTML, JavaScript, or framework source | Isolation, execution limits, review, deployment | A disposable interactive prototype |

For business applications, begin with tool-bound components: their inputs and outcomes are easy to inspect. Declarative UI helps when the needed layout or field set varies by task. Generated code is useful for creative artifacts but introduces a separate execution environment and security boundary.

An **illustrative application schema**, not A2UI or OpenUI syntax:

```json
{
  "version": 1,
  "component": "DeadlineProposal",
  "props": {
    "projectId": "prj_7",
    "proposedDate": "2026-09-25"
  },
  "action": "request_deadline_change"
}
```

The client accepts only registered components and validates their props. Its `request_deadline_change` handler sends a proposal to the server. The server loads authoritative project data, checks access, and creates any required approval. Text, labels, and values produced by the model remain untrusted inputs.

## Representative approaches and protocol boundaries

**OpenUI by Thesys**, at [`thesysdev/openui`](https://github.com/thesysdev/openui), centers on OpenUI Lang, a streaming language for describing interfaces from a supplied component library. Its parser and renderers support progressive display. It is a representative catalog-driven framework; review its current package contracts and examples before integrating.

**OpenUI by Weights & Biases**, at [`wandb/openui`](https://github.com/wandb/openui), is a different project: a UI generation and preview application that can convert generated HTML into framework formats. Always include the owner or URL when discussing OpenUI. Its presence here identifies the naming ambiguity, rather than endorsing it as an application runtime.

**A2UI**, created by Google, defines declarative UI messages that clients render with their own component catalogs. It separates a description of a surface from the client's implementation of that surface. Its official site currently distinguishes the v0.9.1 release from a v1.0 candidate; pin the producer and renderer to compatible versions. See [A2UI documentation](https://a2ui.org/).

**AG-UI** defines the event connection between an agent backend and a user-facing application, including message, tool, and state interaction. A2UI describes UI content; AG-UI can carry or integrate that content alongside other agent events. They solve different parts of the interface. See the [AG-UI introduction](https://docs.ag-ui.com/introduction).

**MCP Apps** lets a tool associate an interactive HTML resource with its response. A supporting host can render that resource in an isolated frame and mediate bidirectional communication. This is an MCP extension, with client-specific support, rather than a requirement for every MCP tool. An app can contain hand-written UI or a renderer for declarative UI. See [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview).

## Limits to design for

Treat schema validity and authorization as separate checks. Valid UI can still request an unavailable action, reference another user's document, or present a misleading confirmation. Preserve server-generated operation details in trusted approval controls. Reject unknown component types, restrict navigation and network destinations, and keep secrets out of generated props.

Render incomplete streams carefully: show a placeholder until required fields are valid, and do not enable actions from partial data. Save the final structured result, its schema version, and a readable fallback so that a later renderer can still show the conversation. Accessibility, responsive layout, and understandable error states remain application responsibilities.

Related: [Chat rendering](chat-rendering.md), [Tools and protocols](../04-tools-and-protocols/README.md).

**Evidence:** source-reviewed on 2026-09-19. These are documented approaches, not independently tested production recommendations; JSON is illustrative.
