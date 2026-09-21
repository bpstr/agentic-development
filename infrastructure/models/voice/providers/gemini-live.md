# Gemini Live API

Official documentation: [Gemini model catalog](https://ai.google.dev/gemini-api/docs/models), [Live API overview](https://ai.google.dev/gemini-api/docs/live-api), [GenAI SDK tutorial](https://ai.google.dev/gemini-api/docs/live-api/get-started-sdk), and [ephemeral tokens](https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens). Canonical Python SDK: [googleapis/python-genai](https://github.com/googleapis/python-genai).

Gemini Live provides a bidirectional realtime session for audio, text, and supported visual input with spoken output. It supports conversational capabilities such as interruptions, transcripts, and tool use.

The current Gemini catalog lists **Gemini 3.8 Live** as the default low-latency voice-agent model and **Gemini 3.8 Live Extended Thinking** for interactions that require more background reasoning. The catalog separately lists speech-generation models such as Gemini 2.5 Pro TTS. Verify exact identifiers and lifecycle status in the catalog before deployment.

## Integration boundaries

Gemini Live is a model/session capability, not the browser interface itself. An application still owns:

- microphone permission and capture;
- playback and visible session state;
- ephemeral credential issuance for direct client connections;
- private tool authorization and execution;
- persistence of transcripts, task results, and audit records;
- reconnect and cancellation behavior.

Permanent API keys should not be shipped to a browser. Google documents ephemeral tokens for client-side Live connections.

When a function call arrives, execute only a validated authorized handler and correlate the response to the correct call. Generated or transcribed content is not proof that a business mutation committed.

Test audio capture, codec/sample-rate conversion, output buffering, interruptions, and recovery under real network conditions. See [voice models](../voice-models.md) and [voice turn-taking](../../../../interfaces/voice/voice-turn-taking.md).
