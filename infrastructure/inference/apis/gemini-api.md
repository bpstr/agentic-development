# Gemini API

[Official getting-started guide](https://ai.google.dev/gemini-api/docs/get-started) · [Google Gen AI Python SDK](https://github.com/googleapis/python-genai) · [Function calling](https://ai.google.dev/gemini-api/docs/function-calling)

The Gemini API provides model inference and supported tools through Google-managed endpoints. Its current getting-started guide uses the Interactions API, with typed steps and optional server-side continuation. Older `generateContent` examples use a different request and response contract.

## Minimal setup

Install `google-genai` in a Python environment. Configure `GEMINI_API_KEY` and set `GEMINI_MODEL` to a model supported by the Interactions endpoint:

```python
import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
interaction = client.interactions.create(
    model=os.environ["GEMINI_MODEL"],
    input="Explain idempotency in one sentence.",
)

print(interaction.id)
print(interaction.output_text)
```

This example performs a network request when run. The text helper is useful for presentation; inspect the interaction's typed steps for tools, media, and supporting annotations.

## Continue the interaction

The Interactions guide demonstrates `previous_interaction_id` for server-side conversation state and `store=False` with manually preserved history when the application owns continuation. Choose one coherent approach; keep the application conversation identity separate.

Gemini also distinguishes custom functions from built-in tools such as Google Search. A function declaration describes an operation for a dispatcher; declaring it does not grant access to the application's data. Return results using the correlation fields and input types of the API in use.

Google AI Studio/Gemini API credentials and Vertex AI deployment configuration are different integration choices. Check the selected endpoint's model availability, authentication, and supported features instead of assuming that an SDK method makes every backend interchangeable.
