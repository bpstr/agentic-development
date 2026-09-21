# Retrieval evaluation

Retrieval evaluation asks whether a system finds the right authorized evidence for a question. It is separate from judging the generated answer: generation may ignore good evidence, faithfully repeat obsolete evidence, or produce a correct answer despite broken retrieval. Keep the measured stages visible before combining results.

The [Ragas context-recall documentation](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/) distinguishes claim-based model judging from comparisons using reference contexts or identifiers. These are different measurements; an estimated fraction of supported reference claims is not automatically document-level recall.

## Define a reference case

An evaluation case needs a question, authorized scope, source/index revision, an as-of time or freshness rule, and reviewed relevant evidence. Record whether the question is answerable from that authorized collection. A missing label is not proof that no answer exists.

For “Who must approve release R7?”, a reference can require two passages from the current P-17 policy: one defining the owner approval and another requiring a security review. Keep source IDs and passage revisions stable. Pages, table regions, or time ranges are useful evidence units for [multimodal retrieval](../../infrastructure/knowledge/retrieval/multimodal-retrieval.md); a filename alone may be too coarse.

## Measure retrieval before generation

For binary relevance judgments, precision@k measures relevant results in the first k result slots; recall@k measures coverage of the labelled relevant set. This **standalone synthetic example** treats unfilled slots as misses and repeated passage IDs as consuming slots without earning repeated credit:

```python
def retrieval_scores(ranked: list[str], relevant: set[str], k: int) -> dict[str, float]:
    if k <= 0 or not relevant:
        raise ValueError("Use positive k and a nonempty reviewed relevance set")
    top = ranked[:k]
    hits = set(top) & relevant
    first_rank = next((i for i, item in enumerate(top, 1) if item in relevant), None)
    return {
        "precision_at_k": len(hits) / k,
        "recall_at_k": len(hits) / len(relevant),
        "reciprocal_rank_at_k": 0.0 if first_rank is None else 1.0 / first_rank,
    }

relevant = {"policy-r4:owner", "policy-r4:security"}
ranked = ["policy-r4:owner", "policy-r3:owner", "unrelated", "policy-r4:security"]
scores = retrieval_scores(ranked, relevant, 3)
assert scores == {"precision_at_k": 1 / 3, "recall_at_k": 0.5, "reciprocal_rank_at_k": 1.0}
assert retrieval_scores(["policy-r4:owner"] * 3, relevant, 3)["recall_at_k"] == 0.5
```

Here the first result is relevant, but half the required evidence is missing from the top three. A good reciprocal rank does not establish multi-passage completeness. State your denominator and deduplication policy, because metric implementations differ. These numbers describe only this invented list, not any retrieval provider.

For no-answer cases, test evidence sufficiency and appropriate abstention separately; recall is undefined for an empty relevant set. With incomplete relevance labels, unjudged results are not proven irrelevant. Inspect apparent false positives and refine the reference set before claiming a ranking regression.

## Diagnose the failing stage

| Observed result | Likely investigation |
| --- | --- |
| Required passage never became a candidate | Parsing, indexing, query construction, scope filters, or candidate retrieval |
| Passage was a candidate but disappeared from top k | Ranking, reranking, duplicates, or result-budget policy |
| Correct passage was returned but omitted from model input | Context assembly, truncation, or selection |
| Correct current evidence reached the model but answer is unsupported | Generation and claim-level evaluation |
| Answer follows an obsolete policy | Source revision, validity rules, or index freshness |
| Unauthorized passage enters a run | Access-control failure, even if the final answer omits it |

Compare direct lookup, lexical, semantic, and hybrid retrieval on the same question groups. Then change chunking, reranking, or k individually. Freeze or record the corpus revision, embedding model, index configuration, filters, and query-rewrite behavior. Include ingestion failures rather than evaluating only successfully parsed documents.

Finish with end-to-end checks for answer support, required facts, citation resolution, latency, and cost. Keep access violations as hard failures, not a small penalty inside relevance averages. [Ragas](frameworks/ragas.md) is one implementation for some of these measurements; deterministic source, freshness, and permission assertions remain application responsibilities.
