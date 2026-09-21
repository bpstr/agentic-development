# Docling

[Official documentation](https://docling-project.github.io/docling/) · [Canonical repository](https://github.com/docling-project/docling) · [Minimal conversion](https://docling-project.github.io/docling/_generated/examples/minimal/) · [Document model](https://docling-project.github.io/docling/concepts/docling_document/)

Docling converts source files into a structured DoclingDocument. Its role is document parsing and preparation: text, hierarchy, tables, pictures, and available provenance can be retained before serialization or retrieval. This is more than running OCR over every page.

Choose it when document structure affects the answer, such as multi-column reports, tables, or figures connected to surrounding text. The selected pipeline and input determine which fields are available; a unified schema does not guarantee perfect layout recovery.

## Convert without discarding structure

Install in a virtual environment:

```bash
python -m pip install docling transformers
```

For a local document, retain structured JSON alongside a readable projection:

```python
import sys
from pathlib import Path
from docling.document_converter import DocumentConverter

source = Path(sys.argv[1]).resolve(strict=True)
if not source.is_file():
    raise ValueError("Expected a document file")
output = Path("docling-output")
output.mkdir(exist_ok=True)

document = DocumentConverter().convert(str(source)).document
document.save_as_json(output / "document.json")
(output / "document.md").write_text(
    document.export_to_markdown(), encoding="utf-8"
)
```

The [serialization API](https://docling-project.github.io/docling/reference/docling_document/) supports structured export. Retain the original source too: exported JSON contains the extracted representation, not proof that every original detail was recovered. Inspect conversion status, warnings, and selected pages before admitting the result to a production index. Provision model artifacts before offline execution and review any remote-model configuration.

## Prepare retrieval input

[Hybrid chunking](https://docling-project.github.io/docling/_generated/examples/hybrid_chunking/) refines document-structured chunks using a tokenizer. Continuing with `document` above:

```python
from docling.chunking import HybridChunker

chunker = HybridChunker()
for index, chunk in enumerate(chunker.chunk(dl_doc=document)):
    text_for_embedding = chunker.contextualize(chunk=chunk)
    print(index, text_for_embedding)
```

Match the chunker tokenizer and budget to the embedding model in production. Store each chunk's source references beside its embedding, then retrieve through the chosen search/vector service. Docling prepares the representation; it does not by itself provide a persistent vector database or an answering agent. Keep table headers and relevant figure captions with their chunks rather than using arbitrary character slices.

## Optional analysis and integration limits

[Enrichments](https://docling-project.github.io/docling/usage/enrichments/) add capabilities such as formula/code processing and picture descriptions. [Audio/video processing](https://docling-project.github.io/docling/usage/processing_audio_media/) distinguishes ASR-only processing from a dedicated video pipeline with sampled visual content. Install and configure those capabilities explicitly; generic format support is not equivalent to enabling every enrichment.

The inspected [Cognee adapter](../../multimodal/tools/cognee-input-transformers.md) calls Docling's plain-text export. To keep tables, coordinates, and visual evidence, retain structured artifacts before crossing that adapter boundary.

Evaluate reading order, split/merged cells, rotated pages, extracted formulas, and JSON round-trip compatibility. For visual retrieval, retain original page images in addition to Docling's text-oriented projections.
