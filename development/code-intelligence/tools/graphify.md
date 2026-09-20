# Graphify

Canonical repository: [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify). Project site: [Graphify.net](https://graphify.net/), [Graphify skill guide](https://graphify.net/skills/graphify/).

Graphify turns project content into a queryable relationship graph. Its open-source tooling uses local syntax parsing for code, with optional model-assisted extraction for documents and other media. The graph supports exploration and retrieval for coding agents.

## Build and query a code graph

The maintainer identifies `graphifyy`, with a double final `y`, as the Python package; the executable remains `graphify`. A documented local code-only path is:

```bash
uv tool install graphifyy
cd your-project
graphify extract ./src --code-only
graphify query "How does a webhook create an invoice?"
```

The code-only extraction mode skips document and media extraction that requires model processing. Query and integration behavior still depend on the installed configuration. Inspect the produced graph and source references rather than relying on the appearance of a visualization.

The repository also supplies agent integrations and a skill. Installing the executable and installing an agent-specific procedure are distinct steps; follow the setup for the intended client.

## Interpret relationships carefully

A graph path can reveal candidate dependencies and connected concepts. It does not prove that every path executes for a request. Preserve edge types, extraction provenance, and current source locations when drawing architectural conclusions.

The website also presents a hosted service. Its installation and account workflow should not be assumed equivalent to the open-source CLI. Evaluate the exact product path being used, including where content is processed, how updates are indexed, and which graph outputs are shared.
