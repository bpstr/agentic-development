# RAG: from documents to grounded answers

**Retrieval-augmented generation (RAG)** supplies external evidence to a model when it answers. The original [RAG paper](https://arxiv.org/abs/2005.11401) combined a learned retriever with a generator. In application development, the term also covers simpler pipelines that search existing data and put relevant results into the model's context.

Use RAG for questions requiring documents or knowledge outside the supplied context. For an exact task ID or current subscription status, call the authorized source API directly. For rewriting supplied text, additional retrieval may contribute nothing. These choices avoid unnecessary indexing and model calls; the [retrieval guide](https://docs.langchain.com/oss/python/deepagents/retrieval) explicitly supports using existing knowledge systems.

## The pipeline

| Stage | What it does | Practical concern |
| --- | --- | --- |
| Parse | Extract readable content and structure from files or APIs | Preserve headings, table headers, code blocks, and source locations. Bad extraction becomes bad evidence. |
| Chunk | Split content into retrievable units | Start with meaningful sections. Test size and overlap against real questions; no universal chunk size works best. |
| Attach metadata | Keep source identity, revision, scope, timestamps, and location | A passage without its document or permission context is difficult to use reliably. |
| Index | Build lexical and/or vector representations | Keep the embedding model and preprocessing version with the index. |
| Retrieve | Find candidate passages for the question | Restrict results to authorized scope before sending content to a model or external reranker. |
| Rerank | Score candidates more carefully against the question | Bound candidate count and measure the added latency. |
| Generate | Answer using a bounded evidence set | Cite supporting passages and state when evidence is insufficient. |

LlamaIndex calls source containers **Documents** and derived retrieval units **Nodes**; nodes can carry inherited metadata and relationships. These are useful abstractions even if you implement the pipeline yourself. See [Documents and Nodes](https://developers.llamaindex.ai/python/framework/module_guides/loading/documents_and_nodes/).

## What the search terms mean

**Dense embeddings** encode content as numerical vectors; nearby vectors can represent related meanings despite different wording. **Lexical search**, commonly BM25, matches terms and is useful for names and identifiers. **Learned sparse retrieval** uses mostly empty, token-oriented representations that can expand beyond literal words. It is related to, but distinct from, ordinary keyword scoring. See [Elastic's sparse retrieval explanation](https://www.elastic.co/docs/solutions/search/vector/sparse-vector).

**Hybrid search** combines retrieval methods, often lexical and dense search. **Reciprocal rank fusion (RRF)** merges result rankings without assuming their raw scores have compatible scales. See [hybrid search](https://www.elastic.co/docs/solutions/search/hybrid-search).

**Reranking** reorders the candidate set. A cross-encoder processes the query and candidate text together; this can improve relevance but adds computation. It cannot recover a document absent from the candidate set. See [semantic reranking](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking).

## An original example

A developer asks: “How do we recover after a failed billing migration?” One retrieved passage could have this application-owned representation:

```json
{
  "source_id": "runbook-billing",
  "revision": "12",
  "chunk_id": "runbook-billing:r12:rollback",
  "scope": "workspace-7",
  "location": "Rollback procedure",
  "url": "https://docs.example.com/billing#rollback",
  "text": "Pause billing jobs before restoring the pre-migration snapshot."
}
```

The answer can cite this passage for pausing jobs. It cannot infer that a usable snapshot exists today; that requires a current backup check. Resolve citation identifiers to stored source URLs in application code instead of trusting invented links. Treat retrieved instructions as document content, not authority to change the agent's behavior.

## Establish a baseline

Start with representative questions and expected supporting passages. Measure retrieval recall, answer correctness, citation support, latency, and cost separately. Include missing answers, conflicting revisions, and inaccessible documents. A fluent answer is not a retrieval test.

[pgvector](https://github.com/pgvector/pgvector) supports exact and approximate vector search inside PostgreSQL and can work with PostgreSQL full-text search. Its approximate indexes trade recall for speed; filtering behavior also affects returned candidates. An existing search system may be sufficient before adding another database.
