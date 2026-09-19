# Primary sources

[Handbook](../../README.md) · [Chapter](README.md)

This is a curated set of deeper starting points drawn from the chapter sources reviewed on **2026-09-19**. Individual pages link closer to specific claims and examples. Consult the exact model, package, host, and protocol version you intend to use; a documentation link is not a record of an executed integration.

## Concepts, models, and APIs

| What to understand | Primary material | Handbook guide |
| --- | --- | --- |
| Models versus agent systems | [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | [Foundations](../01-foundations/README.md) |
| OpenAI model capabilities and cost | [Model catalog](https://developers.openai.com/api/docs/models) · [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) · [Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) · [Pricing](https://developers.openai.com/api/docs/pricing) | [OpenAI](../02-models-and-providers/openai.md) |
| Other provider catalogs | [Claude models](https://platform.claude.com/docs/en/models/overview) · [Gemini models](https://ai.google.dev/gemini-api/docs/models) · [Grok models](https://docs.x.ai/developers/models) | [Anthropic, Google, and xAI](../02-models-and-providers/anthropic-google-xai.md) |
| Open artifacts and evaluation | [Kimi K2.5 publisher card](https://huggingface.co/moonshotai/Kimi-K2.5) · [Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition) · [SWE-bench](https://www.swebench.com/) · [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) | [Open weights](../02-models-and-providers/open-weights.md) · [Benchmarks](../02-models-and-providers/selection-and-benchmarks.md) |
| Request contracts and tool results | [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling) · [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) · [Claude Messages reference](https://platform.claude.com/docs/en/api/messages/create) | [Calling models](../03-calling-models/README.md) |

## Protocols, execution, and knowledge

| What to understand | Primary material | Handbook guide |
| --- | --- | --- |
| MCP protocol and discovery | [Versioned MCP architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture) · [Tool contract](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) · [Registry](https://modelcontextprotocol.io/registry/about) · [Inspector](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector) | [MCP](../04-tools-and-protocols/mcp.md) · [Discovery](../04-tools-and-protocols/discovery-and-authentication.md) |
| Agent and application events | [A2A specification](https://a2a-protocol.org/latest/specification/) · [AG-UI introduction](https://docs.ag-ui.com/introduction) | [Protocol boundaries](../04-tools-and-protocols/agent-communication.md) |
| Framework responsibilities | [LangChain](https://docs.langchain.com/oss/python/langchain/overview) · [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) · [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) · [Vercel AI SDK](https://github.com/vercel/ai) | [Frameworks](../05-orchestration/frameworks.md) |
| Retrieval and evidence | [Original RAG paper](https://arxiv.org/abs/2005.11401) · [LlamaIndex ingestion](https://developers.llamaindex.ai/python/framework/module_guides/loading/ingestion_pipeline/) · [Elastic hybrid search](https://www.elastic.co/docs/solutions/search/hybrid-search) | [RAG](../06-knowledge-and-memory/rag.md) |
| Graph retrieval and memory | [Microsoft GraphRAG](https://microsoft.github.io/graphrag/) · [Cognee architecture](https://docs.cognee.ai/core-concepts/architecture) · [Cognee permissions](https://docs.cognee.ai/setup-configuration/permissions) · [LangGraph memory](https://docs.langchain.com/oss/python/langgraph/add-memory) | [Graphs and Cognee](../06-knowledge-and-memory/graphs-and-cognee.md) · [Memory](../06-knowledge-and-memory/memory-and-indexing.md) |

## Interfaces and deployment

| What to understand | Primary material | Handbook guide |
| --- | --- | --- |
| Chat components and state | [assistant-ui primitives and Elements](https://www.assistant-ui.com/docs/primitives) · [assistant-ui architecture](https://www.assistant-ui.com/docs/architecture) · [Vercel AI Elements](https://elements.ai-sdk.dev/) | [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md) |
| Declarative and generated UI | [Thesys OpenUI](https://github.com/thesysdev/openui) · [Weights & Biases OpenUI](https://github.com/wandb/openui) · [A2UI](https://a2ui.org/) · [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) |
| Voice sessions and delegated work | [OpenAI voice agents](https://developers.openai.com/api/docs/guides/voice-agents) · [GPT-Live](https://developers.openai.com/api/docs/guides/live) | [Realtime and voice](../07-interfaces-and-rendering/realtime-and-voice.md) |
| Managed execution | [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) · [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) | [Managed agents](../08-hosting-and-delivery/managed-agents.md) |
| Inference access and serving | [OpenRouter](https://openrouter.ai/docs/quickstart) · [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index) · [Inference Endpoints](https://huggingface.co/docs/inference-endpoints/index) · [Spaces](https://huggingface.co/docs/hub/spaces-overview) | [Providers and gateways](../08-hosting-and-delivery/providers-and-gateways.md) |
| Running an inference service | [Ollama API](https://docs.ollama.com/api/introduction) · [vLLM serving](https://docs.vllm.ai/en/latest/serving/online_serving/) · [LiteLLM](https://docs.litellm.ai/docs/) | [Deployment](../08-hosting-and-delivery/deployment.md) · [Gateways](../08-hosting-and-delivery/providers-and-gateways.md) |

## Development and operations

| What to understand | Primary material | Handbook guide |
| --- | --- | --- |
| Coding-agent environments | [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) · [Claude Code](https://code.claude.com/docs/en/overview) · [Grok Bot](https://docs.x.ai/grok-bot/overview) | [Coding agents](../10-development-workflows/coding-agents.md) |
| Skills and plugin contracts | [Agent Skills specification](https://agentskills.io/specification) · [Agent Plugins specification](https://agent-plugins.org/specification) · [OpenAI packaging](https://developers.openai.com/plugins/build/plugins) · [Claude plugin reference](https://code.claude.com/docs/en/plugins-reference) | [Skills](../10-development-workflows/skills-and-plugins.md) · [Plugin development](../10-development-workflows/plugin-development.md) |
| Discovery and code retrieval | [Skills.sh documentation](https://www.skills.sh/docs) · [Codanna documentation](https://docs.codanna.sh/) · [Graphify repository](https://github.com/Graphify-Labs/graphify) | [Skills](../10-development-workflows/skills-and-plugins.md) · [Code intelligence](../10-development-workflows/code-intelligence.md) |
| Tracing and evaluation | [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/) · [LangSmith observability](https://docs.langchain.com/langsmith/observability) · [LangSmith evaluation](https://docs.langchain.com/langsmith/evaluation) | [Tracing](../09-evaluation-and-operations/tracing.md) · [Evaluations](../09-evaluation-and-operations/evaluations.md) |
| Tool permissions and content trust | [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) · [Prompt injection guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | [Security](../09-evaluation-and-operations/security.md) |

For a specific example's status, consult its page and the repository's [verification record](../../VERIFICATION.md). The [coverage map](coverage.md) connects these categories to the original requested subjects.
