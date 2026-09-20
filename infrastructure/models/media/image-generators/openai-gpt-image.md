# OpenAI GPT Image

[Official image-generation guide](https://developers.openai.com/api/docs/guides/image-generation) · [Sunburst specification](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) · [Flare specification](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare)

GPT Image provides text-to-image generation and image editing. The documented GPT Image 2.5 options are Sunburst for editing precision and Flare for faster everyday generation. A direct Image API call selects the image model itself; the Responses API instead combines a supported mainline model with an image-generation tool.

Install the `openai` Python package and supply `OPENAI_API_KEY` through the environment. This documentation example generates a source image and then edits it; it makes two billable requests if executed:

```python
import base64
from pathlib import Path
from openai import OpenAI

client = OpenAI()
model = "gpt-image-2.5-sunburst"
created = client.images.generate(
    model=model,
    prompt="A blue notebook on a plain warm white background, no text.",
)
Path("notebook.png").write_bytes(base64.b64decode(created.data[0].b64_json))

with open("notebook.png", "rb") as source:
    edited = client.images.edit(
        model=model,
        image=source,
        prompt="Change only the background to pale green; preserve the notebook.",
    )
Path("notebook-edited.png").write_bytes(base64.b64decode(edited.data[0].b64_json))
```

The guide describes output size, quality, formats, and masked edits. Validate the selected model's settings instead of transferring constraints from older GPT Image releases. Handle refusals and absent outputs before persisting an artifact in production.

Evaluate both the requested change and preservation of the source. For an exact label or protected logo, inspect lettering and geometry after editing. Keep accepted source files and request parameters together; rerunning a prompt is not a substitute for storing the original image. Account for image input/output usage and any mainline-model usage when comparing direct generation with a conversational tool workflow.
