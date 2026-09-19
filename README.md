# Agentic Development

A practical reference to the concepts, protocols, models, frameworks, and tools used to build agentic software.

The repository is arranged like a technical book. The README is the table of contents; individual pages are self-contained reference chapters and should make sense when opened directly.

## Contents

- **Foundations**
  - [Models, agents, and workflows](docs/01-foundations/models-agents-and-workflows.md)
  - [Context and prompting](docs/01-foundations/context-and-prompting.md)
- **Models and providers**
  - [Introduction](docs/02-models-and-providers/introduction.md)
  - Selection
    - [Model selection](docs/02-models-and-providers/selection/model-selection.md)
    - [Benchmarks and evaluations](docs/02-models-and-providers/selection/benchmarks.md)
  - Providers
    - [OpenAI](docs/02-models-and-providers/providers/openai.md)
    - [Anthropic](docs/02-models-and-providers/providers/anthropic.md)
    - [Google Gemini](docs/02-models-and-providers/providers/google.md)
    - [xAI](docs/02-models-and-providers/providers/xai.md)
  - Open-weight models
    - [Introduction](docs/02-models-and-providers/open-models/README.md)
    - [Kimi](docs/02-models-and-providers/open-models/kimi.md)
    - [Qwen](docs/02-models-and-providers/open-models/qwen.md)
    - [DeepSeek](docs/02-models-and-providers/open-models/deepseek.md)
- **Calling models**
  - [Requests, responses, and structured output](docs/03-calling-models/request-response.md)
  - [Tool calling](docs/03-calling-models/tool-calling.md)
  - [Streaming and conversation state](docs/03-calling-models/streaming-and-state.md)
  - [Managed agent runtime calls](docs/03-calling-models/runtime-api.md)
- **Tools and protocols**
  - [MCP](docs/04-tools-and-protocols/mcp.md)
  - [Legacy MCP initialization](docs/04-tools-and-protocols/mcp-legacy.md)
  - [Discovery and authentication](docs/04-tools-and-protocols/discovery-and-authentication.md)
  - [Agent and UI communication](docs/04-tools-and-protocols/agent-communication.md)
- **Orchestration**
  - [Introduction](docs/05-orchestration/introduction.md)
  - Execution
    - [Agent loops](docs/05-orchestration/execution/agent-loops.md)
    - [State and recovery](docs/05-orchestration/execution/state-and-recovery.md)
    - [Delegation and handoffs](docs/05-orchestration/execution/delegation.md)
  - Frameworks
    - [LangChain](docs/05-orchestration/frameworks/langchain.md)
    - [LangGraph](docs/05-orchestration/frameworks/langgraph.md)
    - [LangSmith](docs/05-orchestration/frameworks/langsmith.md)
    - [OpenAI Agents SDK](docs/05-orchestration/frameworks/openai-agents-sdk.md)
    - [OpenAI Agents API](docs/05-orchestration/frameworks/openai-agents-api.md)
    - [Vercel AI SDK](docs/05-orchestration/frameworks/vercel-ai-sdk.md)
    - [Claude Managed Agents](docs/05-orchestration/frameworks/claude-managed-agents.md)
- **Knowledge and memory**
  - [RAG](docs/06-knowledge-and-memory/rag.md)
  - [Graphs, GraphRAG, and Cognee](docs/06-knowledge-and-memory/graphs-and-cognee.md)
  - [Memory and indexing](docs/06-knowledge-and-memory/memory-and-indexing.md)
- **Interfaces and rendering**
  - [Chat rendering](docs/07-interfaces-and-rendering/chat-rendering.md)
  - [Generative UI](docs/07-interfaces-and-rendering/generative-ui.md)
  - [Realtime and voice](docs/07-interfaces-and-rendering/realtime-and-voice.md)
- **Hosting and delivery**
  - [Providers and gateways](docs/08-hosting-and-delivery/providers-and-gateways.md)
  - [Managed agents and sandboxes](docs/08-hosting-and-delivery/managed-agents.md)
  - [Deployment](docs/08-hosting-and-delivery/deployment.md)
- **Evaluation and operations**
  - [Tracing](docs/09-evaluation-and-operations/tracing.md)
  - [Evaluations](docs/09-evaluation-and-operations/evaluations.md)
  - [Security and permissions](docs/09-evaluation-and-operations/security.md)
  - [Cost and latency](docs/09-evaluation-and-operations/cost-and-latency.md)
- **Development workflows**
  - [Coding agents and persistent bots](docs/10-development-workflows/coding-agents.md)
  - [Skills, plugins, and instructions](docs/10-development-workflows/skills-and-plugins.md)
  - [Plugin development](docs/10-development-workflows/plugin-development.md)
  - [Discovery and proxies](docs/10-development-workflows/discovery-and-proxies.md)
  - [Code intelligence](docs/10-development-workflows/code-intelligence.md)
- **Practical patterns**
  - [A bounded tool loop](docs/11-recipes/tool-loop.md)
  - [Grounded answers](docs/11-recipes/grounded-answers.md)
  - [Background work](docs/11-recipes/background-work.md)
  - [Incremental architecture](docs/11-recipes/incremental-build.md)

## Glossary

- **Agent** — a system in which a model can choose actions within a software-controlled execution loop.
- **Agent loop** — repeated inference, action, result, and continuation until a terminal or suspended state.
- **Context** — the information made available to a model for an inference step.
- **Embedding** — a vector representation used for similarity retrieval.
- **Generative UI** — interfaces whose structure or component selection is influenced by model output.
- **GraphRAG** — retrieval that uses entities and relationships in addition to or instead of passage similarity.
- **MCP** — Model Context Protocol, a protocol for connecting hosts with tools, resources, and prompts.
- **RAG** — retrieval-augmented generation: retrieving external evidence and supplying it to generation.
- **Tool call** — structured model output requesting an operation exposed by the surrounding system.
- **Workflow** — an execution structure whose stages are substantially determined by application code.

The longer [glossary](docs/12-reference/glossary.md) remains available for less common terms.

## Sources and verification

Pages link directly to primary specifications, vendor documentation, model cards, papers, and maintainer repositories where they are relevant. Product facts are dated where freshness matters. Examples are illustrative unless the repository explicitly records a test in [VERIFICATION.md](VERIFICATION.md).

[MIT license](LICENSE).
