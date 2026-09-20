# Answers grounded in workspace documents

Answer “What must we verify before the next release?” using documents the current user can access, while linking each material claim to its source. This is an illustrative implementation design; no retrieval backend is provisioned by this recipe.

## Start with the question's data needs

If the user asks for the current status of task `APP-42`, use the application API. If they ask about a written release procedure, retrieve relevant document sections. If they ask which dependencies block release, query explicit relationships before introducing a graph extracted from prose. See [knowledge sources](../infrastructure/knowledge/knowledge-sources.md).

## Carry provenance through the pipeline

Parse documents into sections with a source ID, revision, title, canonical URL, and access scope. Store retrieval metadata alongside each chunk. At query time, apply the user's access constraints during retrieval and verify them before returning the source content.

For a small document set, keyword search or a database query can be sufficient. Add embeddings, hybrid search, or reranking when evaluation cases show the need. The [RAG pipeline](../infrastructure/knowledge/rag/rag-pipeline.md) explains those mechanisms.

An application-owned context record could be:

```json
{
  "question": "What must we verify before the next release?",
  "sources": [
    {
      "id": "release-guide:revision-8:section-3",
      "title": "Release guide",
      "url": "https://example.com/docs/release-guide#checks",
      "text": "Confirm the database migration rollback and smoke-test checkout."
    }
  ]
}
```

The source and URL are synthetic. In a real application, the context should contain only sources already authorized by the server. Do not ask the model to decide whether the user is allowed to see them.

## Generate an answer that can be checked

Ask the model to answer from the provided sources, identify unresolved gaps, and cite the source IDs. The application can map those IDs to known URLs instead of trusting arbitrary generated links. Check that cited IDs exist in the retrieved set. That check detects fabricated identifiers; it does not prove that every claim is supported, so include attribution quality in evaluation.

When no source answers the question, return a useful gap: “The release guide covers migration rollback and checkout tests; it does not specify who approves the release.” This is preferable to inventing an approver.

## Evaluate and maintain

Include cases with an exact answer, synonymous wording, contradictory revisions, no answer, and a relevant document the user cannot access. Measure retrieval quality separately from answer quality. Revoke access and delete a source, then verify the system no longer retrieves its chunks or derived summaries.

Only consider [GraphRAG](../infrastructure/knowledge/graphrag/graphrag-definition.md) when relationship reasoning, corpus summaries, or reusable memory make their additional indexing and operational work worthwhile. Keep source documents as the reference for extracted claims.
