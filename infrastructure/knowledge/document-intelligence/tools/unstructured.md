# Unstructured document partitioning

[Partitioning documentation](https://docs.unstructured.io/open-source/core-functionality/partitioning) · [Installation](https://docs.unstructured.io/open-source/installation/full-installation) · [Chunking](https://docs.unstructured.io/open-source/core-functionality/chunking) · [Canonical repository](https://github.com/Unstructured-IO/unstructured)

Unstructured partitions files into typed elements such as titles, paragraphs, lists, and tables. It is useful when many source formats need a common intermediate representation before filtering, chunking, and indexing. The open-source library and hosted platform are separate deployment choices.

## Choose a PDF strategy

| Strategy | Mechanism | Selection concern |
| --- | --- | --- |
| `fast` | Extract existing text | Does not recover image-only text by itself |
| `hi_res` | Layout-aware processing | Additional model/runtime cost; useful for structured elements and tables |
| `ocr_only` | OCR-centered extraction | Text recognition is not complete layout reconstruction |
| `auto` | Select a strategy from input/options | Observe the actual route rather than assuming a fixed behavior |

Dependencies and fallback rules affect results. Multi-column reading order, scans, and table structure need explicit tests instead of relying on the word “high resolution.”

## Basic extraction

Install the PDF extra and the system dependencies appropriate to the selected strategy, including Poppler/Tesseract and language data where required:

```bash
python -m pip install "unstructured[pdf]"
```

This example keeps the typed-element artifact and prepares structure-aware chunks:

```python
import sys
from pathlib import Path
from unstructured.partition.pdf import partition_pdf
from unstructured.staging.base import elements_to_json
from unstructured.chunking.title import chunk_by_title

source = Path(sys.argv[1]).resolve(strict=True)
if not source.is_file():
    raise ValueError("Expected a PDF file")

elements = partition_pdf(
    filename=str(source),
    strategy="hi_res",
    infer_table_structure=True,
)
if not elements:
    raise RuntimeError("No elements extracted; inspect the source and pipeline")
elements_to_json(elements, filename="document-elements.json")

for chunk in chunk_by_title(elements, max_characters=2000):
    print(chunk.text)
```

The JSON staging helpers are documented in the project's [element serialization guide](https://unstructured.readthedocs.io/en/main/introduction/overview.html). Check the installed library's API when migrating from older examples.

## Retrieval and operational boundaries

Store original element metadata, source revision, page identity, and table HTML when available. Embed the resulting chunks or index them lexically, then use retrieved element IDs to reopen the relevant document region. A list of strings discards distinctions that a later answer may need. Character-based chunk limits must still be checked against the embedding model's token budget.

Keep original elements before chunking: merged chunks may combine metadata and should not become the only surviving provenance. A table's plain text is not an equivalent substitute for its rows, columns, spans, and headers.

Pin library and inference dependencies together, budget model downloads, and inspect processing warnings. Decide explicitly whether sources stay local or are sent to hosted services. Test output completeness and source localization before evaluating generated summaries.
