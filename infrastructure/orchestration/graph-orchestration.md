# Graph orchestration

Graph orchestration represents executable steps as nodes and transitions as edges. Nodes consume state and return updates; edges specify which node runs next. Conditional edges select a route, and joins combine results from parallel branches.

A graph can contain cycles, such as a model/tool loop, or remain acyclic, such as extract → validate → publish. A knowledge graph stores relationships about a domain; an execution graph describes how work proceeds. They solve different problems.

For a document review, separate checks for citations and formatting can run concurrently. A join should record both results before selecting revision or approval. Define whether one failed branch stops the whole run, is retried, or produces a partial result.

State merging is part of correctness. If two nodes append findings, use an explicit merge rule. If two nodes edit the same document version, detect a conflict rather than allowing whichever finishes last to overwrite the other.

Choose a graph when branches, joins, loops, and resumable checkpoints make the process easier to inspect. A graph drawing does not establish durability or improve model reasoning by itself. [LangGraph's graph API](https://docs.langchain.com/oss/python/langgraph/graph-api) documents nodes, edges, reducers, and control flow as concrete primitives.

## A parallel review with an explicit join

This is an **illustrative application state machine**, not LangGraph syntax. Both reviewers read immutable document revision r7. Each returns a terminal execution status plus findings; “completed” means the check ran, not that the document passed.

| Event | Recorded state | Allowed transition |
| --- | --- | --- |
| Start review r7 | Citation and format branches pending | Start both under one run identity |
| Format check completes | Format completed; citation pending | Wait; do not infer approval |
| Citation check times out | Citation retryable-error with attempt recorded | Retry that branch within its own limit |
| Citation retry succeeds with findings | Both completed for r7 | Merge findings and select revision |
| Citation retry budget expires | Citation unavailable; format completed | Return review-incomplete, never approved |
| Document becomes r8 while r7 is reviewed | Results remain attached to r7 | Reject them as approval evidence for r8 |

Store branch results under `(run_id, document_revision, check_name)` and use attempt numbers or fencing tokens to reject late results from superseded attempts. Give findings stable identities before merging; a redelivered result must not duplicate findings. The join checks that all required checks completed for the same revision and that no blocking finding remains. Any publication approval is a separate policy decision.

One reviewer should not edit the shared document while another reviews it. Merge proposed findings first, perform one revision step, then start a new review against its new revision. A retained formatting result may be reused only when an explicit dependency rule proves that the relevant inputs are unchanged.

Test reversed branch completion order, duplicate delivery, a late response after timeout, exhausted retries, a cancelled run, and a document edited during review. The outcomes should not depend on which network response arrives last. Conditional transitions and merge rules are application semantics even when a framework supplies reducers and checkpoints.
