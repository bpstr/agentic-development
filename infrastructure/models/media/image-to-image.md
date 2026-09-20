# Image-to-image generation

**Image-to-image generation** conditions an output image on one or more supplied images. It includes restyling, composition from references, background replacement, and iterative editing. More specific operations include **inpainting**, which modifies a selected region, and **outpainting**, which extends content beyond existing boundaries.

The defining requirement is preservation under change: requested attributes should change while the relevant identity, layout, or surrounding content remains stable. A reference may control subject appearance, composition, or style; state its role explicitly when supplying several images. In diffusion pipelines, an image-strength control can affect how far the output departs from the input, as described in the [Diffusers image-to-image guide](https://huggingface.co/docs/diffusers/using-diffusers/img2img).

For example:

```text
Use the first image as the unchanged product reference. Replace only the
background with a pale green studio backdrop. Preserve the notebook's
shape, label, binding, scale, and position. Use the second image only as
a lighting reference.
```

Check the preserved region as carefully as the edited one. Small lettering, faces, repeated patterns, and boundaries can drift even when the overall result looks plausible. Mask polarity and strictness differ between APIs, so verify whether a mask is a hard edit boundary or guidance.

Keep the original and each accepted revision. Repeatedly editing an already altered output can accumulate unintended changes. If exact pixels must survive, use a deterministic compositing step for the protected region and generate only the content that actually needs synthesis.
