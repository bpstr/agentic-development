# Tool and topic index

[Handbook](../../README.md) · [Chapter](README.md)

Find a name here, then read its explanation in the relevant layer. Tools appear because they illustrate a category. This index does not rank them or imply independent production testing. For terminology, use the [glossary](glossary.md).

## Foundations and model choice

| Name or topic | Category | Handbook explanation |
| --- | --- | --- |
| Models; generative AI; agentic systems; workflows | Foundational concepts | [Models, agents, and workflows](../01-foundations/models-agents-and-workflows.md) |
| Prompts; context; tokens; compaction | Information supplied to inference | [Context and prompting](../01-foundations/context-and-prompting.md) |
| OpenAI; Astra / GPT-6 Astra; Sol / GPT-5.6 Sol | Model family and API choices | [OpenAI](../02-models-and-providers/openai.md) |
| Terra; Luna | Additional model comparison candidates | [OpenAI](../02-models-and-providers/openai.md) |
| Anthropic; Claude models and platform | Model provider | [Anthropic, Google, and xAI](../02-models-and-providers/anthropic-google-xai.md) |
| Google; Gemini | Model provider | [Anthropic, Google, and xAI](../02-models-and-providers/anthropic-google-xai.md) |
| xAI; Grok models | Model provider | [Anthropic, Google, and xAI](../02-models-and-providers/anthropic-google-xai.md) |
| Open source AI; open weights | Availability, licensing, and deployment distinctions | [Open weights](../02-models-and-providers/open-weights.md) |
| Kimi; Qwen; DeepSeek | Representative open-weight releases | [Open weights](../02-models-and-providers/open-weights.md) |
| Model benchmarks; SWE-bench; BFCL; pricing | Comparison methods and current source links | [Selection and benchmarks](../02-models-and-providers/selection-and-benchmarks.md) |

## Calls, tools, and protocols

| Name or topic | Category | Handbook explanation |
| --- | --- | --- |
| Model request and response | Provider inference contract | [Requests, responses, and structured output](../03-calling-models/request-response.md) |
| Agent protocol calls | Separate inference, managed execution, tool access, and agent communication | [Managed runtime calls](../03-calling-models/runtime-api.md) · [Protocol map](../04-tools-and-protocols/agent-communication.md) |
| Tool calls; function calling | Proposed operations and correlated results | [Tool calling](../03-calling-models/tool-calling.md) |
| Streaming; conversation state | Incremental output and continuity | [Streaming and state](../03-calling-models/streaming-and-state.md) |
| MCP | Tool/context protocol, with a versioned wire example | [MCP](../04-tools-and-protocols/mcp.md) · [Legacy initialization](../04-tools-and-protocols/mcp-legacy.md) |
| MCP discovery tools; MCP Registry; MCP Inspector | Server lookup, capability discovery, and inspection | [Discovery and authentication](../04-tools-and-protocols/discovery-and-authentication.md) |
| Tool search; deferred loading | Loading a relevant subset of capabilities | [Discovery and proxies](../10-development-workflows/discovery-and-proxies.md) |
| A2A | Agent service discovery and task exchange | [Agent communication](../04-tools-and-protocols/agent-communication.md) |
| AG-UI | Agent-to-interface events | [Agent communication](../04-tools-and-protocols/agent-communication.md) |

## Execution, knowledge, and operations

