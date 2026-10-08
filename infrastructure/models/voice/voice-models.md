# Voice and audio models

Voice systems use several distinct model capabilities. Treat them separately because they have different latency, state, pricing, and failure characteristics.

- **Speech-to-text (STT)** converts audio into text. Realtime variants emit partial or incremental transcripts before a turn is final.
- **Text-to-speech (TTS)** converts text into generated audio. Streaming variants begin playback before the entire utterance is synthesized.
- **Speech-to-speech / audio-to-audio** models accept spoken input and generate spoken output directly, often preserving timing, prosody, and other acoustic information that is lost in a transcript-first pipeline.
- **Realtime voice models** add session behavior around audio generation: turn detection, interruption handling, tool use, or conversational state may be integrated with the model or surrounding API.

Do not compare these categories as though they were interchangeable. A chained STT → language model → TTS system gives the application explicit text boundaries and replaceable components. A native audio-to-audio model can reduce handoff latency and retain more acoustic information, but its event model, interruption behavior, and tool execution boundaries are provider-specific.

## Current provider families

Model names and preview status change frequently. Verify the linked provider catalog before deployment.

| Provider | Realtime / speech-to-speech | Speech-to-text | Text-to-speech |
| --- | --- | --- | --- |
| OpenAI | GPT-Live 1; GPT-Realtime family | GPT-Transcribe, GPT-Live-Transcribe, GPT-Realtime-Whisper and related transcription models | GPT-4o Mini TTS and legacy TTS models |
| Google | Gemini 3.8 Live; Gemini 3.8 Live Extended Thinking; Gemini 3.5 Live Translate preview | Gemini 3.5 Transcribe; Gemini 3.5 Transcribe Live | Gemini 3.8 Flash TTS; Gemini 3.8 Flash-Lite TTS |
| xAI | Grok Voice API speech-to-speech; `grok-voice-latest` alias | `grok-voice-transcribe-2.0` and the earlier 1.0 model | Grok Voice Text-to-Speech API |
| ElevenLabs | ElevenAgents combines conversational infrastructure with selectable speech models | Scribe v2; Scribe v2 Realtime; Scribe v2 Medical | Eleven v3, Eleven v3 Conversational, Eleven Multilingual v2, Eleven Flash v2.5 |
| Deepgram | Voice Agent API composes listening, reasoning, and speaking | Flux and Nova families | Flux TTS and Aura families |
| Hume | Empathic Voice Interface (EVI) speech-language models | Integrated into EVI for conversational use | Octave speech-language models and Hume voices |

Official catalogs: [OpenAI models](https://developers.openai.com/api/docs/models), [Gemini models](https://ai.google.dev/gemini-api/docs/models), [xAI Voice](https://docs.x.ai/developers/model-capabilities/audio/voice), [xAI Speech to Text](https://docs.x.ai/developers/models/speech-to-text), [ElevenLabs models](https://elevenlabs.io/docs/overview/models), [Deepgram voice-agent STT models](https://developers.deepgram.com/docs/voice-agent-stt-models), [Deepgram voice-agent TTS models](https://developers.deepgram.com/docs/voice-agent-tts-models), and [Hume Voice](https://dev.hume.ai/docs/voice/overview).

For xAI, the `grok-voice-latest` alias can move between concrete speech-to-speech versions. Pin a version when reproducibility matters. The speech-to-text API currently defaults to `grok-voice-transcribe-2.0`; batch and streaming transcription have different operational limits and pricing, so treat them as separate deployment configurations.

## Live video with spoken interaction

A video-capable product, a video-file inference API, a realtime image-input session, and a camera-enabled voice client are not interchangeable. Verify the public API and the path that actually reaches the model; do not infer developer access from a consumer-app demonstration.

| Surface | Verified audiovisual boundary | Integration consequence |
| --- | --- | --- |
| [Gemini Live](providers/gemini-live.md#camera-and-voice-in-the-same-session) | Audio and sampled image frames enter one bidirectional live session. | Implement capture, sampling, interruption, and session recovery; this is not video generation. |
| [OpenAI GPT-Realtime-2 and GPT-Live](providers/openai-live.md#images-camera-frames-and-video-are-different-surfaces) | Realtime accepts images alongside audio, while GPT-Live delegates vision to a backend. | Frame-to-image adapters and backend vision have different state and cost boundaries. |
| [Qwen Omni Realtime / Qwen-Live-Harness](https://github.com/QwenLM/Qwen-Live-Harness) | The official open-source harness supports microphone/camera interaction with the hosted Qwen3.8 Omni Flash Realtime API. | Distinguish open-source harness code from the hosted model's weight availability and service terms. |
| [MiniCPM-o 4.5](https://github.com/OpenBMB/MiniCPM-V) | Open-weight audiovisual model with full-duplex streaming support and an [official self-hosted demo](https://github.com/OpenBMB/MiniCPM-o-Demo). | Validate the exact checkpoint license, serving code, hardware requirements, and achievable latency. MiniCPM-V and MiniCPM-o are not the same model surface. |

The [Qwen3-Omni repository](https://github.com/QwenLM/Qwen3-Omni) also provides open checkpoints for multimodal understanding and speech. A published checkpoint does not imply that a similarly named newer hosted realtime model is open-weight, or that an arbitrary inference host exposes its realtime behavior.

For other providers, the currently inspected [Amazon Nova documentation](https://docs.aws.amazon.com/nova/latest/nova2-userguide/) assigns speech/text interaction to Nova 2 Sonic and video understanding to Nova 2 Lite; those are separate model surfaces. [xAI's speech-to-speech API](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech) documents audio/text WebSocket interaction, not an equivalent camera-input contract. [Claude's model overview](https://platform.claude.com/docs/en/models/overview) describes text/image input and text output, not a native audiovisual voice session. These are limits of the documented surfaces, not claims that applications cannot combine them with other components.

[Realtime application frameworks](../../../interfaces/realtime/realtime-agents.md#audiovisual-capture-and-adapters) can connect cameras, transports, speech services, and vision models. Their support for a video track is not evidence that the selected backend consumes it. Measure visual freshness and temporal coverage in addition to voice latency.

## Selection criteria

Measure the complete interaction rather than a single advertised model latency. Useful dimensions include:

- time from end-of-user-turn to first audible response;
- interruption and false-interruption behavior;
- transcript stability and correction events;
- language and code-switching support;
- expressive or controllable speech output;
- tool-call and delegation semantics;
- session limits, reconnect behavior, and transport;
- audio input/output formats and browser/mobile compatibility;
- regional routing, data handling, and retention requirements;
- cost of the complete pipeline, including separate backend model and tool usage.

A voice model is only one part of the experience. See [voice agents](../../../interfaces/voice/voice-agents.md), [voice turn-taking](../../../interfaces/voice/voice-turn-taking.md), and [voice session states](../../../interfaces/voice/voice-session-states.md) for the application-facing behavior.
