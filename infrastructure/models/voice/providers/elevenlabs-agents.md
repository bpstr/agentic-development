# ElevenLabs voice integration

Official documentation: [model catalog](https://elevenlabs.io/docs/overview/models), [ElevenAgents overview](https://elevenlabs.io/docs/eleven-agents/overview), [Agents WebSocket API](https://elevenlabs.io/docs/eleven-agents/libraries/web-sockets), [Speech Engine](https://elevenlabs.io/docs/overview/capabilities/speech-engine), and [realtime TTS](https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/realtime-tts). Canonical SDK repositories are under [elevenlabs](https://github.com/elevenlabs).

ElevenLabs exposes several layers that should be distinguished:

- speech models such as Eleven v3, Eleven v3 Conversational, Eleven Multilingual v2, and Eleven Flash v2.5;
- speech-recognition models such as Scribe v2, Scribe v2 Realtime, and Scribe v2 Medical;
- **ElevenAgents**, a managed conversational-agent platform;
- **Speech Engine**, which adds speech recognition, synthesis, turn-taking, and interruption handling around an application-controlled LLM.

Scribe v2 Medical (`scribe_v2_medical`) is a batch speech-to-text specialization for clinical audio. It uses the Speech to Text API family and produces draft transcription for review; it is not a clinical decision model. For live transcription, use the realtime model rather than assuming the medical specialization is streamable.

The managed agent and Speech Engine products are not themselves single voice models. Keep the selected STT/TTS model, agent configuration, and application tool execution as separate concerns.

## Realtime integration

ElevenAgents supports SDK and WebSocket integrations. For private agents, obtain the provider's signed or ephemeral client credential through a trusted backend rather than exposing an API key.

The WebSocket event model distinguishes user transcripts, agent text, audio chunks, corrections, interruptions, tool requests/results, and health events. Those distinctions are useful for maintaining accurate UI and history: generated text can arrive on a different schedule from audio playback, and an interrupted response may receive a correction.

ElevenLabs also documents per-tool interruption behavior. This is important when speech may stop while an underlying operation must still finish.

For raw TTS, streaming and WebSocket endpoints reduce time to first audio. Chunking strategy affects both latency and speech quality; test it with realistic streamed LLM output rather than fixed paragraphs.

Application permissions, idempotency, durable task state, and final action receipts remain outside the speech model. See the provider-level [ElevenLabs](../../providers/elevenlabs.md) page and [text-to-speech models](../text-to-speech.md).
