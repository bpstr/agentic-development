# Data isolation

Data isolation prevents one user's or tenant's information from entering another's execution context. Apply it to source queries, retrieval, conversation history, memory, caches, artifacts, tool results, and traces. Filtering only the final answer is too late if unauthorized content has already reached the model.

Derive tenant and actor scope from trusted identity. Carry that scope through background jobs and delegated calls. A model-supplied workspace ID can identify a requested target, but the application must establish whether the actor can access it.

For retrieval, filter candidate sources before returning content and re-check access where permissions can change. Scope derived summaries and graph relationships as well as original documents. A summary of private records remains private even when it contains no document identifier.

[PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) can enforce database policies, but table ownership, bypass privileges, and connection identity require careful configuration. Database policies also do not automatically constrain an external vector index or answer cache.

For example, include authorized scope and source revisions in a cached release summary's validity contract. Revoking access must prevent reuse even while the cached text remains stored.

Test overlapping resource names, guessed identifiers, shared indexes, reassigned documents, revoked memberships, and resumed jobs. Record denials without exposing the private object's existence. Isolation should remain valid when the model deliberately requests data outside its permitted scope.

## Graph traversal and derived artifacts

Authorize intermediate nodes, edge evidence, and original passages, not only the final returned document. A permitted task can be connected through a restricted project; returning the path's names, counts, or relevance explanation can disclose that project even if its document body is removed.

A namespace, nodeset, workspace label, graph name, or dataset ID is an identifier until a trusted service enforces access to it. Verify the selected backend's routing and grants. In particular, [Cognee dataset handlers](../../infrastructure/knowledge/graphrag/integrations/cognee-production-integration.md) and [Graphiti group isolation](../../infrastructure/knowledge/memory/frameworks/graphiti.md) have implementation-specific boundaries that should be tested under concurrent requests.

For community reports, authorize all contributing sources or build the report within a compatible sharing boundary. Removing citations from an already generated report is not redaction of its information. Revoke cached contexts and source-derived descriptions when permissions change, and ensure queued workers cannot republish stale authorized copies.

Use the restricted-project and cross-workspace cases in [GraphRAG evaluation](../evaluation/graphrag-evaluation.md). Assert that forbidden material never reaches external rerankers, model prompts, or accessible traces; an answer that happens to omit it does not make the run safe.
