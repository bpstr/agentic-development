# Gemini for multimodal source understanding

[Image understanding](https://ai.google.dev/gemini-api/docs/image-understanding) · [Audio understanding](https://ai.google.dev/gemini-api/docs/audio) · [Video understanding](https://ai.google.dev/gemini-api/docs/video-understanding) · [Google Gen AI SDK](https://github.com/googleapis/python-genai)

Gemini's multimodal input capabilities can analyze images, recordings, and video and return text or structured interpretations. This is different from image/video generation, a dedicated transcription-only model, or the Live API's conversational session interface.

Use direct multimodal analysis when the question depends on evidence lost by a transcript or caption, such as a silent state change on screen. Use a dedicated parser or OCR engine when deterministic layout outputs, exact fields, or coordinate-rich extraction are the stronger requirement. Keep model selection in the existing [Google provider coverage](../../../models/providers/google.md).

## Minimal video question

Install `google-genai`, configure `GEMINI_API_KEY`, set `MODEL_ID` to an available video-capable model, and set `VIDEO_FILE` to a permitted local clip. The current video guide uses the Interactions API. This example bounds processing-state polling and attempts upload cleanup:

```python
import logging
import os
import time
from pathlib import Path
from google import genai

source = Path(os.environ["VIDEO_FILE"]).resolve(strict=True)
if not source.is_file():
    raise ValueError("VIDEO_FILE must identify a file")
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
media = client.files.upload(file=str(source))
try:
    deadline = time.monotonic() + 120
    while True:
        state = media.state.name if media.state else "UNKNOWN"
        if state == "ACTIVE":
            break
        if state == "FAILED":
            raise RuntimeError("Provider could not process this video")
        if time.monotonic() >= deadline:
            raise TimeoutError("Video processing did not become ready")
        time.sleep(2)
        media = client.files.get(name=media.name)

    response = client.interactions.create(
        model=os.environ["MODEL_ID"],
        input=[
            {"type": "video", "uri": media.uri, "mime_type": media.mime_type},
            {"type": "text", "text": (
                "Identify visible error dialogs and the relevant timestamps. "
                "Separate what is shown from what is spoken. "
                "Report uncertainty; do not infer actions outside the clip."
            )},
        ],
    )
    print(response.output_text)
finally:
    try:
        client.files.delete(name=media.name)
    except Exception:
        logging.exception("Upload cleanup failed; reconcile the file separately")
```

This invokes a hosted model and can incur charges. The polling deadline is not a timeout for every network call: configure SDK request timeouts and application cancellation separately. File deletion is not a blanket guarantee about all provider-side retention; verify the relevant service terms and configuration.

## Sampling and interpretation

The video documentation distinguishes static frame sampling from model-dependent agentic processing that explores selected parts of the timeline. Their controls and costs differ. Check support in the selected model/API instead of copying a processing option across endpoints.

Image input can support visible-text extraction and visual questions; audio input can support transcription and acoustic questions. Neither a plausible visual answer nor a speaker label is ground truth. Validate important text, values, and timestamps against the original asset.

For recurring search over many assets, persist authorized evidence records and use a retrieval index. Uploading a file for a single question is not equivalent to building a durable, permission-aware multimodal knowledge service.
