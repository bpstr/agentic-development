# Gemini tool execution

[Official function calling](https://ai.google.dev/gemini-api/docs/function-calling) · [Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search) · [Code execution](https://ai.google.dev/gemini-api/docs/code-execution)

Gemini supports custom function declarations and built-in tools. Function calling requests an application operation; built-in tools such as Google Search execute through Google's supported service path.

## Enable search grounding

The current Interactions API uses a typed tool declaration. Install `google-genai`, configure `GEMINI_API_KEY`, and choose a supported `GEMINI_MODEL`:

```python
import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
interaction = client.interactions.create(
    model=os.environ["GEMINI_MODEL"],
    input="Find the official Python release schedule and cite it.",
    tools=[{"type": "google_search"}],
)
print(interaction.output_text)
```

This performs a live request when run. Search-related steps and inline annotations carry information needed for grounded presentation; retain them rather than reducing the complete result to a string.

## Match the endpoint's schema

Interactions examples and `generateContent` examples use different tool and response representations. Use the function declaration, result correlation, and continuation fields from the endpoint being called.

Custom functions should receive narrow, validated arguments and resolve the caller's identity from trusted application state. SDK automatic function calling, where supported, moves dispatch into SDK code; it does not turn that code into a Google-hosted operation.

Built-in search, code execution, and other tools have model-specific compatibility and combination rules. Validate the combination required by the application. Public search grounding does not automatically search private workspace records; expose those through an authorized retrieval service or custom tool.
