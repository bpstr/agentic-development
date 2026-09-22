# Cognee indexing

Official resources: [Remember operation](https://docs.cognee.ai/core-concepts/main-operations/remember), [remember API](https://docs.cognee.ai/python-api/remember), [cognify API](https://docs.cognee.ai/python-api/cognify), [Dataset permissions](https://docs.cognee.ai/core-concepts/multi-user-mode/permissions-system/overview).

`remember` without a session ID ingests permanent content and runs processing. Supplying a session ID selects a different memory path. Source indexing should be explicit rather than accidentally mixed with conversation caching.

## Ingest a source and observe completion

After the [local setup](cognee-basic-setup.md), create a UTF-8 `runbook.txt` containing DOC-7's rollback procedure. Save this as `index_runbook.py`:

```python
import asyncio
from pathlib import Path
import cognee

async def main():
    source = Path("runbook.txt").resolve(strict=True)
    result = await cognee.remember(
        str(source),
        dataset_name="demo-runbooks",
        extractor="gliner_demo",
        self_improvement=False,
        incremental_loading=True,
    )
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

This awaits the ordinary foreground pipeline. Check its result and then retrieve a known source passage before marking the application revision searchable. For a multi-document job, preserve per-item outcomes; one completed document does not imply the entire batch succeeded.

The inspected [1.6.0 remember implementation](https://github.com/topoteretes/cognee/blob/v1.6.0/cognee/api/v1/remember/remember.py) anchors background work as Python tasks and records improvement errors separately from primary ingestion success. An in-process task is not an external durable queue, and successful ingestion does not prove optional improvement succeeded. A service should expose these states separately and recover after process termination.

## Choose extraction deliberately

Use local GLiNER for the supported bounded schema when that is enough. Use LLM extraction or a custom `graph_model`/pipeline when the domain requires controlled types or richer relationships. GLiNER is not a drop-in replacement for arbitrary custom or temporal pipelines. Preserve unresolved identities rather than forcing Billing aliases into one node.

The [ontology guide](../../knowledge-graphs/ontology-design.md) explains the distinction between a valid schema and a true claim. Keep authoritative application dependencies separate from extracted relations; import explicit task IDs and source revisions instead of asking a model to reconstruct them from display text.

Optional contradiction processing identifies conflicting claims; it does not automatically correct authoritative records or remove false facts. Optional provenance tracking records processing evidence, but a nonfatal ledger failure can leave coverage gaps. Inspect pipeline warnings and compare tracked outputs with expected source/claim counts before relying on the ledger for an audit. Configure optional stages before startup and use the required database migrations documented for the selected release.

## Budget and version the pipeline

Set `self_improvement` explicitly. Record extraction model, prompt, schema, chunker, embedding model, dimensions, and library release. Ingestion, embeddings, graph processing, improvement, and later answer generation are separate cost stages.

The documented `remember` dry run is a constrained estimation path, not a full invoice forecast. It excludes embedding and improvement costs and does not apply to every input or extractor. In particular, do not copy an LLM-estimation example into the GLiNER demonstration and assume it estimates local work. Measure representative source batches and account for retries and changed-source rebuilds.

## Own the external source lifecycle

Keep canonical source ID, external revision, ingestion receipt, dataset UUID, provider data ID, and published application revision in the owning service. Incremental loading does not by itself establish event ordering, deletion semantics, or atomic publication across relational, graph, and vector stores.

Use an idempotency key based on source identity, revision, and pipeline version. Reject a late older revision rather than overwriting a newer one. A deletion tombstone must prevent an already queued indexing task from recreating the source. Keep the previous published revision during partial rebuilds only when authorization and retention policy allow it.

Use dataset boundaries according to ownership and sharing. Node-set tags organize content but are not a substitute for permissions. A workspace dataset with project node sets still needs project-level authorization in the application when some projects are private.

The documented [forget API](https://docs.cognee.ai/python-api/forget) distinguishes a scoped data-item deletion, whole-dataset deletion, and memory-only cleanup. Its provenance-driven memory cleanup may miss nodes written by custom pipelines without tracked source items. Verify the selected pipeline's source-to-derived-object mapping before promising complete deletion. Never use a global prune as an undocumented fallback in a shared request.

## Preserve non-text evidence

Inspect the [input transformer](../../multimodal/tools/cognee-input-transformers.md) before assuming a supported format is fully analyzed. The previously inspected video path transcribed audio rather than frames; Docling text export did not preserve its complete structured output. Keep the inspected revision attached to such observations.

Store source locations before lossy conversion: page and region for documents, timestamps and speakers for audio, and frame/time evidence for video. A graph extracted from a caption is limited to what that caption actually observes. See [multimodal source understanding](../../multimodal/multimodal-source-understanding.md), and return the original locator alongside generated interpretations.
