# Image understanding and image-to-text

Image understanding derives information from pixels. Image-to-text is an umbrella for several different tasks: recognizing visible characters, describing a scene, answering a visual question, or extracting a structured representation. Specify the task rather than requesting a generic description and assuming it preserves everything.

## Distinguish the tasks

**OCR** recovers visible writing. **Captioning** generates a selective description. **Visual question answering (VQA)** answers a particular question using the image. **Object detection** proposes labeled regions, while **segmentation** assigns pixels to regions. **Structured visual extraction** combines observations into fields, tables, chart series, or diagram relationships. These outputs have different validation requirements.

[OpenAI's vision guide](https://developers.openai.com/api/docs/guides/images-vision) and [Gemini image understanding](https://ai.google.dev/gemini-api/docs/image-understanding) document general-purpose vision-language input. Such models can read text and discuss visual content, but their generated answer is not a lossless OCR record. Small text, rotation, dense plots, and precise spatial relationships require representative tests.

For a screenshot containing an error dialog and a chart, keep three distinct outputs: the exact visible error text, a description of the chart, and the interpretation that the error might affect the chart. Only the first is a transcription; the last needs corroboration.

## Extract deliberately

Retain the original dimensions and orientation. Run OCR when exact labels or identifiers matter, and use a vision-language model for relationships that text alone cannot capture. Supply both a full-image view and selected crops when context and small details are important. Record how each crop maps to the original coordinates.

An extraction prompt should request only visible evidence, allow unknown values, and separate observations from interpretation. For example:

```text
Extract the visible labels and describe how the diagram's boxes connect.
Do not infer hidden steps or business rules.
Separate verbatim text from your interpretation.
Mark unreadable labels as unknown and identify the relevant region.
```

A requested region is not automatically an accurate bounding box. Validate model-produced geometry against the image; prefer detector/OCR coordinates when their contract fits the task.

For charts, preserve title, axis labels, units, scale, legend, and source crop. Estimated values read from pixels must not be presented as original numerical data. For diagrams, edge direction and label placement matter: proximity alone is not proof of a relationship. [Docling enrichments](https://docling-project.github.io/docling/usage/enrichments/) and [PaddleOCR](https://www.paddleocr.ai/main/en/index.html) provide more specialized document-processing components.

## Retrieval and evaluation

Index OCR and descriptions separately when their provenance differs. A short caption makes an image searchable but can omit the detail a later question needs. [CLIP](https://github.com/openai/CLIP) instead maps text and images into a compatible embedding space; it does not produce a textual description. Use retrieved images as evidence for a second, question-specific inspection.

Test low resolution, rotated labels, mixed languages, nearly identical screenshots, dense tables, and charts whose meaning depends on color or scale. Measure exact identifiers and extracted fields as well as broad descriptive usefulness. A photo or voice accompanying an image does not establish a person's identity, health, or intent.
