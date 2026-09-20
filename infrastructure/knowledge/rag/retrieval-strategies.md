# Retrieval strategies

A retrieval strategy decides how to turn an information need into evidence. Select it according to the question and source structure rather than assuming every request needs the same semantic search.

- **Direct lookup** resolves a known document, task, or record ID.
- **Passage retrieval** finds local statements related to a question.
- **Hybrid retrieval** combines lexical and semantic candidates.
- **Multi-step retrieval** uses an initial result to resolve another entity or dependency.
- **Graph retrieval** follows meaningful relationships between entities.
- **Collection summarization** uses broader coverage when the question concerns recurring themes.

For “What blocks release R7?”, read current dependency records first. For “Which past incidents involved those dependencies?”, retrieve incident evidence using the resolved service and task identities. A model-generated query should preserve those identifiers and the authorized scope.

Query rewriting and decomposition can improve coverage, but each extra search adds latency and can drift from the original question. Bound the number of subqueries and stop when the evidence is sufficient.

Microsoft's [local GraphRAG search](https://microsoft.github.io/graphrag/query/local_search/) illustrates selecting connected evidence around entities. Its [global search](https://microsoft.github.io/graphrag/query/global_search/) addresses broader questions using community reports. These answer different information needs; compare strategies using representative question categories instead of one aggregate quality score.
