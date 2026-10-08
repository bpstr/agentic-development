# OpenAI GPT-Live and realtime voice

Official documentation: [OpenAI model catalog](https://developers.openai.com/api/docs/models), [GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1), [getting started with GPT-Live](https://developers.openai.com/api/docs/guides/live), [delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation), and the [Realtime API guide](https://developers.openai.com/api/docs/guides/realtime).

OpenAI exposes more than one voice architecture. **GPT-Live 1** is a full-duplex voice model that can keep a spoken conversation active while delegating reasoning and tool work to a backend. The **GPT-Realtime** family instead performs realtime audio interaction and tool selection within the realtime model/session architecture. Separate transcription and text-to-speech models are also listed in the model catalog.

Do not treat those surfaces as interchangeable merely because they all accept audio. Choose according to who should own reasoning, tool execution, turn-taking, and the spoken conversation.

## GPT-Live delegation

GPT-Live separates the conversational model from backend work. The backend can continue during an interruption because stopping speech and cancelling work are separate operations.

Two delegation modes divide the integration differently:

- **Responses delegation** lets GPT-Live prepare supported Responses requests and return backend results to the live conversation.
- **Client delegation** lets the application prepare context, run its own agent or service, validate the result, and send the useful result back.

In both modes, permissions, confirmations, private function execution, and durable business records remain application responsibilities.

The official guide uses `gpt-live-1` as the Live model identifier. For browser microphone and playback, OpenAI documents WebRTC and recommends keeping project API credentials on a trusted server.

A backend completion does not mean its result was spoken or heard. Persist the backend outcome independently and keep enough identifiers to correlate the voice turn, delegation, tool execution, and final application record.

## Realtime models

The current OpenAI model catalog separately lists GPT-Realtime models for speech-to-speech workflows, including reasoning-capable variants, plus dedicated transcription and speech-generation models. Model names and lifecycle status are time-sensitive; keep exact identifiers in application configuration and verify them against the catalog before deployment.

See [voice models](../voice-models.md), [speech-to-text](../speech-to-text.md), and [text-to-speech](../text-to-speech.md) for the capability split.

## Images, camera frames, and video are different surfaces

The [GPT-Live delegation guide](https://developers.openai.com/api/docs/guides/live-delegation) states that the Live conversational model does not accept image input directly. Send images to a vision-capable backend and return its findings to the voice conversation. Responses delegation supports backend image items through `response.item.create`, followed by `response.create` when the backend turn is ready; client delegation lets an application own that vision workflow instead. Do not put image content in `session.input` and assume the audio frontend can see it.

[GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2) is different: its catalog lists text, audio, and image input, but explicitly lists video as unsupported. The [Realtime conversation guide](https://developers.openai.com/api/docs/guides/realtime-conversations) documents image input. Applications can sample a camera into image conversation items while handling audio; that does not turn the endpoint into a native video-stream API or establish that every camera frame was analyzed.

For example, [LiveKit's video adapter](https://docs.livekit.io/agents/multimodality/vision/video/) bridges a video track to OpenAI Realtime by adding image messages, whereas its Gemini path sends frames through the provider's realtime video input. Check the actual model and adapter combination, not just the presence of a video track in the UI.

For either architecture, correlate each visual observation with its capture time and delegated work. A delayed description of an old frame must not be presented as the current scene. Track visual-inference cost and lifecycle separately from speech playback, and revalidate adapters when migrating between GPT-Realtime and GPT-Live.

## Decision-backed voice control

OpenAI's [Decisions guide](https://developers.openai.com/api/docs/guides/decisions#add-voice-control) explicitly connects Decisions with Live **client delegation**. A backend can evaluate textual intent and current application state, select from allowed actions, execute an authorized handler, and return its recorded outcome to the spoken conversation. This is an alternative backend judgment step, not a new Live model or automatic tool-execution mode.

The [Decisions input contract](../../../inference/apis/openai-responses-api.md#decisions-api-for-bounded-judgments) accepts text and inline images, not raw audio or video. Obtain the text through the voice/delegation layer; camera applications must prepare supported images separately. Keep capture times and state versions so a delayed decision does not act on a stale scene. Send refusals, uncertainty, and failures to clarification or review; confirm consequential actions independently of the classifier's confidence.
