# Agentic Development

A practical handbook for understanding, building, operating, and extending systems that use AI models to do work.

Start with the concepts, follow a request through a real system, then explore representative tools in the layer where they belong. Pages provide short explanations, concrete examples, tradeoffs, and links to primary documentation. You can read the handbook in order or enter through a question below.

**Start here:** [System map](docs/00-orientation/system-map.md) · [Learning paths](docs/00-orientation/learning-paths.md) · [Glossary](docs/12-reference/glossary.md) · [Tool and topic index](docs/12-reference/topic-index.md)

## Chapters

| Chapter | The question | Topics |
| --- | --- | --- |
| [00 · Orientation](docs/00-orientation/README.md) | How does this field fit together? | System map, reading paths, evidence and maintenance |
| [01 · Foundations](docs/01-foundations/README.md) | What makes a system agentic? | Models, agents, generative AI, workflows, context, prompting |
| [02 · Models and providers](docs/02-models-and-providers/README.md) | Which capabilities does my workload need? | OpenAI Astra/Sol, Anthropic, Google, xAI, Kimi, open weights, benchmarks, pricing resources |
| [03 · Calling models](docs/03-calling-models/README.md) | What is sent, returned, and executed? | Request/response examples, structured output, streaming, conversation state, tool calls |
| [04 · Tools and protocols](docs/04-tools-and-protocols/README.md) | How do systems discover and invoke capabilities? | MCP, authentication, discovery, A2A, protocol boundaries |
| [05 · Orchestration](docs/05-orchestration/README.md) | Who controls the work and remembers progress? | Agent loops, durable execution, delegation, LangChain, LangGraph, agent SDKs |
| [06 · Knowledge and memory](docs/06-knowledge-and-memory/README.md) | How does the agent use information outside its model? | RAG, GraphRAG, Cognee, indexing, retrieval, provenance, memory |
| [07 · Interfaces and rendering](docs/07-interfaces-and-rendering/README.md) | How do people see, guide, and interrupt work? | assistant-ui, AI Elements, generative UI, OpenUI, A2UI, AG-UI, voice |
| [08 · Hosting and delivery](docs/08-hosting-and-delivery/README.md) | Where does each part run? | Inference, managed agents, gateways, Hugging Face, OpenRouter, local serving, deployment |
| [09 · Evaluation and operations](docs/09-evaluation-and-operations/README.md) | How do we know it works correctly and efficiently? | Tracing, LangSmith, evaluations, security, reliability, cost, latency |
| [10 · Development workflows](docs/10-development-workflows/README.md) | How do we develop with agents and extend them? | Codex, Claude Code, Grok Bot, skills, plugins, Skills.sh, proxies, Graphify, Codanna |
| [11 · Practical recipes](docs/11-recipes/README.md) | How do these pieces form an application? | Tool execution, grounded answers, background work, incremental architecture |
| [12 · Reference](docs/12-reference/README.md) | Where is that term, tool, or official resource? | Glossary, category index, primary sources, requested-topic coverage |

## Enter through a question

- **I know web development, but the AI terminology is overwhelming.** Follow [the first reading path](docs/00-orientation/learning-paths.md).
- **A model requested a tool. What runs next?** Read [tool calling](docs/03-calling-models/tool-calling.md), then run the [offline example](examples/tool-loop/README.md).
- **Should I use a framework or call a provider directly?** Compare [execution choices](docs/05-orchestration/frameworks.md) and [hosting responsibilities](docs/08-hosting-and-delivery/deployment.md).
- **Do I need a vector database or a graph?** Start with [RAG](docs/06-knowledge-and-memory/rag.md) and [graphs and Cognee](docs/06-knowledge-and-memory/graphs-and-cognee.md).
- **Why is my agent slow?** Learn [tracing](docs/09-evaluation-and-operations/tracing.md) and [cost and latency](docs/09-evaluation-and-operations/cost-and-latency.md).
- **What is the difference between skills, plugins, and MCP?** Start with [extensions](docs/10-development-workflows/skills-and-plugins.md).

## How to read the evidence

The first edition's source review is dated **2026-09-19**. Product details and protocols can change; individual pages identify their reviewed sources and version boundaries. Pricing and benchmark pages are linked directly so readers can consult the current figures and methodology.

**Source-reviewed** means a description was checked against primary material. **Locally tested** means a repository example was actually run, with scope recorded. **Illustrative** means a teaching example rather than an executed integration. Inclusion is not a claim that this repository has independently tested or certified a product. See the [editorial policy](docs/00-orientation/editorial-policy.md).

## Run the small example

No package installation, API key, or paid call is required. With Node.js 20+ and Python 3.10+:

```sh
node examples/tool-loop/demo.mjs
node --test examples/tool-loop/agent-loop.test.mjs
python3 scripts/check_docs.py
```

The example uses a scripted model to show the loop deterministically. Provider wire examples live in the chapters and are labeled separately.

## Maintain and expand

Read the [implementation plan](PLAN.md), [contribution guide](CONTRIBUTING.md), and [verification record](VERIFICATION.md). Add a missing concept or decision before adding another product. Keep primary sources, examples, and navigation useful as the ecosystem changes.

[MIT license](LICENSE).
