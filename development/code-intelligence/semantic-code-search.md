# Semantic code search

Semantic code search retrieves code whose meaning is similar to a query, even when the query does not contain the same identifiers. It is useful for questions such as “where do failed payments get retried?” when the relevant code is named `scheduleAttempt`.

An embedding-based implementation represents code units and the query as vectors, retrieves nearby candidates, and may rerank them. The unit can be a function, class, file section, or another bounded chunk. Include enough surrounding information to disambiguate similar code without overwhelming the result.

## Retrieval is a starting point

A practical workflow combines semantic candidates with exact evidence:

1. Search by behavior.
2. Inspect the returned symbol and source.
3. Follow callers, imports, and persistence effects.
4. Check the tests that establish actual behavior.

Similarity scores are ranking signals within a particular configuration. They are not probabilities that a function is correct or that it executes on the path in question.

Version the embedding model and chunking strategy with the index. Changes can require re-embedding, while normal source edits require incremental updates and deletion handling. Apply repository and access filters before exposing results from multiple projects.

[Codanna](tools/codanna.md) combines semantic retrieval with symbol context and relationships. Evaluate such combinations against lexical search on realistic tasks, including misleading comments, duplicated implementations, and a recently renamed function. A good result narrows inspection and explains its source rather than substituting a plausible summary for code.
