# Language Server Protocol

Official specification: [Language Server Protocol](https://microsoft.github.io/language-server-protocol/). Canonical definition request: [LSP 3.17 definition specification](https://github.com/microsoft/language-server-protocol/blob/gh-pages/_specifications/lsp/3.17/language/definition.md).

The Language Server Protocol (LSP) standardizes communication between development clients and language servers. It lets editors and other tools access capabilities such as definitions, references, diagnostics, completion, and renaming through a common interface.

LSP is a protocol, not an implementation of every programming language. A client must start or connect to an appropriate server, initialize it with the project context, negotiate supported capabilities, and keep document state synchronized.

## Request a definition

After initialization and relevant document synchronization, an illustrative JSON-RPC request body is:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "textDocument/definition",
  "params": {
    "textDocument": {"uri": "file:///workspace/app/src/invoice.ts"},
    "position": {"line": 12, "character": 8}
  }
}
```

Line and character positions are zero-based; character units follow the negotiated position encoding. The server can return locations or location links, or no result when it cannot resolve the symbol. The JSON body is carried with the protocol's required framing; sending raw JSON to any shell process is insufficient.

## Use in agent retrieval

An agent integration can wrap navigation results as tools and return source evidence. Correct project configuration matters: dependencies, compiler options, generated files, and document versions can change results.

Check the advertised capabilities before assuming a server supports call hierarchy or rename. LSP exposes a useful analysis interface, while the server's implementation determines semantic coverage and accuracy.
