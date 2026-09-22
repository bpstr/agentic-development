# GraphRAG evaluation

GraphRAG evaluation asks whether graph structure contributes correct, authorized, useful evidence beyond a simpler retrieval system. Evaluate graph construction, retrieval, context assembly, and generation separately; a fluent answer can hide a false path or missing source.

The [original Microsoft paper](https://arxiv.org/abs/2404.16130) evaluates a particular corpus-summarization approach. Use its question/task distinction when designing experiments, not its results as a universal score for unrelated implementations. Existing [retrieval evaluation](retrieval-evaluation.md) defines source-level metrics and no-answer handling; this article adds graph-specific checks.

## Define a reviewed reference set

Use the [synthetic R7 corpus](../../infrastructure/knowledge/graphrag/graphrag-definition.md#a-shared-synthetic-release-example) as an executable-sized design example, not a benchmark representative of production. Review and expand labels using real authorized workloads before making quality claims.

| Case | Required behavior |
| --- | --- |
| Exact current APP-42 status | Read the owning system; do not prefer obsolete indexed state |
| Suggest a rollback document | Return DOC-7:r2#rollback with the task-to-service reason |
| Incidents involving blocking services | Include APP-42:r3 and INC-17:r1#impact; do not infer causation |
| Ownership before/after September 10 | Select DEC-2:r1/r2 using valid time |
| Ambiguous Billing name | Keep billing-eu and billing-us distinct |
| Project-A-only principal | No DOC-8 content, title, path, report, or cache leakage |
| Workspace W principal | Never use DOC-9 from workspace X |
| Who approved R7? | Explain insufficient evidence |
| Corpus themes | Preserve reviewed minority themes and trace claims to sources |
| Source update, revoke, delete | Do not return stale or forbidden derived artifacts |

Record query text, principal/scope, as-of time, corpus and published index revision, gold source locators, required facts/paths, and forbidden claims. With incomplete labels, an unjudged candidate is not automatically irrelevant. Have reviewers inspect uncertain false positives rather than optimizing against accidental omissions.

## Measure each stage

For extraction, measure mention detection, canonical identity resolution, predicate accuracy, endpoint direction, source-span support, and rejected/unresolved coverage. Review entity merges and splits separately. A schema-valid graph can still be wrong.

For retrieval, measure candidate recall, final evidence recall/precision, ranking quality, path support, and multi-passage completeness. A path is supported only when each necessary edge has accessible, applicable evidence. Track unsupported edges separately from irrelevant but factually supported paths.

For reports, check theme coverage, minority-case loss, duplicate-source amplification, temporal scope, and source-backed statements. For answers, check claim support, required facts, correct citations, and appropriate abstention. A model judge can assist human review, but must not be the sole authorization or source-existence check.

## A deterministic evidence gate

This standalone Python example is an application test fixture, not a provider API or a complete ACL engine. It checks identity/revision membership and whether every required edge has at least one currently allowed supporting source. In production, authorize intermediate nodes and edges too; a source-membership check alone is insufficient.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Evidence:
    source: str
    revision: str
    locator: str

@dataclass(frozen=True)
class Edge:
    subject: str
    predicate: str
    object: str
    support: tuple[Evidence, ...]


def path_supported(path: tuple[Edge, ...], allowed: set[Evidence]) -> bool:
    if not path:
        return False
    connected = all(a.object == b.subject for a, b in zip(path, path[1:]))
    return connected and all(
        any(item in allowed for item in edge.support) for edge in path
    )


task = Evidence("APP-42", "3", "relationships")
runbook = Evidence("DOC-7", "2", "rollback")
old_runbook = Evidence("DOC-7", "1", "rollback")
restricted = Evidence("DOC-8", "1", "migration")
allowed = {task, runbook}
first = Edge("APP-42", "AFFECTS", "billing-eu", (task,))
second = Edge("billing-eu", "DOCUMENTED_BY", "DOC-7", (runbook,))
path = (first, second)

assert path_supported(path, allowed)
assert not path_supported((), allowed)
assert not path_supported(path, {task})  # Revocation or deletion.
assert not path_supported(path, {task, old_runbook})  # Wrong revision.
assert not path_supported(
    (first, Edge("billing-eu", "DOCUMENTED_BY", "DOC-8", (restricted,))),
    allowed,
)
assert not path_supported(
    (first, Edge("billing-us", "DOCUMENTED_BY", "DOC-7", (runbook,))),
    allowed,
)
assert not path_supported(
    (first, Edge("billing-eu", "DOCUMENTED_BY", "DOC-7", ())), allowed
)
# Two supports permit removing one without losing the still-supported edge.
assert path_supported(
    (first, Edge("billing-eu", "DOCUMENTED_BY", "DOC-7", (restricted, runbook))),
    allowed,
)
```

This test says nothing about whether the text actually supports a predicate. Add reviewed edge labels or claim-level checks for that separate question. An asserted `CAUSED` edge with a valid source ID can still be an invalid interpretation of that source.

## Compare baselines and ablations

Freeze corpus, principal, question set, model, prompts, and evidence budget. Compare direct lookup where applicable, lexical retrieval, vector retrieval, hybrid retrieval with reranking, graph expansion added to that same candidate pipeline, and report-assisted retrieval for collection questions. Keep a long-context baseline when the authorized corpus is small enough.

Remove graph expansion while holding ranking and generation constant. Then remove reports or switch extraction policies independently. This isolates the graph's contribution rather than attributing improvements from a stronger reranker or larger context to GraphRAG. Report per question class and scope, not just a single average that hides regressions.

Measure ingestion-to-searchable lag, candidate retrieval and final-answer latency separately, cold/warm runs, p50/p95, provider calls, input/output tokens, storage amplification, and rebuild cost. Include failed parsing and incomplete indexing in the denominator. Small fixture timings are not production performance estimates.

## Operational and adversarial regressions

Exercise cycles, high-degree hubs, duplicate/mirrored documents, multilingual aliases, empty documents, unsupported modalities, missing source spans, conflicting claims, late events, model/schema upgrades, embedding-dimension changes, partial writes, and query timeouts. Test permission revocation after a cache is warm and while an indexing job is in flight.

Deletion tests must query both direct source matches and indirect artifacts: entity descriptions, edges, reports, suggestions, and cached answers. Assert that an old queued job cannot resurrect deleted data. Keep unauthorized evidence entering a model/reranker/trace as a hard failure even when the user-facing answer happens to omit it.

For task suggestions, also track useful accepted suggestions, repeated rejected suggestions, time until a valid suggestion appears, and stale suggestions after a description change. Acceptance is a product signal, not complete relevance ground truth: exposure and user habits influence it. Combine feedback with a reviewed offline set and avoid silently writing inferred relationships into the authoritative task graph.
