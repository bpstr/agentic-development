# Stable Diffusion

[Official Stable Diffusion 3.5 repository](https://github.com/Stability-AI/sd3.5) · [Publisher model card](https://huggingface.co/stabilityai/stable-diffusion-3.5-large)

Stable Diffusion is a family of image-generation models with downloadable weights and an ecosystem of inference pipelines and editing tools. Stable Diffusion 3.5 Large is a documented text-to-image example using a multimodal diffusion Transformer. The family name does not guarantee compatibility between generations, adapters, or checkpoints.

The publisher demonstrates local generation through Diffusers:

```python
import torch
from diffusers import StableDiffusion3Pipeline

pipe = StableDiffusion3Pipeline.from_pretrained(
    "stabilityai/stable-diffusion-3.5-large",
    torch_dtype=torch.bfloat16,
).to("cuda")
image = pipe(
    "A blue notebook on a pale green studio background, no text",
    num_inference_steps=28,
    guidance_scale=3.5,
).images[0]
image.save("notebook.png")
```

Running this documentation example requires model access, suitable GPU memory, and compatible PyTorch, Diffusers, Transformers, and Accelerate packages. The model card explains access conditions and quantization alternatives; this is not a recorded hardware test.

For a repeatable visual workflow, pin the weight revision and record the scheduler, sampling steps, precision, seed where supported, and any adapters. An attractive community checkpoint can introduce different behavior or additional licensing conditions.

The model card identifies the Stability Community License for this artifact. Check its conditions before deploying or redistributing weights. Evaluate text rendering, spatial relationships, and editing preservation separately from overall image appeal; an image that looks realistic may still contain incorrect text or object geometry.
