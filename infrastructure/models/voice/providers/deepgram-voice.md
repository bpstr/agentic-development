# Deepgram voice models and Voice Agent API

Official documentation: [Voice Agent API](https://developers.deepgram.com/docs/voice-agent), [STT models](https://developers.deepgram.com/docs/voice-agent-stt-models), [TTS models](https://developers.deepgram.com/docs/voice-agent-tts-models), and [feature overview](https://developers.deepgram.com/docs/voice-agent-feature-overview).

Deepgram provides speech recognition and speech synthesis models plus a Voice Agent API that composes listening, an LLM layer, speaking, function calls, and conversation events over one agent connection.

For speech recognition, the Voice Agent documentation distinguishes **Flux**, optimized for low-latency conversational use with model-integrated end-of-turn detection, from **Nova**, which provides a broader conventional transcription feature set.

For speech generation, Deepgram distinguishes **Flux TTS**, designed for streaming voice-agent output and cross-turn consistency, from the **Aura** family, which provides a broader voice catalog and additional output-format options.

The Voice Agent API can also use supported third-party reasoning or speech providers. Treat that as orchestration around models rather than evidence that all components are Deepgram models.

A production integration should record which layer produced each event: transcript, reasoning/tool result, generated speech, and playback completion are different facts. Function calls still need application-level authorization and idempotency.

Deepgram documents a single WebSocket conversational flow and regional endpoints. Verify current region support, models, and session limits in the official documentation before selecting it for a deployment.
