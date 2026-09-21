# Gemini Live API

Official documentation: [Live API overview](https://ai.google.dev/gemini-api/docs/live-api), [GenAI SDK tutorial](https://ai.google.dev/gemini-api/docs/live-api/get-started-sdk), and [ephemeral tokens](https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens). Canonical Python SDK: [googleapis/python-genai](https://github.com/googleapis/python-genai).

Gemini Live provides a bidirectional session for audio, text, and visual input with spoken output. It supports conversational features including interruptions, transcripts, and tool use. Its native client and server integrations use WebSockets; partner integrations can supply other media connections.

## Basic setup

Install the Google GenAI Python SDK and configure `GEMINI_API_KEY` in the server environment:

```bash
python -m pip install google-genai
```

This small server-side example sends text to a Live session and reports received audio bytes. It demonstrates session input and output without microphone capture or playback:

```python
import asyncio
import os
from google import genai

async def main():
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    async with client.aio.live.connect(
        model="gemini-3.8-live",
        config={"response_modalities": ["AUDIO"]},
    ) as session:
        await session.send_realtime_input(text="Say that the release review is ready.")
        async with asyncio.timeout(30):
            async for response in session.receive():
                content = response.server_content
                if content and content.model_turn:
                    for part in content.model_turn.parts:
                        if part.inline_data:
                            print("Audio bytes:", len(part.inline_data.data))

asyncio.run(main())
```

This example requires Python 3.11 or later for `asyncio.timeout`. The model identifier matches the linked tutorial; use a model available to the intended project and check its current capabilities before deployment. The connection context closes when the example ends or raises.

For browser-to-provider connections, mint ephemeral credentials through an authenticated backend. Permanent API keys should not be shipped to the browser. Keep a server integration when tools or policy checks must remain private.

Implement audio capture, codec/sample-rate conversion, output buffering, and interruption handling using the complete official example. When a function call arrives, execute only a validated authorized handler and return its call identifier with the result. Persist useful transcripts and task outcomes independently of the Live connection, and recover session state deliberately after disconnection.
