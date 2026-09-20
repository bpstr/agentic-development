# Retrieval-augmented generation

Retrieval-augmented generation (RAG) supplies selected external evidence to a model while it generates a response. The [original RAG paper](https://arxiv.org/abs/2005.11401) combined a learned retriever and generator; application usage also includes pipelines that search existing systems and insert passages into model context.

RAG is useful when an answer depends on documents outside the current conversation or on information that changes independently of model training. It does not require a vector database, a graph, or an agent framework. An authorized keyword search followed by a grounded answer is a valid implementation.

Consider “How do we recover from a failed billing migration?” A retrieval step finds the rollback runbook, and generation explains the relevant procedure with its source. The same pipeline cannot establish that today's backup is usable: that needs a current observation from the backup system.

Keep retrieval and generation measurable separately. Check that the expected passage is retrieved before judging the prose. Then measure correctness, citation support, missing-answer behavior, latency, and cost.

Treat retrieved content as evidence, including instructions quoted inside documents. It does not gain authority over the agent's operating rules. RAG reduces one source of uncertainty by supplying context, but irrelevant, stale, conflicting, or malicious context can still produce an incorrect answer.
