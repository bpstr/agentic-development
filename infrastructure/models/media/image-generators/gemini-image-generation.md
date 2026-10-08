# Gemini image generation

[Official image-generation guide](https://ai.google.dev/gemini-api/docs/image-generation) · [Gemini model catalog](https://ai.google.dev/gemini-api/docs/models)

Gemini's native image-generation capability is branded Nano Banana. The current high-efficiency model is **Nano Banana 2.1** (`gemini-nano-banana-2.1`), released October 6, 2026. It succeeds Gemini 3.1 Flash Image (`gemini-3.1-flash-image`, Nano Banana 2) for new projects, with improved text rendering, multireference consistency, and 1K/2K/4K output. **Nano Banana 2 Lite** (`gemini-3.1-flash-lite-image`) is optimized for speed and cost but not rich multi-reference editing; **Nano Banana Pro** (`gemini-3-pro-image`) targets demanding visual control. The [deprecations catalog](https://ai.google.dev/gemini-api/docs/deprecations) recommends replacing Nano Banana 2 with 2.1 but, as of October 8, does **not** announce a shutdown date for `gemini-3.1-flash-image`. Model choice affects reference limits, controls, supported resolutions, and cost.

With a compatible `google-genai` Python package and `GEMINI_API_KEY` configured, the documented Interactions API exposes generated image data directly:

```python
import base64
from pathlib import Path
from google import genai

client = genai.Client()
interaction = client.interactions.create(
    model="gemini-nano-banana-2.1",
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
