# Agent, tool, and UI communication

**Choose a protocol by the boundary it serves.** A system can use a provider inference API, MCP, A2A, and a UI event interface without asking them to solve the same problem.

| Interface | Primary boundary | Representative exchange |
| --- | --- | --- |
| Provider inference API | Application/runtime to model service | Generate from context; receive content or tool requests |
| Managed agent API | Application to hosted agent runtime | Start session; submit work; receive outcome/events |
| MCP | Host/client to tool and context server | Discover tools; call `get_task`; receive data |
| A2A | Client agent/application to another agent service | Send work; track a task; receive an artifact |
| AG-UI | Agent backend to application frontend | Stream text, tool progress, and state updates |
| UI description format | Generated UI data to a renderer | Describe components from an allowed catalog |

The last row describes a category, not a universal wire format. UI description systems such as A2UI address what is rendered; a transport/event layer addresses how updates arrive. See [generative UI](../../interfaces/generative-ui.md) for rendering frameworks.

## MCP and A2A

MCP is useful when exposing defined capabilities. A2A is useful when delegating a goal to another service that owns its own agent execution. The official [A2A and MCP comparison](https://a2a-protocol.org/latest/topics/a2a-and-mcp/) describes them as complementary.

A2A defines agent discovery, messages, tasks, status updates, and artifacts. An Agent Card advertises an agent's interfaces and capabilities. A client can discover the advertised service before sending work, and use the specified task lifecycle for continuing or tracking it. [A2A specification](https://a2a-protocol.org/latest/specification/), [agent discovery](https://a2a-protocol.org/latest/topics/agent-discovery/).

For example, a support agent might ask a separate research service to investigate an incident and produce a report. That service could internally call MCP tools for logs and documents. The caller needs the report and task outcome; it need not share the research service's prompts or internal loop. This is an illustrative architecture, not a claim that every remote agent needs A2A.

## AG-UI and visible work

AG-UI defines events that connect agent execution to an application: run lifecycle, streamed messages, tool events, and state changes. It can help keep a custom interface aligned with a long-running backend. It is separate from the model's inference request format. [AG-UI overview](https://docs.ag-ui.com/introduction).

This **synthetic sequence** uses core AG-UI event shapes; the enclosing JSON array is a teaching format, not a prescribed network envelope:

```json
[
  { "type": "RUN_STARTED", "threadId": "thread-1", "runId": "run-1" },
  { "type": "TEXT_MESSAGE_START", "messageId": "message-1", "role": "assistant" },
  { "type": "TEXT_MESSAGE_CONTENT", "messageId": "message-1", "delta": "The report is ready." },
  { "type": "TEXT_MESSAGE_END", "messageId": "message-1" },
  { "type": "RUN_FINISHED", "threadId": "thread-1", "runId": "run-1" }
]
```

The [event reference](https://docs.ag-ui.com/concepts/events) supplies additional fields and event families. A frontend adapter still needs to interpret what a tool result means in the product and reconnect to the backend's durable state.

## Start with the smallest useful boundary

These are recommended starting points:

- For one internal assistant and one backend, a documented application endpoint plus typed events can be sufficient.
- Add MCP when tool reuse across multiple hosts makes a shared contract useful.
- Evaluate A2A when independently operated agents need discovery, delegation, and task exchange.
- Evaluate AG-UI when a frontend needs a reusable vocabulary for ongoing agent work across runtimes.

Whichever interface you choose, keep an explicit map between conversation, run, tool-call, and business-operation identities. A displayed “finished” event should have a precise meaning, especially when child work can fail or an operation continues elsewhere.

**Review:** official sources checked **2026-09-19**. The protocol map is an architectural synthesis; the event sequence was not exercised against a client or server.
