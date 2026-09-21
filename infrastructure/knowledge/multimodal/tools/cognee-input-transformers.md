# Cognee input transformers and loaders

[Official documentation](https://docs.cognee.ai/) · [Python lifecycle](https://docs.cognee.ai/getting-started/quickstart) · [Loader registry](https://github.com/topoteretes/cognee/blob/663a2dc15d04bc0d7ec2733a2dd604b7ed1b8c8e/cognee/infrastructure/loaders/supported_loaders.py) · [Loader engine](https://github.com/topoteretes/cognee/blob/663a2dc15d04bc0d7ec2733a2dd604b7ed1b8c8e/cognee/infrastructure/loaders/LoaderEngine.py)

Cognee's input transformers are implemented as file loaders and adapters: they make heterogeneous sources usable by the ingestion, chunking, and knowledge pipeline. This use of “transformer” describes a data conversion step, not a neural Transformer architecture.

The behavior below is grounded in source revision `663a2dc`; an installed release may differ. Verify its registry and implementation rather than assuming a format listed in a product overview follows the same path.

## What each path actually preserves

| Input path | Inspected behavior | Boundary to preserve outside the adapter |
| --- | --- | --- |
| PDF | Core PyPDF loader; optional advanced, Unstructured, and Docling adapters | A native-text route is not evidence that scans or figures were analyzed |
| Image | Vision-language extraction, optionally appended OCR text | Raw image, OCR regions/scores, and separate interpretations |
| Audio | Speech transcription into the document pipeline | Original audio and any timing/speaker information required downstream |
| Video | Audio-track transcription, with inline segment-start timestamps when available | Visual frames, event intervals, and accurate source-time mapping |
| Docling | Convert to a DoclingDocument, then export to plain text | Structured document JSON, tables, hierarchy, and page provenance |

The [image loader](https://github.com/topoteretes/cognee/blob/663a2dc15d04bc0d7ec2733a2dd604b7ed1b8c8e/cognee/infrastructure/loaders/core/image_loader.py) uses a vision model. `IMAGE_OCR_ENABLED=true` additionally runs local RapidOCR. Its OCR append step keeps recognized strings but discards the OCR engine's boxes and scores; it also caps appended text. Do not describe this output as a lossless OCR artifact.

`IMAGE_EXTRACTION_ENABLED=false` changes the extraction-oriented prompt back to the legacy caption prompt; it does not disable the vision call. Optional EXIF extraction may expose location and camera information. Optional perceptual hashing uses process-local state in this implementation, not a durable, tenant-aware deduplication service.

The [video loader](https://github.com/topoteretes/cognee/blob/663a2dc15d04bc0d7ec2733a2dd604b7ed1b8c8e/cognee/infrastructure/loaders/core/video_loader.py) extracts audio with FFmpeg when available. It attempts segmented transcription, but can fall back to text without timestamps. It does not analyze visual frames. A searchable transcript of a screen recording therefore cannot establish that a silent UI change happened.

## Setup and routing

Install only the extras needed by the selected route. The inspected adapter documents these examples:

```bash
python -m pip install "cognee[rapidocr,docling-full]"
export IMAGE_OCR_ENABLED=true
```

The [Docling adapter](https://github.com/topoteretes/cognee/blob/663a2dc15d04bc0d7ec2733a2dd604b7ed1b8c8e/cognee/infrastructure/loaders/external/docling_loader.py) distinguishes the slim `cognee[docling]` installation from `docling-full`, which includes the model stack needed for PDF/image conversion. Model downloads and provider credentials are separate setup requirements.

Loader selection checks registered adapters, detected type, extension, and priority. Preferred loaders are considered first, but missing preferred adapters can fall back to defaults. Installing Docling alone does not mean every PDF uses it: PyPDF precedes it in the inspected default priority. Verify the selected loader in logs and with a representative fixture.

## Ingestion and retrieval

The current public quickstart uses `remember` and `recall`. In an isolated development environment with provider configuration already set, this demonstrates the public lifecycle for a chosen source:

```python
import asyncio
import os
from pathlib import Path
import cognee

async def main() -> None:
    source = Path(os.environ["SOURCE_FILE"]).resolve(strict=True)
    if not source.is_file():
        raise ValueError("SOURCE_FILE must identify a file")
    await cognee.remember(str(source))
    results = await cognee.recall(
        query_text="What evidence does the source contain about release blockers?"
    )
    for result in results:
        print(result.text)

if __name__ == "__main__":
    asyncio.run(main())
```

This can call paid models. It does not configure tenant isolation, force a particular loader, or guarantee preservation of multimodal metadata. Older `add`/`cognify`/`search` examples must be matched to their installed SDK generation rather than mixed into this lifecycle blindly.

For richer evidence, preprocess with [Docling](../../document-intelligence/tools/docling.md), an OCR engine, or an audio/video pipeline; save structured artifacts and source locators, then ingest suitable text projections. Keep the source-to-chunk mapping available to retrieval. Test an image with exact identifiers, a scanned PDF, a silent video, and a transcription without timestamps before claiming equivalent understanding across formats.
