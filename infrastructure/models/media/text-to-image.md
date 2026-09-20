# Text-to-image generation

**Text-to-image generation** produces an image conditioned on a textual description and supported generation controls. The output is sampled: the prompt specifies desired content but does not define exact pixels. Models may use diffusion, flow-based, autoregressive, or combined mechanisms; the capability name does not identify the architecture.

Specify the visual subject, spatial relationships, composition, style, lighting, and intended aspect ratio. Separate these requirements from file properties such as dimensions, format, and transparency, which may need explicit API settings. [Diffusers' text-to-image guide](https://huggingface.co/docs/diffusers/using-diffusers/conditional_image_generation) describes model-specific controls such as guidance and sampling steps.

An example brief is:

```text
Create a square product illustration of a blue notebook on a warm white
surface. Place a graphite pencil diagonally beside it. Use soft daylight
from the upper left and leave the upper third visually empty for a title.
No text or logos inside the image.
```

Evaluate every requirement independently: correct objects, relative placement, usable empty space, and absence of unintended lettering. A beautiful image can still fail the brief.

Where a seed is supported, record it alongside the model revision and settings. A seed alone does not guarantee identical output after changing runtime, precision, or provider. Use deterministic drawing tools for exact geometry and data charts. When a generated image becomes the basis for later edits, retain that original file as the reference instead of regenerating it from the same prompt and assuming identity.
