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

For conversational systems, test the complete response path with interruptions and network jitter. A high-quality offline sample does not establish a good live-agent experience.
