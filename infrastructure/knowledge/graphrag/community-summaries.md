# Community summaries

A graph community is a group of nodes identified as more closely connected under a chosen clustering method. A community summary describes evidence associated with that group. It is a derived artifact, not an independent source or a guaranteed real-world organizational unit.

Microsoft GraphRAG's [global search](https://microsoft.github.io/graphrag/query/global_search/) uses reports from a selected level of a community hierarchy and aggregates intermediate responses. It targets questions spanning a collection, such as recurring operational problems, rather than relying only on a handful of similar passages. The [original paper](https://arxiv.org/abs/2404.16130) evaluates this particular summarization approach; its results should not be generalized to every graph or application.

## Construct reports from evidence

A useful report has an explicit scope, graph revision, membership set, supporting source revisions, extraction and summarization configuration, and its own revision. Store these dependencies, not only the resulting text. The report must remain traceable through extracted descriptions to original evidence; a chain of model-generated summaries is not independent corroboration.

For the [R7 example](graphrag-definition.md#a-shared-synthetic-release-example), a community involving Billing incidents and migration runbooks could describe recurring operational observations. It must not manufacture a shared cause or imply that every document about Billing concerns the same service.

Community detection depends on graph construction. Incorrect entity merges can pull unrelated projects together; duplicated sources can artificially increase connectivity. Generic hubs can dominate grouping. Review representative communities, isolated nodes, and ambiguous identities before relying on reports.

## Choose detail and coverage deliberately

A coarser partition can reduce report count and query work but obscure minority topics. More detailed communities can preserve specificity while increasing storage, summarization, and query costs. Hierarchy numbering is implementation-specific; inspect membership and report size instead of assuming that a larger level number always means greater detail.

Two distinct selection choices matter: which evidence enters each report, and which reports enter the query. Either can exclude important material. Query-based community selection lowers work but can miss an unusual relevant community. Collection-wide aggregation covers more reports but is not automatically a statistically complete analysis.

When the question asks for exact counts or exhaustive membership, query authoritative structured records or inspect the full underlying evidence. A sentence saying “several incidents” cannot establish an incident count. Deduplicate mirrored documents and syndicated reports before treating frequency as independent support.

## Keep reports within access boundaries

Build reports within sharing boundaries or authorize the complete source membership before use. Filtering citations after generation does not remove restricted information already summarized into the report. A report covering projects A and B is not safe for a project-A-only principal simply because its title is generic.

A revoked source invalidates affected reports, cached contexts, and any subsequent summaries derived from them. Maintain reverse dependencies from source revision to graph claims to reports. Quarantine invalid artifacts immediately when necessary, then regenerate from the permitted source set. Removing the original chunk alone is insufficient.

For updates, identify changed memberships and supporting revisions, regenerate affected artifacts, validate them, and publish a coherent retrieval revision. Preserve the previous published revision while a rebuild is incomplete when policy permits; do not mix an old report with new membership metadata and call it current.

## Evaluate summaries as compressed evidence

Check coverage of reviewed themes, minority-case retention, factual support, citation resolution, and unsupported causal claims. Compare source-level retrieval against report-assisted retrieval under a stated context and cost budget. Include a case where a small but relevant incident is absent from the dominant community.

A readable report can still overstate frequency, repeat an extraction error, or summarize an obsolete decision. Direct source retrieval remains appropriate when exact wording, a specific incident, current task state, or a historical validity boundary matters. [GraphRAG evaluation](../../../operations/evaluation/graphrag-evaluation.md) separates report quality from candidate retrieval and final generation.
