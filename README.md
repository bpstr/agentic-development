# Agentic Development

A practical reference to the concepts, protocols, models, frameworks, and tools used to build agentic software.

## Contents

- **[Foundations](foundations/models-agents-and-workflows.md)**
  - [Models, agents, and workflows](foundations/models-agents-and-workflows.md)
  - [Context and prompting](foundations/context-and-prompting.md)
- **Infrastructure**
  - **Models**
  - [Models and providers](infrastructure/models/introduction.md)
  - Selection
    - [Model selection](infrastructure/models/selection/model-selection.md)
    - [Benchmarks and evaluations](infrastructure/models/selection/benchmarks.md)
  - Providers
    - [OpenAI](infrastructure/models/providers/openai.md)
    - [Anthropic](infrastructure/models/providers/anthropic.md)
    - [Google Gemini](infrastructure/models/providers/google.md)
    - [xAI](infrastructure/models/providers/xai.md)
  - Open-weight models
    - [Introduction](infrastructure/models/open-models/introduction.md)
    - [Kimi](infrastructure/models/open-models/kimi.md)
    - [Qwen](infrastructure/models/open-models/qwen.md)
    - [DeepSeek](infrastructure/models/open-models/deepseek.md)
  - **Agent runtime**
  - Calling
    - [Requests and responses](infrastructure/calling/request-response.md)
    - [Tool calling](infrastructure/calling/tool-calling.md)
    - [Streaming and state](infrastructure/calling/streaming-and-state.md)
    - [Managed runtime APIs](infrastructure/calling/runtime-api.md)
  - Tools and protocols
    - [MCP](infrastructure/tools/mcp.md)
    - [Legacy MCP initialization](infrastructure/tools/mcp-legacy.md)
    - [Discovery and authentication](infrastructure/tools/discovery-and-authentication.md)
    - [Agent and UI communication](infrastructure/tools/agent-communication.md)
  - Orchestration
    - [Introduction](infrastructure/orchestration/introduction.md)
    - Execution
      - [Agent loops](infrastructure/orchestration/execution/agent-loops.md)
      - [State and recovery](infrastructure/orchestration/execution/state-and-recovery.md)
      - [Delegation and handoffs](infrastructure/orchestration/execution/delegation.md)
    - Frameworks
      - [LangChain](infrastructure/orchestration/frameworks/langchain.md)
      - [LangGraph](infrastructure/orchestration/frameworks/langgraph.md)
      - [LangSmith](infrastructure/orchestration/frameworks/langsmith.md)
      - [OpenAI Agents SDK](infrastructure/orchestration/frameworks/openai-agents-sdk.md)
      - [OpenAI Agents API](infrastructure/orchestration/frameworks/openai-agents-api.md)
      - [Vercel AI SDK](infrastructure/orchestration/frameworks/vercel-ai-sdk.md)
      - [Claude Managed Agents](infrastructure/orchestration/frameworks/claude-managed-agents.md)
  - **Knowledge**
  - [RAG](infrastructure/knowledge/rag.md)
  - [Graphs, GraphRAG, and Cognee](infrastructure/knowledge/graphs-and-cognee.md)
  - [Memory and indexing](infrastructure/knowledge/memory-and-indexing.md)
- **Interfaces**
  - [Chat rendering](interfaces/chat-rendering.md)
  - [Generative UI](interfaces/generative-ui.md)
  - [Realtime and voice](interfaces/realtime-and-voice.md)
  - **Hosting**
  - [Providers and gateways](infrastructure/hosting/providers-and-gateways.md)
  - [Managed agents and sandboxes](infrastructure/hosting/managed-agents.md)
  - [Deployment](infrastructure/hosting/deployment.md)
- **Operations**
  - [Tracing](operations/tracing.md)
  - [Evaluations](operations/evaluations.md)
  - [Security and permissions](operations/security.md)
  - [Cost and latency](operations/cost-and-latency.md)
- **Development**
  - [Coding agents and persistent bots](development/coding-agents.md)
  - [Skills, plugins, and instructions](development/skills-and-plugins.md)
  - [Plugin development](development/plugin-development.md)
  - [Discovery and proxies](development/discovery-and-proxies.md)
  - [Code intelligence](development/code-intelligence.md)
- **Patterns**
  - [A bounded tool loop](patterns/tool-loop.md)
  - [Grounded answers](patterns/grounded-answers.md)
  - [Background work](patterns/background-work.md)
  - [Incremental architecture](patterns/incremental-build.md)

## Glossary

- **Agent** — a system in which a model can choose actions within a software-controlled execution loop.
- **Agent loop** — repeated inference, action, result, and continuation until a terminal or suspended state.
- **Context** — information made available to a model for an inference step.
- **Embedding** — a vector representation commonly used for similarity retrieval.
- **Generative UI** — interfaces whose structure or component selection is influenced by model output.
- **GraphRAG** — retrieval that uses entities and relationships in addition to or instead of passage similarity.
- **MCP** — Model Context Protocol, a protocol for connecting hosts with tools, resources, and prompts.
- **RAG** — retrieval-augmented generation: retrieving external evidence and supplying it to generation.
- **Tool call** — structured model output requesting an operation exposed by the surrounding system.
- **Workflow** — an execution structure whose stages are substantially determined by application code.

Pages link directly to primary specifications, vendor documentation, papers, model cards, and maintainer repositories where useful.

[MIT license](LICENSE).
