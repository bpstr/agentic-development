# Gemini image generation

[Official image-generation guide](https://ai.google.dev/gemini-api/docs/image-generation) · [Gemini model catalog](https://ai.google.dev/gemini-api/docs/models)

Gemini's native image-generation capability is branded Nano Banana. It supports creating and editing images through conversational input. The guide distinguishes the general Gemini 3.1 Flash Image model from Lite and Pro variants; model selection affects reference handling, editing behavior, and resource use.

With a compatible `google-genai` Python package and `GEMINI_API_KEY` configured, the documented Interactions API exposes generated image data directly:

```python
import base64
from pathlib import Path
from google import genai

client = genai.Client()
interaction = client.interactions.create(
    model="gemini-3.1-flash-image",
    input="Create an editorial illustration of a blue notebook and a pencil.",
)
if interaction.output_image is None:
    raise RuntimeError("The response did not contain an image.")
Path("notebook.png").write_bytes(
    base64.b64decode(interaction.output_image.data)
)
```

For image editing, provide the source image as an image part together with instructions. Preserve the original artifact and the conversation state required by the chosen interface.

The `output_image` convenience property exposes the last generated image; interleaved text-and-image responses require inspecting the full output structure. Generated images include SynthID provenance. Neither provenance marking nor a visually polished result establishes the truth of depicted facts.

For a campaign workflow, compare a clean generation with a later background-only edit and a multi-reference composition. Evaluate subject consistency and lettering separately. A general Gemini model's ability to understand images does not establish that it can generate them; select a documented image model explicitly.
