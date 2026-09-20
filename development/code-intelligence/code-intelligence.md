# Code intelligence

Code intelligence makes program structure and source evidence available for navigation, analysis, and change planning. An agent can locate a symbol, inspect callers, search by purpose, or trace a dependency instead of repeatedly guessing filenames.

Different mechanisms answer different questions:

| Mechanism | Useful question | Practical limit |
| --- | --- | --- |
| Text search | Where does this identifier appear? | Misses alternate wording and unresolved aliases |
| Syntax parsing | Which functions or imports occur here? | Syntax does not establish all runtime behavior |
| Language-server navigation | Where is this symbol defined or referenced? | Depends on server capabilities and project configuration |
| Semantic retrieval | Where is retry behavior implemented? | Similarity identifies candidates, not proof |
| Relationship graph | What depends on this module? | Edge coverage and resolution quality determine usefulness |

[ripgrep](https://github.com/BurntSushi/ripgrep) provides a useful exact-search baseline. [Tree-sitter](tools/tree-sitter.md), [language servers](tools/language-server-protocol.md), [Codanna](tools/codanna.md), and [Graphify](tools/graphify.md) implement additional mechanisms.

## Evaluate with known answers

Use a small repository fixture containing an exact symbol, indirect caller, renamed file, framework registration, and two projects with similar names. Measure correctness, missing results, initial indexing cost, update latency, query latency, and returned context size.

Include changes after indexing. A stale graph or embedding index can return convincing paths that no longer exist. Inspect current source before making an edit or asserting impact.

The best index is the one that improves task outcomes enough to justify maintaining it. Implementation language, graph size, and installation count do not establish retrieval quality.
