# Google Veo

[Official Veo API guide](https://ai.google.dev/gemini-api/docs/veo) · [Google video-model overview](https://ai.google.dev/gemini-api/docs/video)

Veo is Google's video-generation family. The documented Veo 3.1 interface supports text-conditioned generation, image direction, first-and-last-frame control, and extension of generated videos, with native audio. These controls make it useful for workflows with explicit shot and endpoint requirements.

With a compatible `google-genai` package and `GEMINI_API_KEY`, generation returns a long-running operation:

```python
import time
from google import genai

client = genai.Client()
operation = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    prompt="A paper boat drifts across a still pond. Fixed camera, no music.",
)
deadline = time.monotonic() + 300
while not operation.done and time.monotonic() < deadline:
    time.sleep(10)
    operation = client.operations.get(operation)
if not operation.done:
    raise TimeoutError("Waiting stopped; the remote operation may still be running.")
if not operation.response or not operation.response.generated_videos:
    raise RuntimeError("Inspect the operation: no generated video was returned.")
client.files.download(
    file=operation.response.generated_videos[0].video,
    destination="paper-boat.mp4",
)
```

This documentation example is unexecuted and may incur generation charges if run. A production worker should persist the operation identifier, resume polling after restart, and handle error or refusal details. Stopping local polling does not cancel a remote job.

The selected model is explicitly a preview identifier; validate available duration, resolution, aspect ratio, reference-image limits, and pricing for the deployed version. Google's video overview also documents Gemini Omni Flash through a different interface, so its capabilities should not be transferred to Veo automatically.

Inspect the complete clip for subject drift, camera continuity, and audio timing. For reference-conditioned work, compare the first frame and protected product details with the supplied source before accepting an output.
