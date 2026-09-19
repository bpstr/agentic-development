# Interfaces and rendering

[Handbook](../../README.md) · [Chapter](README.md)

An agent interface makes work understandable and controllable: what was requested, what is running, what needs a decision, and what actually happened. Chat is one possible surface. Forms, embedded tools, task timelines, and voice can use the same underlying conversation and execution records.

| Start here | Question | Main concepts |
| --- | --- | --- |
| [Chat rendering](chat-rendering.md) | How do I turn agent events into a usable conversation? | Message parts, runtime adapters, assistant-ui, AI Elements, approvals, reconnecting |
| [Generative UI](generative-ui.md) | How much of the interface should a model choose? | Tool components, component catalogs, OpenUI, A2UI, AG-UI, MCP Apps |
| [Realtime and voice](realtime-and-voice.md) | How can a spoken conversation continue while work runs? | Speech pipelines, realtime sessions, GPT-Live delegation, transport, durable results |

Keep four responsibilities distinct when choosing a stack:

- **Rendering:** the components, layout, accessibility, and visible interaction.
- **Conversation state:** messages, parts, edits, branches, attachments, and history.
- **Transport:** delivery of incremental events and user actions between the application and an agent service.
- **Execution:** authorization, tools, business operations, cancellation, and persistence on the server.

For example, assistant-ui can render a conversation through its AI SDK adapter while an application backend authorizes tool calls and stores results. Its runtime connects UI state to a backend; it is not the same responsibility as an agent's server execution runtime. See the [assistant-ui architecture](https://www.assistant-ui.com/docs/architecture).

Start with ordinary text and a small set of trusted tool components. Add dynamically composed interfaces when the task benefits from layouts that cannot be anticipated. Add voice when speaking improves the workflow, while preserving readable results and familiar controls.

Related chapters: [Calling models](../03-calling-models/README.md), [Tools and protocols](../04-tools-and-protocols/README.md), [Orchestration](../05-orchestration/README.md), and [Evaluation and operations](../09-evaluation-and-operations/README.md).

**Evidence:** source-reviewed on 2026-09-19. Product integrations in this chapter were not installed or exercised; snippets are illustrative unless stated otherwise.
