# Reranking

Reranking applies a more detailed relevance model to candidates already retrieved. A typical cross-encoder reads the query and one candidate together, enabling closer comparison than independently computed embeddings. Other approaches score several candidates with a language model or combine additional ranking features.

A practical sequence is to retrieve forty passages, rerank them, then select six passages that cover the question without excessive repetition. These numbers are example budgets, not universal defaults.

Reranking cannot rescue a relevant passage absent from the candidate set. Diagnose retrieval recall before spending more on a reranker. Also check input truncation: a candidate's relevant paragraph may fall outside the reranker's input window.

[Elastic's semantic reranking documentation](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking) explains the retrieval-then-rerank pattern. Compare improvements on your own judgments, including negation, version constraints, and exact identifiers.

Authorization must precede transmission to an external reranking service. Removing an inaccessible passage after scoring does not undo disclosure to that service. Keep candidate scope, source revision, model version, and timing in internal diagnostics.

A rerank score is not a calibrated probability that an answer is correct. Use it to select evidence; then evaluate whether the generated claim is supported by that evidence. On short exact lookups, the additional model call may cost more latency than its relevance gain justifies.
