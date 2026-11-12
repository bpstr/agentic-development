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

The [Decisions voice guide](https://developers.openai.com/api/docs/guides/decisions-voice) describes both **client delegation** (the application calls Decisions after receiving a Live delegation) and **native Decisions delegation**, added October 15, 2026 (Live calls Decisions directly). Native delegation reduces round trips but **does not authorize or execute application actions**.

Configure `session.delegation` with `type: "decisions"` and supported named questions; grant `api.decisions.write`. `session.triggers` can evaluate input or output transcript deltas during conversation, and `session.update` can revise questions after the matching `session.updated` acknowledgement. Choose the delegation type at session creation. Correlate decision identifiers, transcript timing, and authoritative application state. The backend must validate selected actions, enforce permissions and approvals, execute them, persist receipts, and only then tell Live what actually happened.

The [Decisions endpoint](../../../inference/apis/openai-responses-api.md#decisions-api-for-bounded-judgments) accepts **text, JSON data, and images supplied as inline data URLs or public HTTP(S) URLs, but not raw audio or video**. Live manages the spoken interaction; an authorized backend must prepare any additional visual evidence and reject stale scene observations.

## Custom GPT-Live voices

Since October 16, 2026, [prompt-to-voice](https://developers.openai.com/api/docs/guides/custom-voices) is generally available for API customers. Create an adult custom voice from a text description through `/v1/audio/voices`, then select its saved ID when creating a GPT-Live session. **Prompt-generated voices do not work with the standalone Text to Speech API, GPT-Realtime, or audio Chat Completions.** Voices generated from an approved recording follow a different, access-restricted consent/reference-sample workflow and support different APIs. Voice creation is not Zero Data Retention compatible. Review voice rights, consent and impersonation restrictions, limits, and project-level authorization before deployment.
