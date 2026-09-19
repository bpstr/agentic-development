# Chat rendering: messages, state, and controls

[Handbook](../../README.md) · [Chapter](README.md)

A chat renderer turns conversation state into an interface. A useful agent conversation contains more than a string per message: text, files, sources, tool requests, tool results, and pending decisions can coexist. Preserve these parts so that a reconnecting client can reconstruct what happened without guessing from prose.

## The main implementation layers

**assistant-ui** provides unstyled primitives such as Thread, Message, and Composer. These compose through runtime context and handle interaction behavior while leaving visual choices to the application. Its own **Elements** are styled, installable components built from those primitives. See [Primitives and Elements](https://www.assistant-ui.com/docs/primitives).

Its **runtime** owns or adapts conversation state and connects components to a backend. A custom store, a framework adapter, and hosted persistence are separate choices; using the UI does not require moving business execution into that UI. See [Architecture](https://www.assistant-ui.com/docs/architecture).

**Vercel AI Elements** is a separate component collection built on shadcn/ui, with conversation, message, source, tool, and confirmation components. It integrates with the **Vercel AI SDK**, which supplies generation and chat integration mechanisms. Distinguish Vercel's AI Elements from assistant-ui's similarly named Elements. See [AI Elements](https://elements.ai-sdk.dev/).

These choices can overlap: assistant-ui has an AI SDK runtime adapter. Match its package and documented integration to the AI SDK major version in your application; older tutorials can use different package names and message shapes. See the [adapter version matrix](https://www.assistant-ui.com/docs/runtimes/ai-sdk/overview).

## Render a state model

This is an **illustrative application record**, not an SDK or provider wire format:

```json
{
  "messageId": "msg_42",
  "runId": "run_8",
  "role": "assistant",
  "parts": [
    { "id": "p1", "kind": "text", "text": "I found the project." },
    {
      "id": "p2",
      "kind": "tool",
      "callId": "call_3",
      "name": "change_deadline",
      "state": "awaiting_approval",
      "input": { "projectId": "prj_7", "date": "2026-09-25" },
      "approvalId": "approval_6"
    }
  ]
}
```

Use stable message and part identifiers to update existing elements during streaming. Keep source references as structured data with document identity or URLs, then render links beside supported statements. Render Markdown with a configured parser, restrict unsafe links, and avoid interpreting generated text as executable HTML.

| Lifecycle | What the user should see |
| --- | --- |
| Request accepted | Acknowledgement and an identifiable run |
| Input still streaming | A pending tool card; incomplete arguments cannot authorize execution |
| Approval required | Exact proposed change and approve/reject controls |
| Running | Meaningful current operation, with cancellation when supported |
| Completed | Result, relevant resource link, and action receipt |
| Failed or denied | Explicit outcome and any safe next action |

Framework state names differ. AI Elements' Tool component, for example, recognizes input, approval, output, error, and denial states; map the backend's real lifecycle deliberately. See [Tool](https://elements.ai-sdk.dev/components/tool) and [Confirmation](https://elements.ai-sdk.dev/components/confirmation). Progress descriptions should describe observed events, rather than invent a private reasoning transcript.

## Controls must reach the execution boundary

An approval button submits a decision about a specific pending operation. The server must authenticate the actor, verify that operation and its current arguments, check permissions, and reject stale or repeated decisions. A client-supplied `approved: true` is not sufficient authorization. Tool rendering must never execute an operation simply because a component mounted.

Define **stop generation**, **cancel work**, and **disconnect** separately. A closed browser connection may leave a worker running; reconnecting must recover its status rather than duplicate the action. Persist run status and completed results, and use the selected framework's supported resumable transport where appropriate. assistant-ui links its [resumable stream integration from the runtime documentation](https://www.assistant-ui.com/docs/runtimes/ai-sdk/overview).

Related: [Generative UI](generative-ui.md), [Orchestration](../05-orchestration/README.md), [Calling models](../03-calling-models/README.md).

**Evidence:** source-reviewed on 2026-09-19; JSON is illustrative and does not make an API call.
