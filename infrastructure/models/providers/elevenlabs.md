# ElevenLabs

[Official documentation](https://elevenlabs.io/docs) · [Model catalog](https://elevenlabs.io/docs/overview/models) · [Canonical SDK repositories](https://github.com/elevenlabs)

ElevenLabs is an audio model and voice-platform provider. Its products include speech synthesis, speech recognition, voice design and cloning, realtime conversational agents, and APIs for integrating those capabilities into applications.

The provider currently documents several distinct model families rather than one universal voice model:

- **Eleven v3** for expressive speech generation;
- **Eleven v3 Conversational** for expressive realtime synthesis;
- **Eleven Multilingual v2** for stable multilingual long-form speech;
- **Eleven Flash v2.5** for low-latency synthesis;
- **Scribe v2** for speech recognition;
- **Scribe v2 Realtime** for low-latency streaming recognition.

Model identifiers, language coverage, and availability are time-sensitive; use the model catalog as the source of truth.

ElevenAgents is a managed conversational platform above the raw speech models. ElevenLabs also documents Speech Engine for adding STT/TTS and turn handling around an application-controlled LLM. These are architecture choices, not additional model families.

For agentic systems, keep provider integration separate from application authorization and durable business state. A conversational session may request a client or server tool, but the application still decides whether that operation is allowed and whether its result committed successfully.

See [ElevenLabs voice integration](../voice/providers/elevenlabs-agents.md), [voice models](../voice/voice-models.md), and [text-to-speech models](../voice/text-to-speech.md).
