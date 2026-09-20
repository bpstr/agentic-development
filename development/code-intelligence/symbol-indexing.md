# Symbol indexing

Symbol indexing records named program elements such as functions, methods, classes, modules, and variables, together with their source locations and available semantic relationships. It supports exact navigation and targeted context retrieval.

A useful index distinguishes a symbol's identity from its display name. Two packages can define `Client`, and a method can move between files without becoming the same symbol as every other method of that name.

An illustrative record is:

```json
{
  "repository": "billing-service",
  "path": "src/invoices/create.ts",
  "qualified_name": "InvoiceService.create",
  "kind": "method",
  "revision": "example-source-revision"
}
```

This is an application design example, not a standardized index schema. Real implementations also need source ranges, language information, and a strategy for updating identities after edits.

Syntax parsers can discover declarations. Resolving references and call targets often requires imports, types, build configuration, and language-specific rules. [Tree-sitter](tools/tree-sitter.md) and the [Language Server Protocol](tools/language-server-protocol.md) sit at different points in that workflow.

## Keep the index aligned with source

Handle additions, modifications, deletions, and renames explicitly. Separate repositories and worktrees even when they share file names. Include generated sources only when they contribute useful navigation, and avoid returning removed files as current evidence.

A symbol query should return enough location information to inspect the source. A name match by itself is too weak to support an architectural conclusion or a broad rename.
