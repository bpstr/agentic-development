# Text-to-video generation

**Text-to-video generation** synthesizes a time-varying visual sequence from a textual description. Some models also generate synchronized audio. The task adds temporal consistency to image-generation requirements: objects must persist, motion must remain plausible, and events must occur in the requested order.

Write a prompt as a short shot description. Identify the subject, environment, camera behavior, action, and any audio separately. One bounded action is easier to evaluate than several unrelated events squeezed into a short clip. The [Diffusers video guide](https://huggingface.co/docs/diffusers/using-diffusers/text-img2vid) describes why video pipelines have additional frame and memory requirements.

For example:

```text
Single continuous shot of a paper boat floating slowly across a shallow
pond. The camera stays fixed at water level. Small ripples move outward
from the boat. Soft morning light; no cuts, no text, no music.
```

Inspect the full sequence, including the beginning and end. A contact sheet can expose changing object shape; playback reveals flicker, acceleration errors, audio timing, and abrupt transitions. Strong individual frames do not establish good motion.

Treat generation as an asynchronous job when the provider returns an operation identifier. Record the model, prompt, duration, aspect ratio, and result before presenting completion. A client timeout is not proof that the remote generation stopped; blindly resubmitting can create duplicate cost. Longer duration and higher quality also increase the amount of output that must be inspected, stored, and delivered.
