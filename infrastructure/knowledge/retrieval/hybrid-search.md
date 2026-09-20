# Hybrid search

Hybrid search combines complementary retrieval methods, commonly lexical and dense vector search. Lexical retrieval favors exact wording; dense retrieval can connect paraphrases. The combination is useful when a corpus mixes identifiers, technical terms, and natural-language explanations.

Raw scores from different retrievers are rarely comparable. A BM25 score and a cosine similarity have different scales and distributions. One option is **reciprocal rank fusion (RRF)**, which uses each result's rank rather than its raw score:

```text
fused_score(document) = sum(1 / (k + rank_in_result_list))
```

Ranks start at one; a document absent from a list contributes nothing. The constant k controls how sharply rank differences matter. [Elastic's hybrid search documentation](https://www.elastic.co/docs/solutions/search/hybrid-search) describes combining retrievers and fusion methods.

For “APP-42 rollback,” retrieve candidates from both methods within the same authorized scope, merge by stable chunk or document ID, fuse rankings, and optionally rerank a bounded candidate set. Avoid letting duplicated passages crowd out distinct evidence.

Tune candidate counts as well as fusion. A strong vector result cannot contribute if its retriever returns too few candidates. Measure recall, ranking quality, query latency, and behavior under narrow permission filters. Hybrid search adds another retrieval path to debug; log each path's ranks before fusion so changes remain explainable.
