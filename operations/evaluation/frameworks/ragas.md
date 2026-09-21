# Ragas

[Official documentation](https://docs.ragas.io/en/stable/) · [Quickstart](https://docs.ragas.io/en/stable/getstarted/quickstart/) · [Canonical repository](https://github.com/vibrantlabsai/ragas)

Ragas provides evaluation and experimentation tools for AI systems, including retrieval-augmented generation and agent tool use. Select metrics for the property being tested rather than requesting one generic quality score. The vendor-neutral method, worked retrieval metrics, freshness checks, and failure diagnosis live in [retrieval evaluation](../retrieval-evaluation.md).

## Assemble the inputs required by the metric

Start with the current quickstart, install and lock the project dependencies, and configure only the models required by the selected metrics. Required fields and judge dependencies vary by metric:

| Measurement | Inputs to prepare | Implementation boundary |
| --- | --- | --- |
| Model-judged context recall | Question, retrieved contexts, and the required reference answer | Estimates support for reference claims; not simply a count of matching document IDs |
| ID-based context recall | Retrieved and reference context IDs | Requires stable IDs and a reviewed relevance set |
| Faithfulness | Response, supplied contexts, and any other fields required by the selected metric | Judges support from the supplied context, not source currency or authorization |

Consult the current [context-recall variants](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/) and [context-precision variants](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/) before selecting a schema. Do not assume that every metric is reference-free or that every metric requires an embedding model.

Run a small known-good and known-bad sample first. Inspect per-case results and metric errors before a batch evaluation. Keep adapter and judge versions, dataset revision, scoring configuration, and the retrieved source snapshot with the experiment. A release-policy test should use the same evidence snapshot when comparing generation variants.

Model-based metrics and synthetic test generation can call paid APIs. Apply a budget, redact private material, and calibrate generated coverage against reviewed real cases. Freshness, tenant isolation, exact business rules, and mutation postconditions remain explicit application assertions; their absence is not repaired by a strong Ragas score. Link failures back to the [RAG pipeline](../../../infrastructure/knowledge/rag/rag-pipeline.md) stage that supplied the evidence.
