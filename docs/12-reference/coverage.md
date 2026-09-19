# Coverage of the requested topics

[Handbook](../../README.md) · [Chapter](README.md)

This map connects the original fragments to the handbook's responsibility-based structure. Coverage means a concise explanation, a representative example where useful, and primary documentation pointers. Several products appear in more than one chapter because model access, execution, hosting, and rendering are separate decisions.

Evidence labels:

- **SR — source-reviewed:** descriptions checked against primary documentation, specifications, papers, or maintainers' repositories for the **2026-09-19** edition.
- **I — illustrative:** original application designs, synthetic protocol exchanges, commands, or schemas that were not executed against the external integration.
- **LT — locally tested:** only an example with an actual execution record can carry this label. Consult [VERIFICATION.md](../../VERIFICATION.md) for commands, results, and limits.

## Concepts, models, and calls

| Requested subject | Explanation | Evidence and boundary |
| --- | --- | --- |
| Meta; a structure beyond backend/frontend | [System map](../00-orientation/system-map.md) · [Learning paths](../00-orientation/learning-paths.md) | Original information architecture; implementation locations remain visible. |
| Model definition | [Models, agents, and workflows](../01-foundations/models-agents-and-workflows.md) | SR; conceptual explanation. |
| Agentic versus generative; models versus agents | [Models, agents, and workflows](../01-foundations/models-agents-and-workflows.md) | SR + I; separates content generation from runtime action selection. |
| Model providers | [Models and providers](../02-models-and-providers/README.md) | SR; representative provider categories. |
| OpenAI; Astra; Sol; descriptions | [OpenAI](../02-models-and-providers/providers/openai.md) | SR + I; exact documented IDs and API distinctions. |
| Benchmarks and pricing links | [OpenAI](../02-models-and-providers/providers/openai.md) · [Selection and benchmarks](../02-models-and-providers/selection/model-selection.md) | SR; links and methodology, no original model ranking or benchmark run. |
| Anthropic | [Anthropic, Google, and xAI](../02-models-and-providers/providers/anthropic.md) | SR; models, platform, and coding product are distinguished. |
| Open source; Kimi | [Open weights](../02-models-and-providers/open-models/README.md) | SR + I; licensing and serving distinctions; no local inference test. |
| Agent protocol calls; example request and response | [Request/response](../03-calling-models/request-response.md) · [Managed runtime call](../03-calling-models/runtime-api.md) · [Protocol boundaries](../04-tools-and-protocols/agent-communication.md) | SR + I; separate provider inference, managed sessions, and inter-agent exchange. |
| Tool calls | [Tool calling](../03-calling-models/tool-calling.md) | SR + I; call/result correlation and executor responsibilities. |
| MCP: definition, example, official resources | [MCP](../04-tools-and-protocols/mcp.md) · [Legacy initialization](../04-tools-and-protocols/mcp-legacy.md) | SR + I; versioned exchanges, no client/server interoperability run. |

## Orchestration, knowledge, and interfaces

| Requested subject | Explanation | Evidence and boundary |
| --- | --- | --- |
| Tracing | [Tracing](../09-evaluation-and-operations/tracing.md) | SR + I; example durations are teaching data. |
| LangChain ecosystem | [Frameworks](../05-orchestration/frameworks/README.md) | SR; responsibility comparison. |
| LangSmith | [Frameworks](../05-orchestration/frameworks/README.md) · [Tracing](../09-evaluation-and-operations/tracing.md) | SR; observability and evaluation role, no hosted trace experiment. |
| LangGraph | [Frameworks](../05-orchestration/frameworks/README.md) · [Execution and state](../05-orchestration/execution/agent-loops.md) | SR + I; state, recovery, and control flow. |
| Vercel AI SDK | [Frameworks](../05-orchestration/frameworks/README.md) · [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md) | SR + I; server and UI responsibilities. |
| RAG | [RAG](../06-knowledge-and-memory/rag.md) | SR + I; pipeline, retrieval choices, citations, and evaluation. |
| GraphRAG | [Graphs and Cognee](../06-knowledge-and-memory/graphs-and-cognee.md) | SR + I; local/global retrieval and extracted relationship limits. |
| Cognee | [Graphs and Cognee](../06-knowledge-and-memory/graphs-and-cognee.md#cognees-role) | SR + I; documented API shape; no ingestion or retrieval execution. |
| Rendering | [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md) | SR + I; conversation parts and visible lifecycle. |
| assistant-ui; primitives; elements | [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md) | SR + I; assistant-ui Elements and Vercel AI Elements distinguished. |
| Generative UI; frameworks | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) | SR + I; tool-bound, declarative, and generated-code approaches. |
| OpenUI | [Generative UI](../07-interfaces-and-rendering/generative-ui.md#representative-approaches-and-protocol-boundaries) | SR; Thesys and Weights & Biases projects identified separately. |
| A2UI | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) | SR; version compatibility discussed; application JSON is not A2UI wire syntax. |

