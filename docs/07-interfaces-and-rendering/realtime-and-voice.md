# Realtime and voice: conversation alongside execution

[Handbook](../../README.md) · [Chapter](README.md)

A voice interface adds audio input, playback, and conversational timing to an application. It still needs the same tools, authorization, durable work records, and history as a text interface. Choose the speech architecture separately from the transport that carries its audio and events.

## Three useful architectures

| Architecture | How it works | Main tradeoff |
| --- | --- | --- |
| Chained speech pipeline | Speech-to-text → text agent → text-to-speech | Each stage is replaceable and inspectable, but buffering and handoffs can add delay |
| Speech-to-speech session | An audio model interprets speech, reasons, uses tools, and speaks | Natural interaction depends on the session's audio and interruption controls |
| Conversational voice with delegated work | A voice model handles speaking/listening while another agent does tasks | Conversation can continue, but results and changing user intent need coordination |

OpenAI's current documentation distinguishes these as chained pipelines, Realtime API sessions, and **GPT-Live**. The architecture categories are also useful outside that provider. See [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents).

GPT-Live supports listening while speaking and delegates work to a separate backend. With client delegation, an application supplies its own agent or service; with Responses delegation, the platform manages the backend model interaction while the application still implements its custom functions. See [Getting started with GPT-Live](https://developers.openai.com/api/docs/guides/live). Keep conversation style in the voice prompt and business rules in the execution service.

## Transport and session responsibilities

**WebRTC** carries browser microphone and playback media, with a data channel for events. **WebSockets** suit server audio integrations and control events. **SIP** connects telephony systems. These are connection choices, not substitutes for an agent workflow. OpenAI documents these options and server sideband control in its [GPT-Live connection guide](https://developers.openai.com/api/docs/guides/live).

For OpenAI Realtime, the documented browser flow creates an ephemeral credential on a trusted server and then connects a session over WebRTC. Permanent provider credentials remain on the server. Tool execution and session lifecycle still need application controls. See [Realtime API getting started](https://developers.openai.com/api/docs/guides/realtime).

Separate **voice activity detection**, which identifies likely speech boundaries, from **business intent**, which determines whether enough information exists to act. A pause is not consent. Similarly, a transcript fragment may be corrected by the next words; avoid committing a consequential operation from an unfinished utterance.

## Persist work beyond the call

Consider: “Summarize the open release issues.” The agent starts a longer query, and the user asks an unrelated question while it runs. A useful application design is:

1. Store the request in the existing conversation and create a durable backend run.
2. Associate the voice session's delegation with that run and conversation.
3. Let the voice interface acknowledge progress while the worker performs authorized actions.
4. Save the result as a normal assistant message, including citations and resource links.
5. Provide the voice session with a brief result or notification when appropriate.

An **illustrative application event**, not a provider event schema:

```json
{
  "type": "work.completed",
  "conversationId": "conv_12",
  "runId": "run_8",
  "messageId": "msg_43",
  "spokenSummary": "Three release issues need attention. The details are in this conversation."
}
```

Do not equate backend completion with the user hearing the answer: interruption or disconnection may prevent playback. GPT-Live explicitly separates delegated response events from live speech; retain the association between each delegation and its result. See [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).

Define what an interruption means: stopping audio, changing the request, or cancelling a job are distinct operations. Record cancellation separately, and recheck permissions before a delayed mutation. On reconnect, load durable conversation state and active runs instead of restarting work implicitly.

Evaluate both the conversation and the saved outcome. Useful measurements include time to audible acknowledgement, time to useful answer, tool success, interrupted playback, reconnection, and whether a spoken confirmation matches the actual database change.

Related: [Chat rendering](chat-rendering.md), [Orchestration](../05-orchestration/README.md), [Evaluation and operations](../09-evaluation-and-operations/README.md).

**Evidence:** source-reviewed on 2026-09-19. The persistence flow is an application design pattern; JSON is illustrative and no voice sessions were executed.