| Name or topic | Category | Handbook explanation |
| --- | --- | --- |
| LangChain | Integrations and agent abstractions | [Frameworks](../05-orchestration/frameworks.md) |
| LangGraph | Stateful orchestration | [Frameworks](../05-orchestration/frameworks.md) · [Execution and state](../05-orchestration/execution-and-state.md) |
| LangSmith | Tracing and evaluation within the broader ecosystem | [Frameworks](../05-orchestration/frameworks.md) · [Tracing](../09-evaluation-and-operations/tracing.md) |
| OpenAI Agents SDK | Application-owned agent execution | [Frameworks](../05-orchestration/frameworks.md) |
| Vercel AI SDK | Model access, tools, and application/UI integration | [Frameworks](../05-orchestration/frameworks.md) · [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md) |
| RAG | Retrieval and grounded generation | [RAG](../06-knowledge-and-memory/rag.md) |
| GraphRAG; graph-based retrieval | Entity relationships and collection-wide context | [Graphs and Cognee](../06-knowledge-and-memory/graphs-and-cognee.md) |
| Cognee | Knowledge and memory pipeline | [Graphs and Cognee](../06-knowledge-and-memory/graphs-and-cognee.md#cognees-role) |
| Embeddings; BM25; hybrid search; reranking; pgvector | Retrieval mechanisms and an example storage option | [RAG](../06-knowledge-and-memory/rag.md) |
| Conversation memory; incremental indexing; provenance | Persistence and information lifecycle | [Memory and indexing](../06-knowledge-and-memory/memory-and-indexing.md) |
| Tracing; OpenTelemetry; Langfuse | Observing execution across boundaries | [Tracing](../09-evaluation-and-operations/tracing.md) |
| Evals; reliability; cost; latency | Measuring useful outcomes | [Evaluations](../09-evaluation-and-operations/evaluations.md) · [Cost and latency](../09-evaluation-and-operations/cost-and-latency.md) |

## Interfaces and hosting

| Name or topic | Category | Handbook explanation |
| --- | --- | --- |
| assistant-ui; primitives; assistant-ui Elements | Chat components and runtime state | [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md) |
| Vercel AI Elements | Separate component collection associated with AI SDK | [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md) |
| Generative UI | Fixed components, declarative descriptions, or generated code | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) |
| OpenUI — Thesys | Component-catalog approach | [Generative UI](../07-interfaces-and-rendering/generative-ui.md#representative-approaches-and-protocol-boundaries) |
| OpenUI — Weights & Biases | Separate UI generation and preview project | [Generative UI](../07-interfaces-and-rendering/generative-ui.md#representative-approaches-and-protocol-boundaries) |
| A2UI | Declarative UI descriptions | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) |
| MCP Apps | Interactive tool-associated UI | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) |
| Realtime; GPT-Live; voice | Speech interaction and delegated execution | [Realtime and voice](../07-interfaces-and-rendering/realtime-and-voice.md) |
| OpenAI platform; Agents API | Managed execution and sandbox choices | [Managed agents](../08-hosting-and-delivery/managed-agents.md) · [Runtime calls](../03-calling-models/runtime-api.md) |
| Anthropic platform; Claude Managed Agents | Managed execution | [Managed agents](../08-hosting-and-delivery/managed-agents.md) |
| Hugging Face; Inference Providers; Endpoints; Spaces | Distinct serving and application-hosting offerings | [Providers and gateways](../08-hosting-and-delivery/providers-and-gateways.md) |
| OpenRouter | Inference routing and access | [Providers and gateways](../08-hosting-and-delivery/providers-and-gateways.md) |
| LiteLLM | Proxy/gateway category | [Providers and gateways](../08-hosting-and-delivery/providers-and-gateways.md) |
| Ollama; vLLM | Model serving | [Deployment choices](../08-hosting-and-delivery/deployment.md) |

## Development environments and extensions

| Name or topic | Category | Handbook explanation |
| --- | --- | --- |
| Codex | Coding-agent environment | [Coding agents](../10-development-workflows/coding-agents.md) |
| Claude Code | Coding-agent environment, distinct from the Claude model family | [Coding agents](../10-development-workflows/coding-agents.md) |
| Grok Build | Coding-agent environment | [Coding agents](../10-development-workflows/coding-agents.md) |
| Grok bots / Grok Bot | Persistent agent work environment | [Coding agents](../10-development-workflows/coding-agents.md) |
| Skills; Agent Skills; SKILL.md | Reusable instructions and supporting resources | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) |
| Plugins; hooks; project instructions | Different extension mechanisms | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) |
| Skills.sh; skills CLI | Skill discovery and distribution | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) |
| Plugin development; Agent Plugins | Packaging and host compatibility | [Plugin development](../10-development-workflows/plugin-development.md) |
| Proxies; MCP proxies | Forwarding, mediation, and compatibility boundaries | [Discovery and proxies](../10-development-workflows/discovery-and-proxies.md) |
| codex-proxy | Ambiguous name; the page identifies one reviewed community implementation | [codex-proxy identity](../10-development-workflows/discovery-and-proxies.md#the-name-codex-proxy) |
| Graphify | Project relationship retrieval; specific maintainer identified | [Code intelligence](../10-development-workflows/code-intelligence.md) |
| Codanna | Indexed symbol, semantic, and relationship retrieval | [Code intelligence](../10-development-workflows/code-intelligence.md) |
| ripgrep; Tree-sitter; language servers | Baseline search and program structure | [Code intelligence](../10-development-workflows/code-intelligence.md) |

For source links grouped by purpose, continue to [primary sources](sources.md). Coverage and evidence are recorded separately in the [coverage map](coverage.md).
