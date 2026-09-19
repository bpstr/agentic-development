# Agentic Development

A practical handbook for understanding, building, operating, and extending systems that use AI models to do work.

Start with the concepts, follow a request through a real system, then explore representative tools in the layer where they belong. Pages stay intentionally focused: provider, framework, protocol, and product details get their own files rather than growing into aggregate pages.

**Start here:** [System map](docs/00-orientation/system-map.md) · [Learning paths](docs/00-orientation/learning-paths.md) · [Glossary](docs/12-reference/glossary.md) · [Tool and topic index](docs/12-reference/topic-index.md)

## Chapters

- [00 · Orientation](docs/00-orientation/README.md) — system map, reading paths, evidence, and maintenance.
- [01 · Foundations](docs/01-foundations/README.md) — models, agents, generative AI, workflows, context, and prompting.
- [02 · Models and providers](docs/02-models-and-providers/README.md) — model selection, individual providers, open-weight families, benchmarks, and pricing sources.
- [03 · Calling models](docs/03-calling-models/README.md) — requests, responses, structured output, streaming, state, and tool calls.
- [04 · Tools and protocols](docs/04-tools-and-protocols/README.md) — MCP, authentication, discovery, A2A, and protocol boundaries.
- [05 · Orchestration](docs/05-orchestration/README.md) — agent loops, durable execution, delegation, and individual orchestration frameworks.
- [06 · Knowledge and memory](docs/06-knowledge-and-memory/README.md) — RAG, GraphRAG, Cognee, indexing, retrieval, provenance, and memory.
- [07 · Interfaces and rendering](docs/07-interfaces-and-rendering/README.md) — assistant-ui, AI Elements, generative UI, OpenUI, A2UI, AG-UI, and voice.
- [08 · Hosting and delivery](docs/08-hosting-and-delivery/README.md) — inference, managed agents, gateways, local serving, and deployment.
- [09 · Evaluation and operations](docs/09-evaluation-and-operations/README.md) — tracing, evaluations, security, reliability, cost, and latency.
- [10 · Development workflows](docs/10-development-workflows/README.md) — Codex, Claude Code, Grok Bot, skills, plugins, proxies, Graphify, and Codanna.
- [11 · Practical recipes](docs/11-recipes/README.md) — tool execution, grounded answers, background work, and incremental architecture.
- [12 · Reference](docs/12-reference/README.md) — glossary, topic index, primary sources, and coverage.

## Enter through a question

- **I know web development, but the AI terminology is overwhelming.** Follow [the first reading path](docs/00-orientation/learning-paths.md).
- **A model requested a tool. What runs next?** Read [tool calling](docs/03-calling-models/tool-calling.md), then run the [offline example](examples/tool-loop/README.md).
- **Should I use a framework or call a provider directly?** Start with [orchestration](docs/05-orchestration/introduction.md), then inspect the [framework directory](docs/05-orchestration/frameworks/README.md).
- **Do I need a vector database or a graph?** Start with [RAG](docs/06-knowledge-and-memory/rag.md) and [graphs and Cognee](docs/06-knowledge-and-memory/graphs-and-cognee.md).
- **Why is my agent slow?** Learn [tracing](docs/09-evaluation-and-operations/tracing.md) and [cost and latency](docs/09-evaluation-and-operations/cost-and-latency.md).
- **What is the difference between skills, plugins, and MCP?** Start with [extensions](docs/10-development-workflows/skills-and-plugins.md).

## How to read the evidence

The first edition's source review is dated **2026-09-19**. Product details and protocols can change; individual pages identify their reviewed sources and version boundaries.

**Source-reviewed** means a description was checked against primary material. **Locally tested** means a repository example was actually run, with scope recorded. **Illustrative** means a teaching example rather than an executed integration. Inclusion is not a claim that this repository has independently tested or certified a product. See the [editorial policy](docs/00-orientation/editorial-policy.md).

## Run the small example

No package installation, API key, or paid call is required. With Node.js 20+ and Python 3.10+:

```sh
node examples/tool-loop/demo.mjs
node --test examples/tool-loop/agent-loop.test.mjs
python3 scripts/check_docs.py
```

## Maintain and expand

Read the [implementation plan](PLAN.md), [contribution guide](CONTRIBUTING.md), and [verification record](VERIFICATION.md). Prefer a focused new page or nested directory over adding unrelated material to an existing page.

[MIT license](LICENSE).
