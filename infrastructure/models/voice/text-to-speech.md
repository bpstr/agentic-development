# Text-to-speech models

Text-to-speech models synthesize spoken audio from text. Agent applications use them in chained voice pipelines, accessibility features, narration, notifications, and as the speaking layer for an otherwise text-based agent.

For interactive voice, streaming behavior matters as much as raw synthesis quality. A system can start producing audio before the full response text exists, but chunk boundaries affect both latency and prosody. Sending tiny fragments can sound unnatural; waiting for long paragraphs makes the assistant feel slow.

A useful pipeline is:

```text
model text deltas
    ↓
sentence / phrase buffering
    ↓
streaming TTS
    ↓
playback queue
    ↓
interrupt / discard obsolete audio
```

The application should distinguish generated audio from audio actually played to the user. If the user interrupts midway through a sentence, conversation history should not automatically claim the unheard remainder was communicated.

## Selection criteria

Evaluate:

- time to first audio;
- continuity across streamed chunks and turns;
- language and pronunciation coverage;
- voice stability and expressiveness;
- voice cloning or voice-design requirements;
- streaming and WebSocket support;
- supported codecs, sample rates, and output containers;
- interruption and cancellation semantics;
- cost per character, token, or generated duration.

Official references include [ElevenLabs Text to Speech](https://elevenlabs.io/docs/overview/capabilities/text-to-speech), [ElevenLabs latency guidance](https://elevenlabs.io/docs/eleven-api/guides/how-to/best-practices/latency-optimization), [Deepgram TTS models](https://developers.deepgram.com/docs/voice-agent-tts-models), [Deepgram Aura voices](https://developers.deepgram.com/docs/tts-models), and the [OpenAI model catalog](https://developers.openai.com/api/docs/models).

## Voice design, cloning consent, and API boundaries

Voice creation and speech synthesis are separate contracts. OpenAI [prompt-to-voice](https://developers.openai.com/api/docs/guides/custom-voices) creates reusable voice IDs from text, but they play **only in GPT-Live**. The recording-derived voice workflow instead requires explicit consent and restricted access and supports additional OpenAI audio APIs. A successful custom voice creation does not establish a working low-latency voice session.

Google's [September 22, 2026 Gemini release notes](https://ai.google.dev/gemini-api/docs/changelog) document GA Gemini 3.8 Flash TTS/Flash-Lite TTS, a `/v1beta/voices` endpoint, text-based voice design, and consent-verified voice replication. Those voice IDs, permissions, and synthesis models are not interchangeable with OpenAI. Record source permissions and inform listeners about synthetic speech as required.

For conversational systems, test the complete response path with interruptions and network jitter. A high-quality offline sample does not establish a good live-agent experience.