## Hosting and development tools

| Requested subject | Explanation | Evidence and boundary |
| --- | --- | --- |
| Agent hosting | [Hosting and delivery](../08-hosting-and-delivery/README.md) · [Deployment](../08-hosting-and-delivery/deployment.md) | SR + I; inference, loop, sandbox, and persistence locations. |
| OpenAI platform | [Managed agents](../08-hosting-and-delivery/managed-agents.md) · [Runtime calls](../03-calling-models/runtime-api.md) | SR + I; managed runtime and execution environment are distinguished. |
| Anthropic platform | [Managed agents](../08-hosting-and-delivery/managed-agents.md) | SR; managed agent documentation, no hosted deployment. |
| Hugging Face | [Providers and gateways](../08-hosting-and-delivery/providers-and-gateways.md) | SR; Inference Providers, Endpoints, and Spaces have separate roles. |
| OpenRouter | [Providers and gateways](../08-hosting-and-delivery/providers-and-gateways.md) | SR; model access/routing and runtime ownership distinguished. |
| Codex | [Coding agents](../10-development-workflows/coding-agents.md) | SR + I; documented local and non-interactive workflows. |
| Claude; Claude Code | [Coding agents](../10-development-workflows/coding-agents.md) · [Claude models](../02-models-and-providers/providers/anthropic.md) | SR; coding environment and model family distinguished. |
| Plugins | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) | SR + I; extension types and host compatibility. |
| Skills | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) | SR + I; format and instruction-loading role. |
| Proxies; Codex Proxy | [Discovery and proxies](../10-development-workflows/discovery-and-proxies.md) | SR + I; intended project matched to `icebear0828/codex-proxy`; endpoint translation explained, no gateway integration tested. |
| MCP discovery tools | [Discovery and authentication](../04-tools-and-protocols/discovery-and-authentication.md) · [Discovery and proxies](../10-development-workflows/discovery-and-proxies.md) | SR + I; registry, protocol discovery, Inspector, and deferred tools. |
| Skills.sh | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) | SR + I; discovery/distribution, no skill installation tested. |
| Plugin development | [Plugin development](../10-development-workflows/plugin-development.md) | SR + I; portable and host-specific manifests; no package installed. |
| Grok bots | [Coding agents](../10-development-workflows/coding-agents.md) | SR; supplied official Grok Bot announcement and documentation; distinct from Grok models and Grok Build. |
| Graphify; graphify.net | [Code intelligence](../10-development-workflows/code-intelligence.md) | SR + I; supplied website links to the canonical project; CLI and hosted setup paths distinguished; no indexing or performance run. |
| Codanna | [Code intelligence](../10-development-workflows/code-intelligence.md) | SR + I; capability overview; no indexing or performance run. |

## Example and expansion boundaries

| Executable example | Evidence | Tested boundary |
| --- | --- | --- |
| [Offline tool loop](../../examples/tool-loop/README.md) | **LT — offline**, with results in [VERIFICATION.md](../../VERIFICATION.md) | A scripted model and local runtime demonstrate tool validation, trusted identity, result correlation, budgets, cancellation, and error handling. |

The example's demo and behavior tests run without provider credentials or network calls. Its local test results do not establish hosted-model or framework compatibility.

The edition also adds context management, structured output, streaming, authorization, durable execution, evaluation, cancellation, voice, and code-retrieval baselines because they connect the requested topics into a working system.

Deeper provider-backed examples, reproducible retrieval experiments, and deployed service walkthroughs are expansion work described in [the plan](../../PLAN.md). Product inclusion alone does not establish reliability. Maintain the distinction between the documented capability, the illustrative design, and what an actual test demonstrated.
