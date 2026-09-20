# Image-to-video generation

**Image-to-video generation** uses supplied images to condition a moving sequence. A source image may be the required first frame, a subject reference, or one of several keyframes. Those are different constraints: a reference image does not necessarily appear unchanged in the resulting video.

State which properties should persist and which should move. Product shape, character identity, framing, background, camera position, and motion direction are independent controls. A model can preserve the general subject while still changing lettering, fine geometry, or proportions. [Video pipeline documentation](https://huggingface.co/docs/diffusers/using-diffusers/text-img2vid) describes image-conditioned generation as a distinct task from starting with text alone.

For example:

```text
Use this product photograph as the first frame. Keep the camera and the
notebook fixed. Animate only a gentle movement of the loose ribbon in a
light breeze. Preserve the cover, label, lighting, and background.
```

Evaluate source fidelity and motion quality separately. Compare the opening frame with the reference, then inspect later frames for drift. Test camera motion separately from object motion; a convincing camera orbit requires synthesis of previously unseen surfaces, which may be invented.

When first-and-last-frame conditioning is supported, use it to constrain endpoints while still checking the path between them. Interpolation between two images does not guarantee physically plausible action. Keep source images attached to the generation record, and use accepted frames deliberately when extending clips; repeated extensions can propagate earlier mistakes.
