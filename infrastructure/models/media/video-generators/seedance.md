# Seedance video models

[Official Seedance 2.5 overview](https://seed.bytedance.com/en/seedance2_5) · [Seedance 2.0 architecture overview](https://seed.bytedance.com/en/seedance2_0)

Seedance is ByteDance's video-generation family. Seedance 2.0 describes joint audio-video generation with text, image, audio, and video conditioning; the 2.5 overview emphasizes longer narratives, reference control, and editing. These are version-specific capabilities rather than a universal contract for every endpoint carrying the Seedance name.

The distinction between conditioning types matters. A product image can establish appearance, a reference clip can suggest camera behavior, and an audio track can constrain timing. Specify the role of each reference instead of assuming that the model will preserve every aspect of every input.

For example, evaluate a short product clip with a fixed notebook reference and a slow camera move. Inspect whether the cover label remains stable, the camera follows the requested path, and generated sound matches the visible action. A sequence with impressive motion can still fail a product-fidelity requirement.

The official overview includes demonstrations and internal evaluation claims; it does not establish your application's quality or latency. Before implementation, verify the exact serving platform's model ID, supported controls, asynchronous job format, duration, resolution, and pricing. A third-party compatible API is not evidence of ByteDance's native request schema.

Persist reference files, request parameters, and completed outputs. For extensions or successive edits, use accepted outputs deliberately and inspect cumulative drift. Local timeout and cancellation semantics need explicit integration handling because remote media generation can continue after the caller stops waiting.
