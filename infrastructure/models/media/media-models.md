# Media models

Media models generate or transform non-text media such as images, video, audio, and speech. Classify them by **input → output modality** rather than by vendor branding.

Important distinctions include native generation versus editing, single-frame versus temporal generation, reference-conditioned generation, resolution and duration limits, controllability, provenance metadata, latency, and safety constraints.

Common capability classes:

- **Text-to-image** — generate an image from textual instructions.
- **Image-to-image** — transform, edit, extend, or restyle an existing image.
- **Text-to-video** — synthesize a video from a textual description.
- **Image-to-video** — use an image as a visual starting condition for generated motion.
- **Video-to-video** — transform an existing video while preserving some source structure.
- **Text-to-speech** — synthesize speech from text.
- **Speech-to-text** — transcribe spoken audio.
- **Speech-to-speech** — transform spoken input into spoken output, potentially without an intermediate user-visible text turn.

Model evaluation should match the modality. Image quality alone does not measure edit fidelity; attractive video frames do not establish temporal consistency.
