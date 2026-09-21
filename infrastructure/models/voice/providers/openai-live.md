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
