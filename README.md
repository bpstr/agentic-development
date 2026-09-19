# Agentic Development

A practical reference to the concepts, protocols, models, frameworks, and tools used to build agentic software.

## Contents

- **[Foundations](foundations/models-agents-and-workflows.md)**
  - [Models, agents, and workflows](foundations/models-agents-and-workflows.md)
  - [Context and prompting](foundations/context-and-prompting.md)
- **Infrastructure**
  - **Models**
  - [Models and providers](infrastructure/models/model-definition.md)
  - Selection
    - [Model selection](infrastructure/models/selection/model-selection.md)
    - [Benchmarks and evaluations](infrastructure/models/selection/model-benchmarks.md)
  - Providers
    - [OpenAI](infrastructure/models/providers/openai.md)
    - [Anthropic](infrastructure/models/providers/anthropic.md)
    - [Google Gemini](infrastructure/models/providers/google.md)
    - [xAI](infrastructure/models/providers/xai.md)
  - Open-weight models
    - [Introduction](infrastructure/models/open-source/open-models.md)
    - [Kimi](infrastructure/models/open-source/kimi.md)
    - [Qwen](infrastructure/models/open-source/qwen.md)
    - [DeepSeek](infrastructure/models/open-source/deepseek.md)
  - **Agent runtime**
  - Calling
    - [Requests and responses](infrastructure/inference/model-requests-and-responses.md)
    - [Tool calling](infrastructure/tools/tool-calling.md)
    - [Streaming and state](infrastructure/inference/streaming.md)
    - [Managed runtime APIs](infrastructure/inference/runtime-apis.md)
  - Tools and protocols
    - [MCP](infrastructure/protocols/mcp/mcp-definition.md)
    - [Legacy MCP initialization](infrastructure/protocols/mcp/mcp-legacy.md)
    - [Discovery and authentication](infrastructure/protocols/discovery-and-authentication.md)
    - [Agent and UI communication](infrastructure/protocols/agent-communication.md)
  - Orchestration
    - [Introduction](infrastructure/orchestration/orchestration-definition.md)
    - Execution
      - [Agent loops](infrastructure/orchestration/agent-loop.md)
      - [State and recovery](infrastructure/orchestration/state-management.md)
      - [Delegation and handoffs](infrastructure/orchestration/delegation.md)
    - Frameworks
      - [LangChain](infrastructure/orchestration/frameworks/langchain.md)
      - [Google ADK](infrastructure/orchestration/frameworks/google-adk.md)
      - [LangGraph](infrastructure/orchestration/frameworks/langgraph.md)
      - [LangSmith](infrastructure/orchestration/frameworks/langsmith.md)
      - [OpenAI Agents SDK](infrastructure/orchestration/frameworks/openai-agents-sdk.md)
      - [OpenAI Agents API](infrastructure/orchestration/frameworks/openai-agents-api.md)
      - [Vercel AI SDK](infrastructure/orchestration/frameworks/vercel-ai-sdk.md)
      - [Claude Managed Agents](infrastructure/orchestration/frameworks/claude-managed-agents.md)
  - **Knowledge**
  - [RAG](infrastructure/knowledge/rag/rag-definition.md)
  - [Graphs, GraphRAG, and Cognee](infrastructure/knowledge/graphrag/graphrag-and-knowledge-graphs.md)
  - [Memory and indexing](infrastructure/knowledge/memory/memory-and-indexing.md)
- **Interfaces**
  - [Chat rendering](interfaces/chat/chat-interfaces.md)
  - [Generative UI](interfaces/generative-ui/generative-ui-definition.md)
  - [Realtime and voice](interfaces/realtime/realtime-and-voice.md)
  - **Hosting**
  - [Providers and gateways](infrastructure/hosting/providers-and-gateways.md)
  - [Managed agents and sandboxes](infrastructure/hosting/managed-agents.md)
  - [Deployment](infrastructure/hosting/deployment.md)
- **Operations**
  - [Tracing](operations/observability/tracing.md)
  - [Evaluations](operations/evaluation/agent-evaluation.md)
  - [Security and permissions](operations/security/agent-security.md)
  - [Cost and latency](operations/performance/cost-and-latency.md)
- **Development**
  - [Coding agents and persistent bots](development/coding-agents/coding-agent-definition.md)
  - [Skills, plugins, and instructions](development/skills/skill-definition.md)
  - [Plugin development](development/plugins/plugin-development.md)
  - [Discovery and proxies](development/proxies/proxy-definition.md)
  - [Code intelligence](development/code-intelligence/code-intelligence.md)
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
