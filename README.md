# Agentic Development

A practical reference to the concepts, protocols, models, frameworks, and tools used to build agentic software.

## Contents

- **[Foundations](foundations/models-agents-and-workflows.md)**
  - [Models, agents, and workflows](foundations/models-agents-and-workflows.md)
  - [Context and prompting](foundations/context-and-prompting.md)
- **Models**
  - [Models and providers](models/introduction.md)
  - Selection
    - [Model selection](models/selection/model-selection.md)
    - [Benchmarks and evaluations](models/selection/benchmarks.md)
  - Providers
    - [OpenAI](models/providers/openai.md)
    - [Anthropic](models/providers/anthropic.md)
    - [Google Gemini](models/providers/google.md)
    - [xAI](models/providers/xai.md)
  - Open-weight models
    - [Introduction](models/open-models/introduction.md)
    - [Kimi](models/open-models/kimi.md)
    - [Qwen](models/open-models/qwen.md)
    - [DeepSeek](models/open-models/deepseek.md)
- **Agent systems**
  - Calling
    - [Requests and responses](agent-systems/calling/request-response.md)
    - [Tool calling](agent-systems/calling/tool-calling.md)
    - [Streaming and state](agent-systems/calling/streaming-and-state.md)
    - [Managed runtime APIs](agent-systems/calling/runtime-api.md)
  - Tools and protocols
    - [MCP](agent-systems/tools/mcp.md)
    - [Legacy MCP initialization](agent-systems/tools/mcp-legacy.md)
    - [Discovery and authentication](agent-systems/tools/discovery-and-authentication.md)
    - [Agent and UI communication](agent-systems/tools/agent-communication.md)
  - Orchestration
    - [Introduction](agent-systems/orchestration/introduction.md)
    - Execution
      - [Agent loops](agent-systems/orchestration/execution/agent-loops.md)
      - [State and recovery](agent-systems/orchestration/execution/state-and-recovery.md)
      - [Delegation and handoffs](agent-systems/orchestration/execution/delegation.md)
    - Frameworks
      - [LangChain](agent-systems/orchestration/frameworks/langchain.md)
      - [LangGraph](agent-systems/orchestration/frameworks/langgraph.md)
      - [LangSmith](agent-systems/orchestration/frameworks/langsmith.md)
      - [OpenAI Agents SDK](agent-systems/orchestration/frameworks/openai-agents-sdk.md)
      - [OpenAI Agents API](agent-systems/orchestration/frameworks/openai-agents-api.md)
      - [Vercel AI SDK](agent-systems/orchestration/frameworks/vercel-ai-sdk.md)
      - [Claude Managed Agents](agent-systems/orchestration/frameworks/claude-managed-agents.md)
- **Knowledge**
  - [RAG](knowledge/rag.md)
  - [Graphs, GraphRAG, and Cognee](knowledge/graphs-and-cognee.md)
  - [Memory and indexing](knowledge/memory-and-indexing.md)
- **Interfaces**
  - [Chat rendering](interfaces/chat-rendering.md)
  - [Generative UI](interfaces/generative-ui.md)
  - [Realtime and voice](interfaces/realtime-and-voice.md)
- **Hosting**
  - [Providers and gateways](hosting/providers-and-gateways.md)
  - [Managed agents and sandboxes](hosting/managed-agents.md)
  - [Deployment](hosting/deployment.md)
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
