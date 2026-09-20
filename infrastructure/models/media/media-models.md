# Media models

**Media models** generate or transform images, video, audio, and speech. Describe them by input and output modality, then by the conditions they can preserve. A text-to-image model and an image-editing model may share a family name while exposing different controls and failure modes.

The main visual capabilities are:

- **Text-to-image:** create an image from a description.
- **Image-to-image:** transform an existing image or use references to guide a new image.
- **Text-to-video:** create a moving sequence from a description.
- **Image-to-video:** use a supplied image as a frame or visual reference for motion.
- **Video-to-video:** transform an existing sequence while preserving some temporal structure.

Speech synthesis, transcription, and speech-to-speech interaction add audio-specific concerns such as turn timing, speaker identity, and interruption. They should not be inferred from a model's visual capabilities.

For example, a product campaign pipeline can create a still image, obtain approval, animate it, and produce alternative crops. Each stage needs its own source artifact and output version. A language-model response claiming an image exists is not an image artifact.

Represent expensive media work as a job with a request, status, output location, and failure state. Persist returned files before temporary download links expire. Evaluate adherence, edit preservation, temporal consistency, and usable output separately from aesthetic preference. [Diffusers' pipeline documentation](https://huggingface.co/docs/diffusers/using-diffusers/conditional_image_generation) illustrates how model components and generation controls participate in the result.
