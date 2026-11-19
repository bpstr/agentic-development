# Document understanding

Document understanding extracts usable semantic structure from files such as PDFs, office documents, scans, forms, and images. It combines native text extraction, layout analysis, table reconstruction, vision models, and optical character recognition according to the source.

Separate recovering content from interpreting it. A parser may identify the words “Payment due” and a nearby date; deciding that the date is the invoice deadline is a further extraction step. Preserve the original text and location alongside the interpreted field.

For an invoice, retain page number, bounding box, field label, currency, and source revision. That lets a reviewer inspect whether a total came from the invoice body, a previous balance, or an unrelated footer. A single flattened text string can lose those distinctions.

The [pypdf extraction guide](https://pypdf.readthedocs.io/en/stable/user/extract-text.html) explains why positioned PDF text does not reliably encode reading order or semantic structure. Prefer native extraction when a usable text layer exists; apply OCR to image content or unusable embedded text.

Evaluate the extracted structure against rendered pages. Include rotated scans, repeated headers, multiple columns, and continuation tables. A plausible summary can conceal missing pages or reordered content, so downstream generation should receive extraction warnings and source coordinates rather than an unexplained clean-looking transcript.

## Build a structured representation

| Stage | Result to retain | Example implementation |
| --- | --- | --- |
| Native parsing | Text and source objects without unnecessary rasterization | pypdf and format-specific parsers |
| OCR | Visible text, regions, and available engine scores | [OCR engines](ocr.md) |
| Layout analysis | Reading order, headings, body/furniture, and element boundaries | [Docling](tools/docling.md), [Unstructured](tools/unstructured.md) |
| Table reconstruction | Rows, columns, headers, merged spans, units, and page links | [Table extraction](table-extraction.md) |
| Visual interpretation | Figure descriptions, chart meaning, candidate diagram relationships | [Image understanding](../multimodal/image-understanding.md) |
| Retrieval preparation | Structure-aware chunks and provenance | [Multimodal retrieval](../retrieval/multimodal-retrieval.md) |

The [DoclingDocument model](https://docling-project.github.io/docling/concepts/docling_document/) and [Unstructured elements](https://docs.unstructured.io/open-source/core-functionality/partitioning) provide two concrete intermediate representations. Retain structured artifacts before converting them to plain text for an embedding model or downstream adapter.

For a spreadsheet or slide deck, parse native objects where useful rather than assuming a screenshot is the richest source. Preserve sheet/cell or slide/object identity alongside the human-readable projection. A rendered chart may omit formulas and source values that remain available in the original file.

## Specialized extraction

Handwriting recognition, formula recognition, chart-to-data extraction, and form key-value extraction are related but distinct tasks. [PaddleOCR](https://www.paddleocr.ai/main/en/index.html), [Docling enrichments](https://docling-project.github.io/docling/usage/enrichments/), and [Google Document AI](https://docs.cloud.google.com/document-ai/docs/overview) provide representative components. Enable a specialized route only when its output improves the actual task, and evaluate it against source-grounded fields rather than a plausible-looking Markdown rendering.

For graph ingestion, attach extracted entities and relationships to the page/region that supports them. An uncertain interpretation should not become a durable relationship merely because it can be serialized.

## Gemini selective Office and PDF processing

Since [November 18, 2026](https://aistudio.google.com/docs/changelog), the [Gemini document-processing API](https://aistudio.google.com/docs/document-processing#customize-document-processing) accepts supported Word/PowerPoint/Excel and OpenDocument files directly, not just PDFs and plain-text conversions. On Gemini 3 and 4+ models, Interactions `document` input and eligible function results accept a `processing` selector for a **subset** of content. For PDFs, documents, and decks, `page_options` accepts 1-indexed inclusive `start_page`/`end_page` and `content_layers` of `page_text` and/or `page_image`. For spreadsheets, `spreadsheet_options` accepts 1-indexed `sheet_index`, an A1 `visible_cells` range, and `content_layers` of `data`, `formulas`, and/or `visual`.

For example, this is an **illustrative Interactions input part**, not a complete SDK request:

```json
{
  "type": "document",
  "uri": "https://generativelanguage.googleapis.com/v1beta/files/FILE_ID",
  "mime_type": "application/pdf",
  "processing": {
    "type": "static",
    "page_options": {
      "start_page": 3,
      "end_page": 7,
      "content_layers": ["page_text", "page_image"]
    }
  }
}
```

Google bills model tokens for selected slices rather than the complete source sent to the model, but the **whole-file size and page limits still apply**. For large Office reports, use text layers to locate relevant pages, then inspect page images where charts or layout matter. For spreadsheets, retain both formula and computed-value provenance. Do not claim an unselected page or tab was reviewed; preserve original file revision, selected range/layer, and any extraction limitations. A hosted interpretation does not replace deterministic native parsing for exact formulas, cell values, or audit-grade coordinates.
