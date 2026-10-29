# Reranking

Reranking applies a more detailed relevance model to candidates already retrieved. A typical cross-encoder reads the query and one candidate together, enabling closer comparison than independently computed embeddings. Other approaches score several candidates with a language model or combine additional ranking features.

A practical sequence is to retrieve forty passages, rerank them, then select six passages that cover the question without excessive repetition. These numbers are example budgets, not universal defaults.

Reranking cannot rescue a relevant passage absent from the candidate set. Diagnose retrieval recall before spending more on a reranker. Also check input truncation: a candidate's relevant paragraph may fall outside the reranker's input window.

[Elastic's semantic reranking documentation](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking) explains the retrieval-then-rerank pattern. Compare improvements on your own judgments, including negation, version constraints, and exact identifiers.

Authorization must precede transmission to an external reranking service. Removing an inaccessible passage after scoring does not undo disclosure to that service. Keep candidate scope, source revision, model version, and timing in internal diagnostics.

A rerank score is not a calibrated probability that an answer is correct. Use it to select evidence; then evaluate whether the generated claim is supported by that evidence. On short exact lookups, the additional model call may cost more latency than its relevance gain justifies.

## Cohere Rerank 5 and passage-level Context Focus

[Cohere Rerank 5](https://docs.cohere.com/v2/changelog) was released October 21, 2026 with `rerank-v5.0-pro` (higher-quality, reasoning-intensive ranking) and `rerank-v5.0-fast` (lower-latency ranking). Both support multilingual inputs, up to a 32K-token context window, and semi-structured records encoded as YAML strings. Switching from an earlier Cohere Rerank model changes the `model` argument; reranking operates on raw retrieved text, so **no embedding reindex is needed**. Reassess ranking thresholds and costs on your own query set before deployment.

An optional `relevant_spans` request field enables **Context Focus**: return scored passage spans with `start`/`end` character offsets in each original document, rather than transmitting entire reranked documents to a downstream LLM. An illustrative V2 body is:

```json
{
  "model": "rerank-v5.0-fast",
  "query": "Which deployment procedure includes rollback?",
  "documents": [
    "Release checklist: run smoke tests, deploy, and confirm metrics.",
    "Rollback runbook: if error rate rises, restore the prior image."
  ],
  "top_n": 2,
  "relevant_spans": {"mode": "enabled", "threshold": 0.3, "max_spans": 4}
}
```

The [Cohere V2 API](https://docs.cohere.com/v2/docs/rerank-overview) returns document indices and relevance scores; with Context Focus it also returns eligible spans. Span coordinates refer to the **original supplied candidate text**, not normalized output or arbitrary source-file bytes. Preserve the candidate-to-source mapping, document revision, and access scope before rendering snippets or citations. Cohere describes Rerank 5's scores as calibrated for cross-query thresholds; this is still **relevance**, not the probability an answer is factually supported. Validate score cutoffs, span omission rate, and downstream answer recall on held-out data.
