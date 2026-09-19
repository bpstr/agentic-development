# Code intelligence

[Handbook](../../README.md) · [Chapter](README.md)

**Source review: 2026-09-19. Evidence: source-reviewed; examples are illustrative. No indexing, retrieval, or performance benchmark was run for this handbook.**

Code intelligence helps an agent retrieve relevant program structure and evidence. Instead of repeatedly guessing filenames, it can locate a symbol, inspect relationships, or find code by its purpose. The index helps choose what to inspect; the current source remains the evidence for a change.

## Retrieval mechanisms

| Mechanism | Useful question | Limitation to consider |
| --- | --- | --- |
| Text search | Where does this exact identifier or error appear? | Different wording and aliases may hide matches |
| Syntax parsing | Which functions, classes, or imports occur here? | Syntax alone does not establish all runtime relationships |
| Language-server integration | What language-aware navigation does this server expose? | Capabilities and project configuration vary by server |
| Semantic search | Where do we handle retries, without knowing names? | Similarity produces candidates, not proof of behavior |
| Relationship graph | What calls this function or depends on this module? | Edge coverage and resolution quality matter |

[ripgrep](https://github.com/BurntSushi/ripgrep) is a useful text-search baseline. [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) supplies incremental syntax parsing. The [Language Server Protocol](https://github.com/microsoft/language-server-protocol) defines a common language-server interface. These mechanisms can be combined; a graph and an embedding index answer different questions.

## Codanna: indexed code retrieval

[`bartolli/codanna`](https://github.com/bartolli/codanna) is a Rust-based local code-intelligence CLI and MCP server. Its documented capabilities include symbol and semantic search, call relationships, dependency tracking, document retrieval, and impact analysis. The [maintainer documentation](https://docs.codanna.sh/) exposes operations including `find_symbol`, `find_callers`, and `semantic_search_with_context`.

After installing and indexing a project according to its documentation, an illustrative query is:

```bash
codanna mcp semantic_search_with_context \
  query:"where webhook retries are scheduled"
```

Inspect the returned symbols and source locations before accepting an impact claim. Project configuration, supported language semantics, and index freshness matter. The documentation also permits remote embedding endpoints, so a local indexing process does not by itself establish that every configured workflow stays on the machine. A cloud coding agent can separately receive the retrieved code. [Codanna capabilities and configuration](https://docs.codanna.sh/)

## Graphify: traversable project relationships

[Graphify.net](https://graphify.net/) combines project guides, repository graph galleries, and a hosted MCP entry point. Its [Graphify skill guide](https://graphify.net/skills/graphify/) explicitly identifies [`Graphify-Labs/graphify`](https://github.com/Graphify-Labs/graphify) as the canonical repository; the site's GitHub and PyPI links lead to that project and the `graphifyy` package. The local executable is `graphify`.

The upstream README describes local deterministic code parsing, graph traversal without a vector store, and an optional model-assisted pass over documents and media. The example below follows that CLI. The site's separate Graphify AI installation block names `private-context-mcp` and `private-context`, while [its hosted workspace](https://app.graphify.net/) requires sign-in. Keep those setup paths distinct; this review does not establish equivalence between the hosted service and the open-source CLI. [Site and installation details](https://graphify.net/), [upstream usage](https://github.com/Graphify-Labs/graphify)

The project distinguishes relationships extracted directly from source from relationships inferred through resolution. That distinction is useful when reviewing a path: ask which edges are explicit and which need validation. The documented CLI includes scoped queries, explanations, and paths. An illustrative query after graph construction is:

```bash
graphify query "How does an incoming webhook create an invoice?"
```

A graph visualization can aid exploration, but the existence of a path does not establish that the path executes for a given request. Read the relevant conditions and tests. This is a handbook interpretation of the mechanism, not an independently reproduced Graphify result. [Graphify source and usage](https://github.com/Graphify-Labs/graphify)

## Evaluate against the repository you actually use

Use a small set of questions with known answers: an exact symbol, an indirect caller, a renamed file, a dependency wired through configuration, and two projects with similar symbols. Measure correctness and missing results alongside initial index time, update time, query latency, and context returned.

Include changes after indexing and verify project isolation. Dynamic dispatch, generated code, framework registration, and stale files make useful probes. A result containing plausible filenames is weaker than a result that identifies the relevant code and explains its uncertainty.

Choose an additional index when it improves these tasks enough to justify maintaining it. Neither implementation language nor star count establishes retrieval quality or end-to-end agent speed.

Related: [knowledge and memory](../06-knowledge-and-memory/README.md), [coding agents](coding-agents.md), [evaluation and operations](../09-evaluation-and-operations/README.md).
