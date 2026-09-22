# LightRAG

Official resources: [Repository](https://github.com/HKUDS/LightRAG), [Core SDK guide](https://github.com/HKUDS/LightRAG/blob/main/docs/ProgramingWithCore.md), [Server guide](https://github.com/HKUDS/LightRAG/blob/main/docs/LightRAG-API-Server.md), [Paper](https://arxiv.org/abs/2410.05779).

LightRAG combines entity/relation-oriented retrieval with source chunks. Its mode names describe its own retrieval algorithm: `global` is not Microsoft's community-report global search. The upstream project recommends its server API for application integration while retaining the Python core for embedded use and evaluation.

## Retrieval modes and storage roles

| Mode | Intended evidence route |
| --- | --- |
| `local` | Entity-oriented context |
| `global` | Relationship-oriented context |
| `hybrid` | Combination of local and global routes |
| `naive` | Source-chunk vector retrieval baseline |
| `mix` | Graph-oriented retrieval combined with chunk vector retrieval |
| `bypass` | No retrieval grounding; not a GraphRAG baseline answer |

The core uses separate key/value, vector, graph, and document-status storage roles. A chosen backend may implement several roles, but that does not imply every write is one cross-role transaction. Preserve source chunks and graph state when rebuilding vectors.

## A pinned core lifecycle

The following uses the [core guide at revision 4597323](https://github.com/HKUDS/LightRAG/blob/459732371d84388f03df07d1097c2aeadd702973/docs/ProgramingWithCore.md). Install that source revision in an isolated Python environment and lock its dependencies:

```bash
python -m pip install "lightrag-hku @ git+https://github.com/HKUDS/LightRAG.git@459732371d84388f03df07d1097c2aeadd702973"
```

Set a usable `OPENAI_API_KEY` and `CHAT_MODEL`. This example uses the library's default OpenAI embedding wrapper; record its resolved model and dimensions with the working directory. The wrapper can be replaced, but its vector shape must match the configured storage.

```python
import asyncio
import os
from pathlib import Path
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import openai_complete_if_cache, openai_embed

async def complete(prompt, system_prompt=None, history_messages=None, **kwargs):
    return await openai_complete_if_cache(
        os.environ["CHAT_MODEL"], prompt,
        system_prompt=system_prompt,
        history_messages=history_messages or [], **kwargs,
    )

async def main():
    Path("./r7-lightrag").mkdir(exist_ok=True)
    rag = LightRAG(
        working_dir="./r7-lightrag", llm_model_func=complete,
        embedding_func=openai_embed,
    )
    await rag.initialize_storages()
    try:
        await rag.ainsert(
            "APP-42 affects billing-eu. DOC-7 says to verify the snapshot before rollback.",
            ids=["DOC-7:r2"], file_paths=["DOC-7/r2/rollback.txt"],
        )
        question = "What must happen before rollback for APP-42?"
        context = await rag.aquery(
            question, param=QueryParam(mode="mix", only_need_context=True),
        )
        print(context)
        answer = await rag.aquery(question, param=QueryParam(mode="mix"))
        print(answer)
    finally:
        await rag.finalize_storages()

if __name__ == "__main__":
    asyncio.run(main())
```

Initialization and finalization are part of the lifecycle. Calling an async SDK from a running event loop is different from using a synchronous wrapper that creates its own loop. Persist the full working state, not only the graph file.

This source text is synthetic and small; it does not establish performance or extraction accuracy. Ingest separate original sources for the complete R7 fixture. Inspect source IDs and paths in the actual result before converting it into a citation. Context-only skips the final answer, but retrieval can still perform keyword extraction or query embeddings.

## Bound retrieval and preserve score meanings

The documented `QueryParam` separates entity/relation candidate limits, chunk limits, and token budgets. A single `top_k` is not a universal limit on every stage. Compare `naive`, `hybrid`, and `mix` under an explicit total context budget. Larger neighborhoods may merely repeat generic entities or push useful passages out of context.

For evidence-oriented application endpoints, inspect the documented retrieval-data surface instead of parsing citations out of generated prose. Normalize only fields actually returned. A relationship weight is not proof of truth, and source counts can be inflated by duplicate content unless identities are normalized.

## Update and repair deliberately

The core documents scoped `adelete_by_doc_id` cleanup and reconstruction of entities/relations supported by surviving documents. Keep your own source-to-document-ID mapping. Do not assume inserting a changed document under an existing ID is equivalent to an ordered source replacement without checking that release's semantics.

The [vector rebuild guide](https://github.com/HKUDS/LightRAG/blob/main/lightrag/tools/README_REBUILD_VDB.md) describes rebuilding vectors from retained graph and text-chunk data. Stop writers as instructed and back up first. Deleting the working directory destroys the authoritative material needed for that rebuild and turns re-embedding into full re-ingestion.

Extraction caches and answer/query caches have different value and invalidation rules. Preserve expensive extraction results only while model, prompt, schema, and source compatibility hold; invalidate query answers when authorization or source revisions change. A cached answer is still derived data subject to revocation.

## Shared-server boundary

The server's [authentication guide](https://github.com/HKUDS/LightRAG/blob/main/docs/LightRAG-API-Server.md) is essential before exposing it. Do not rely on the presence of a login page, a workspace label, or a hidden admin UI as the complete authorization policy. Review route allowlists, including compatibility endpoints, and test every endpoint used by the application.

A workspace selects storage organization; the application must decide which caller may select it. Keep administrative graph edits separate from read-only suggestion retrieval. Test duplicate IDs, failed vector writes, missing graph support, interrupted deletion, cross-workspace access, and revoked permissions after a cache warm-up. Provider paper results are not a substitute for the [application's reviewed evaluation set](../../../../operations/evaluation/graphrag-evaluation.md).
