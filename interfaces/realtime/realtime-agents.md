# Realtime agents

A realtime agent participates in an ongoing interaction while new input and execution events continue to arrive. A token-streaming answer alone is not enough: a realtime system must define how new information changes active work, how interruptions are handled, and when results should be presented.

Keep interaction and task lifecycles separate. A voice session may be listening while a search runs; a collaborative document may receive edits while an agent drafts a summary. New input can be commentary, a constraint update, a replacement request, or an explicit cancellation. Those meanings require application policy and context.

An illustrative event can correlate the two lifecycles:

```json
{
  "type": "work.completed",
  "sessionId": "session_3",
  "conversationId": "conv_12",
  "runId": "run_8",
  "messageId": "msg_43"
}
```

A completed run can persist a result even if the session has disconnected. On reconnect, load the saved result and active jobs before deciding whether to resume presentation or start new work.

Choose latency targets by interaction. A microphone indicator must respond quickly; a release analysis can take longer if progress is clear and conversation remains available. Measure acknowledgement, useful output, and task completion separately. Fast acknowledgements cannot compensate for incorrect or missing results.

Use bounded queues and explicit backpressure. Old partial input can become less useful than newer state, but completed action receipts must not be dropped as though they were disposable audio frames. Define which events can be coalesced, replayed, or superseded, and deduplicate events before applying them to application state.

A realtime transport supplies connectivity. Durability, authorization, and conflict handling remain application responsibilities.

## Audiovisual capture and adapters

A camera-enabled voice interface has several independent stages: permission and capture, timestamping and frame selection, media transport, model-input conversion, inference, and presentation. [Provider video/voice capabilities](../../infrastructure/models/voice/voice-models.md#live-video-with-spoken-interaction) determine whether visual data enters the conversational model, becomes an image message, or goes to a separate vision backend.

Two open-source integration approaches illustrate this separation:

| Framework | Responsibility | Boundary to verify |
| --- | --- | --- |
| [LiveKit Agents](https://docs.livekit.io/agents/) | Realtime participants, media transport, and model/provider integrations | Video input support depends on the SDK language, model plugin, and selected model, not only the room configuration. |
| [Pipecat](https://docs.pipecat.ai/overview/introduction) | Python pipelines of media frames and processors, with client SDKs and transport/provider integrations | Decide between a native realtime model and a composed speech-to-text → reasoning/vision → speech pipeline. The framework is not itself a model. |

LiveKit's [video-input guide](https://docs.livekit.io/agents/multimodality/vision/video/) currently documents Python support enabled by `RoomOptions(video_input=True)`. Its default sampler uses up to one frame per second while the user speaks and one every three seconds otherwise. Gemini receives realtime video frames; OpenAI Realtime receives image conversation items. An audio-only model can silently ignore frames, so a successful connection is not an audiovisual integration test.

Pipecat's [transport guide](https://docs.pipecat.ai/client/concepts/choosing-a-transport) distinguishes server-mediated pipelines from direct provider transports that bypass a Pipecat server. Put private tool authorization and credentials on a trusted backend regardless of transport. Open-source SDKs and optional hosted infrastructure are separate deployment choices.

As an application policy, retain capture time and frame identity across queues and backend delegation. Drop superseded visual frames under load, but preserve committed action receipts. Test that a newly changed scene actually affects the response; also test microphone interruption, screen-source changes, stale frames, reconnects, and slow vision results. Sampling can miss a brief event, so do not interpret fluent narration as proof of continuous visual coverage.

Live camera understanding is also distinct from rendering an avatar or generating video output. Choose and test each direction independently.
