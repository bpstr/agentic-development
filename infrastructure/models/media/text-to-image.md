# Text-to-image generation

Text-to-image generation maps a natural-language prompt and optional generation controls to one or more images.

Production evaluation should consider prompt adherence, composition, text rendering, spatial relationships, identity consistency where permitted, output resolution, latency, cost, and editability. Aesthetic preference is only one dimension.

Text-to-image systems may be exposed through a dedicated image API or as a tool callable by a multimodal model. Those interfaces have different state, streaming, and orchestration behavior.
