# Optical character recognition

Optical character recognition (OCR) converts text represented as pixels into machine-readable characters. It is useful for scans, photographs, and image-only PDF pages. Recognition may also estimate word locations, but it does not automatically reconstruct document meaning or table structure.

Prefer native text extraction when a document already contains a reliable text layer. Rasterizing clear digital text and recognizing it again introduces unnecessary opportunities for errors. For scanned content, image resolution, skew, contrast, language, and page segmentation affect recognition quality. [Tesseract's quality guide](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html) describes these preprocessing and segmentation concerns.

For example, an invoice number `INV-1008` can be misread as `INV-IOO8`. Preserve the image region and original OCR output, then validate the candidate against the expected identifier format or source system. A language model's correction should remain distinguishable from directly recognized text.

Keep confidence and coordinates where the engine supplies them, while recognizing that confidence is not a universal probability of correctness. Verify critical amounts, dates, and identifiers against the rendered source.

Process pages independently when content types differ. A mixed PDF may contain both native text and scanned attachments. Applying one extraction method to the entire file can silently omit the attachments or duplicate an existing OCR layer.

## Representative implementations

| Implementation | Role | Selection boundary |
| --- | --- | --- |
| [Tesseract](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html) | Local text recognition with text, TSV, hOCR, and searchable-PDF outputs | Language data and page segmentation matter; not a general visual reasoner |
| [PaddleOCR](https://www.paddleocr.ai/main/en/index.html) | Text detection/recognition plus separate document-structure and vision-language pipelines | Choose the actual module, checkpoint, and runtime rather than treating the whole project as one model |
| RapidOCR in [Cognee's image loader](https://github.com/topoteretes/cognee/blob/663a2dc15d04bc0d7ec2733a2dd604b7ed1b8c8e/cognee/infrastructure/loaders/core/image_loader.py) | Optional local OCR appended to vision-generated text | The inspected adapter drops boxes/scores and caps appended text |
| [Google Document AI](https://docs.cloud.google.com/document-ai/docs/overview) | Hosted document processors, including OCR and structured extraction | Processor type, region, supported input, and access policy are deployment decisions |
| [Mistral document processing](https://docs.mistral.ai/studio/document-processing/basic_ocr) | Hosted OCR/document conversion for model-ready document content | Verify the current API/output schema and model; generated structure still needs validation |

[Docling](tools/docling.md) and [Unstructured](tools/unstructured.md) are higher-level conversion/partitioning tools that can incorporate OCR. They are not interchangeable with a bare recognizer: layout recovery, tables, reading order, and serialization add separate stages.

## Minimal local extraction

With Tesseract and the intended language data installed, the following writes recognized text and a coordinate-bearing TSV artifact:

```bash
tesseract page.png stdout -l eng > page.txt
tesseract page.png stdout -l eng tsv > page.tsv
```

Choose installed language packs matching the source; `eng` is an example, not a multilingual default. Keep the source dimensions and any rotation/crop transform so TSV coordinates can be interpreted correctly. Searchable PDF or hOCR are alternative representations when their layout contract is useful.

## Quality gates

Evaluate character/word error alongside critical-field exact match, page coverage, and location accuracy. A mostly correct paragraph can conceal a wrong account number. Include handwriting, rotated text, low contrast, unusual fonts, and mixed scripts only when they are part of the intended scope; never infer coverage from a broad language count.

Do not silently repair uncertain values through generative completion. Preserve the raw observation, proposed correction, and validation outcome. Route unresolved high-impact fields for review or source-system verification before they become facts in a knowledge graph.
