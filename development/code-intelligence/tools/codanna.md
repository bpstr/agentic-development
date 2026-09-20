# Codanna

Official documentation: [Codanna](https://docs.codanna.sh/). Canonical repository: [bartolli/codanna](https://github.com/bartolli/codanna).

Codanna is a Rust-based code-intelligence CLI and MCP server. It indexes repositories and exposes symbol retrieval, semantic search, call relationships, dependency information, and impact analysis for coding agents.

## Index and query a repository

Install with the current platform instructions. The documented Homebrew path and basic lifecycle are:

```bash
brew install codanna
cd your-project
codanna init
codanna index src
codanna mcp find_symbol name:"create_invoice"
codanna mcp semantic_search_with_context   query:"where webhook retries are scheduled"
```

Replace `src` and the symbol with paths and names from the actual project. Initialization creates project configuration; indexing supplies the evidence that subsequent queries use.

For a persistent MCP connection, the repository documents:

```bash
codanna serve
```

The default server transport is stdio. Configure the agent host to launch it with the intended working directory and executable path, then inspect the available tools and run a known symbol query.

## Assess the returned evidence

A combined result can reduce repeated searching by supplying a symbol's location and related calls. Read those source locations before accepting an impact conclusion. Dynamic dispatch, generated code, dependency injection, and stale indexes can leave missing or misleading relationships.

Keep project boundaries and index freshness explicit. Test an edit, deletion, and two repositories with similar symbols before relying on a shared service setup. Check embedding and provider configuration when evaluating data locality: the location of the index alone does not establish where every configured processing step runs.
