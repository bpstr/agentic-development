# ScrapeGraphAI

[Official repository and library guide](https://github.com/ScrapeGraphAI/Scrapegraph-ai) · [Official examples](https://github.com/ScrapeGraphAI/Scrapegraph-ai/tree/main/examples) · [Managed API documentation](https://docs.scrapegraphai.com/introduction)

ScrapeGraphAI is an MIT-licensed Python library for extracting structured information from websites and local documents using a prompt and a graph of processing steps. It implements the extraction stage of [web research](../web-research.md): turning selected source content into records an application can validate and use.

Use it when fields require semantic interpretation across varied page layouts. Prefer a source API or deterministic parser when those already expose the needed data reliably; model-based extraction adds latency, resource use, and uncertainty. The graph describes execution steps, not a knowledge graph or a complete GraphRAG system.

## Library and managed service

The upstream [product comparison](https://github.com/ScrapeGraphAI/Scrapegraph-ai#-open-source-vs-managed-api) distinguishes two execution surfaces:

| Surface | What the application uses | Operational responsibility |
| --- | --- | --- |
| Open-source library | `scrapegraphai`, running Python graphs with a configured local or hosted model | Provision browsers, model access, networking, proxies where needed, and scaling. |
| Managed API | Separate `scrapegraph-py` or `scrapegraph-js` clients calling the hosted service | Follow the service's authentication, feature set, and billing. |

The repository's [MIT license](https://github.com/ScrapeGraphAI/Scrapegraph-ai/blob/194055e203afce41ed4e70365dbc416bad756115/LICENSE) covers the library; it does not make hosted inference or the managed service free. Managed crawling and monitoring features should not be assumed to exist in a local graph.

## Extraction mechanism

At [upstream revision `194055e203af`](https://github.com/ScrapeGraphAI/Scrapegraph-ai/commit/194055e203afce41ed4e70365dbc416bad756115), the default [`SmartScraperGraph` implementation](https://github.com/ScrapeGraphAI/Scrapegraph-ai/blob/194055e203afce41ed4e70365dbc416bad756115/scrapegraphai/graphs/smart_scraper_graph.py) fetches source content, parses it, and generates an answer from that content and the extraction prompt. Configuration can alter this pipeline.

`SmartScraperGraph(prompt, source, config, schema=None)` accepts an optional Pydantic model **class** for the output schema. Calling `.run()` executes the graph and returns its answer. A structured result remains a model interpretation: schema conformance does not establish that every value appears in the source.

The library also provides `SmartScraperMultiGraph` for a supplied list of sources and `SearchGraph` for extraction from search results. A single-page graph does not automatically traverse an entire website. See the [upstream graph catalog](https://github.com/ScrapeGraphAI/Scrapegraph-ai#-usage) for the separate pipelines.

## Quick start with a local model

The inspected [package metadata](https://github.com/ScrapeGraphAI/Scrapegraph-ai/blob/194055e203afce41ed4e70365dbc416bad756115/pyproject.toml) requires Python `>=3.12,<4.0`. The following uses Python 3.12 and the Ollama model from the upstream README. Install and start [Ollama](../../../hosting/local-inference/ollama.md) before running extraction; download the model once.

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install scrapegraphai
python -m playwright install
export SCRAPEGRAPHAI_TELEMETRY_ENABLED=false
ollama pull llama3.2
```

Save this as `extract_page.py` and run `python extract_page.py` in that environment:

```python
import json

from scrapegraphai.graphs import SmartScraperGraph

graph = SmartScraperGraph(
    prompt=(
        "Extract the page title and a short description. "
        "Return title and description fields; use null for missing information."
    ),
    source="https://example.com/",
    config={
        "llm": {
            "model": "ollama/llama3.2",
            "model_tokens": 8192,
            "format": "json",
        },
        "headless": True,
        "verbose": False,
    },
)

result = graph.run()
print(json.dumps(result, indent=2))
```

This follows the upstream constructor and local-model configuration. It requires network access to the source, installed browser dependencies, and a running model service; it is not an offline example. `model_tokens` informs the library's content-processing budget and must agree with the selected model's capabilities; it does not independently configure the model server's context window.

For a supported hosted provider, use its documented provider-prefixed `llm.model` and configure credentials such as `llm.api_key` through environment variables or a secret store. Source content then reaches that provider. Lock the package and dependencies after verifying the chosen release; repository-head observations do not guarantee identical behavior in every installed version.

## Application integration

Keep acquisition, validation, storage, and retrieval explicit:

1. Select approved sources and define the fields, missing-value behavior, and optional output schema.
2. Run the graph; treat exceptions, missing fields, and unexpected output types as extraction failures or incomplete records.
3. Validate values and preserve source URL, retrieval time, and supporting excerpts or an appropriate source snapshot.
4. Persist accepted records and update the application's [index](../../indexing/indexing.md) if needed.
5. Use a separate [retrieval/query layer](../../retrieval/retrieval-definition.md) to find stored evidence later.

ScrapeGraphAI supplies extraction; the application supplies durable storage, freshness, deletion, and retrieval policy. Exposing extraction as an agent tool should preserve those boundaries.

## Production boundaries

- **Resource use:** bound page size, source count, browser concurrency, retries, and model calls in the surrounding application. Fetch only material needed for the requested fields. A local model still consumes compute and memory.
- **Access and execution:** validate source URLs and redirects, isolate browser execution, and restrict network destinations. Configure required authentication and rate handling explicitly. Fetched page instructions must not authorize downstream tool calls or privileged writes.
- **Accuracy:** test extraction against representative pages, missing fields, changed layouts, and contradictory content. Preserve supporting evidence and measure field-level accuracy rather than treating valid JSON as a successful extraction.
- **Telemetry:** the [inspected telemetry implementation](https://github.com/ScrapeGraphAI/Scrapegraph-ai/blob/194055e203afce41ed4e70365dbc416bad756115/scrapegraphai/telemetry/telemetry.py) defaults to enabled. When required fields are available, it can transmit prompts, schemas, fetched content, model responses, model identifiers, and source URLs. Set `SCRAPEGRAPHAI_TELEMETRY_ENABLED=false` **before importing** the package when those data must remain under application control, as in the setup above.
- **Scope:** document formats accepted by an extraction pipeline do not imply visual understanding of scans, images, or page layout. Choose and verify the appropriate loader and processing graph for each source type.
