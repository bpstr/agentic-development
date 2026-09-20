# Code graphs

A code graph represents program elements as nodes and their relationships as typed edges. Nodes can describe files, modules, symbols, configuration entries, or tests. Edges can express calls, imports, inheritance, references, ownership, or documented associations.

The edge type matters. “Imports,” “calls,” and “mentions” are different claims. A dependency graph built from imports cannot establish every runtime call, and a model-inferred association should not be presented as a compiler-resolved relationship.

An illustrative edge record is:

```json
{
  "source": "WebhookHandler.handle",
  "target": "InvoiceService.create",
  "relation": "calls",
  "evidence": {"path": "src/WebhookHandler.php", "line": 42},
  "extraction": "static-analysis"
}
```

This object demonstrates provenance rather than prescribing a graph format. Real systems should preserve extraction method, source revision, and uncertainty where resolution is incomplete.

## Useful traversals

Forward traversal can locate dependencies used by a symbol. Reverse traversal can identify potential callers or dependents. Short paths help explain how components connect. Bound traversal depth and filter edge types to avoid returning the whole repository for every query.

Graph reachability establishes a possible relationship in the indexed model. Runtime conditions, dependency injection, reflection, generated code, and asynchronous messaging can change actual behavior. Inspect source and tests before turning a path into an impact claim.

[Graphify](tools/graphify.md) and [Codanna](tools/codanna.md) expose code relationships for agent retrieval. Evaluate missing and incorrectly resolved edges as carefully as query speed.
