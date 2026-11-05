# OpenAI GPT Image

[Official image-generation guide](https://developers.openai.com/api/docs/guides/image-generation) · [Sunburst specification](https://developers.openai.com/api/docs/models/gpt-image-2.6-sunburst) · [Flare specification](https://developers.openai.com/api/docs/models/gpt-image-2.6-flare)

GPT Image provides text-to-image generation and image editing. The current GPT Image 2.6 options are Sunburst for detailed visual work and Flare for faster iteration; GPT Image 2.5 remains a previous generation. A direct Image API call selects the image model itself; the Responses API instead combines a supported mainline model with an image-generation tool.

Install the `openai` Python package and supply `OPENAI_API_KEY` through the environment. This documentation example generates a source image and then edits it; it makes two billable requests if executed:

```python
import base64
from pathlib import Path
from openai import OpenAI

client = OpenAI()
model = "gpt-image-2.6-sunburst"
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

## GPT Image 2.6 controls and output types

The [GPT Image generation guide](https://developers.openai.com/api/docs/guides/image-generation) documents the November 4, 2026 GPT Image 2.6 release. For Sunburst and Flare, the `complexity` control (`low`, `medium`, `high`; default `high`) changes planning effort separately from image `quality`. Lower settings can help focused edits; higher settings may help dense layouts but can increase latency and unintended changes. Evaluate preservation and latency at the chosen setting rather than copying a previous model's parameters.

Markup-guided editing accepts a visual `markup` overlay to identify the region to change; it is not the same as a pixel mask and cannot be combined with `mask` or `prompt_rewriter`. Retain the original image and the markup when auditing edit preservation.

The **Images API generation endpoint** also supports these *distinct output contracts* for GPT Image 2.6:

- `output_format: "svg"` returns base64-encoded UTF-8 static vector XML, generated through a reference image and an authoring model. Set `n=1`; SVG output is generation-only, with no streaming, partial images, compression, or SVG edit input. Account for both reference-image and authoring-model usage.
- `output_format: "gif"` returns a completed base64-encoded animation, not a video or streamed frames. `frame_count` accepts 2–64; `frame_duration_ms` accepts 20–2000 ms. Size refers to each frame and must fit total pixel limits. GIF is generation-only and does not support partial-image streaming or `prompt_rewriter`.

Decode and persist the returned bytes using the matching extension, verify content type and artifact integrity before serving, and enforce practical limits for animated frame count and output dimensions. Treat `safety_identifier` as the privacy-preserving replacement for the deprecated Images API `user` parameter, using a stable pseudonymous value instead of raw personal identifiers.
