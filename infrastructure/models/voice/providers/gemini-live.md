# Gemini Live API

Official documentation: [Gemini model catalog](https://ai.google.dev/gemini-api/docs/models), [Live API overview](https://ai.google.dev/gemini-api/docs/live-api), [GenAI SDK tutorial](https://ai.google.dev/gemini-api/docs/live-api/get-started-sdk), and [ephemeral tokens](https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens). Canonical Python SDK: [googleapis/python-genai](https://github.com/googleapis/python-genai).

Gemini Live provides a bidirectional realtime session for audio, text, and supported visual input with spoken output. It supports conversational capabilities such as interruptions, transcripts, and tool use.

The current Gemini catalog lists **Gemini 3.8 Live** as the default low-latency voice-agent model and **Gemini 3.8 Live Extended Thinking** for interactions that require more background reasoning. Speech recognition and synthesis are also exposed as separate model surfaces: **Gemini 3.5 Transcribe** / **Transcribe Live** for STT and **Gemini 3.8 Flash TTS** / **Gemini 3.8 Flash-Lite TTS** for speech generation. Verify exact identifiers, preview status, and lifecycle state in the catalog before deployment.

## Camera and voice in the same session

The [Live capabilities guide](https://ai.google.dev/gemini-api/docs/live-api/capabilities) documents audiovisual input, not just a consumer-app camera feature. Its current API is marked Preview. [Bidirectional WebSockets](https://ai.google.dev/gemini-api/docs/live-api/get-started-websocket) carry microphone audio, text, and camera or screen frames while the session returns audio.

Video is submitted as individual JPEG/PNG images, currently at most one frame per second. Native audio input is little-endian 16-bit PCM at 16 kHz; output is PCM at 24 kHz. This scoped Python SDK excerpt assumes an already connected Live session and already encoded capture data; it does not implement capture, scheduling, or playback:

```python
from typing import Any
from google.genai import types

async def send_microphone_chunk(session: Any, pcm16: bytes) -> None:
    await session.send_realtime_input(
        audio=types.Blob(data=pcm16, mime_type="audio/pcm;rate=16000")
    )

async def send_camera_frame(session: Any, jpeg: bytes) -> None:
    await session.send_realtime_input(
        video=types.Blob(data=jpeg, mime_type="image/jpeg")
    )
```

Run audio capture, frame sampling, and response consumption independently, as illustrated by the [official live-audio/video example](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.py). Bound queues instead of letting video processing delay microphone delivery. Recheck the capability guide's session limits and resumption/compression options for the deployed model.

A sampled camera stream is not full-frame-rate perception. Preserve capture timestamps in application records, discard superseded frames, and test questions about changing scenes rather than only static images. This is live **understanding** with spoken output, not generated video; [video-file understanding](../../../knowledge/multimodal/video-understanding.md) is another integration path.

## Integration boundaries

Gemini Live is a model/session capability, not the browser interface itself. An application still owns:

- microphone, camera, and screen-capture permissions;
- playback and visible session state;
- ephemeral credential issuance for direct client connections;
- private tool authorization and execution;
- persistence of transcripts, task results, and audit records;
- reconnect and cancellation behavior.

Permanent API keys should not be shipped to a browser. Google documents ephemeral tokens for client-side Live connections.

When a function call arrives, execute only a validated authorized handler and correlate the response to the correct call. Generated or transcribed content is not proof that a business mutation committed.

Test audio capture, codec/sample-rate conversion, output buffering, interruptions, and recovery under real network conditions. See [voice models](../voice-models.md) and [voice turn-taking](../../../../interfaces/voice/voice-turn-taking.md).
