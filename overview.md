# Agentic development at a glance

An **agent** uses a model to choose steps toward a goal; application code supplies tools, state, permissions, and limits. A **workflow** fixes more steps in advance. This map explains the repository's capability families; the [index](README.md#contents) links deeper articles.

**The whole system:** understand the request → assemble context → infer → authorize and execute tools → record outcomes → continue, ask, or stop → evaluate.

## Foundations

[Generative AI](foundations/generative-ai.md) produces content; [models](foundations/models-vs-agents.md) supply learned capabilities; [agentic systems](foundations/agentic-systems.md) combine them with actions. [Prompts and instructions](foundations/prompts-and-instructions.md) express intent, while [workflows](foundations/agentic-workflows.md) define how work proceeds. Use model judgment where ambiguity warrants it, not where a direct operation suffices.

## Infrastructure: models, context, and execution

| Concept | What it is about |
| --- | --- |
| [Models and selection](infrastructure/models/model-selection.md) | Compare capabilities, reasoning, multimodality, benchmarks, cost, and task performance. Open weights raise separate licensing and hardware questions. |
| [Voice](infrastructure/models/voice/voice-models.md) and [media models](infrastructure/models/media/media-models.md) | Transcribe, synthesize speech, converse speech-to-speech, or generate/edit images and video. Generating media differs from understanding sources. |
| [Model adaptation](infrastructure/model-adaptation/model-adaptation.md) | Fine-tuning changes weights; distillation transfers behavior; quantization reduces precision and resource requirements. |
| [Prompt optimization](infrastructure/optimization/prompt-optimization.md) | Evaluate instructions and demonstrations before reusing them. This is not automatically model training. |
| [Inference](infrastructure/inference/inference-definition.md) | Requests, responses, structured output, streaming, reasoning controls, caching, batches, and conversation state. A response does not prove completion. |
| [Context](infrastructure/context/context-engineering.md) | Select instructions, evidence, tool descriptions, and history within a finite window. Compaction and working memory preserve what decisions need. |
| [Tools](infrastructure/tools/tool-definition.md) | Operations connect decisions to reads and effects. Discovery, calling, execution, permissions, approvals, and hosted tools are distinct responsibilities. |
| [Protocols](infrastructure/protocols/protocols.md) | MCP exposes tools/resources; A2A supports agent exchanges; AG-UI carries interaction events; WebMCP exposes browser tools. Binary transport does not supply reasoning. |
| [Orchestration](infrastructure/orchestration/orchestration-definition.md) and [MAS](infrastructure/orchestration/multi-agent-systems.md) | Loops, graphs, delegation, and evolving inquiries organize work. Logical agents differ from model replicas and concurrent requests. |
| [State](infrastructure/orchestration/state-management.md), [durability](infrastructure/orchestration/durable-execution.md), and [harnesses](infrastructure/orchestration/agent-harness.md) | Separate private context, shared evidence, and authoritative execution. Checkpoints, leases, receipts, and handovers support recovery across failures and sessions. |

## Infrastructure: knowledge and evidence

| Concept | What it is about |
| --- | --- |
| [Retrieval](infrastructure/knowledge/retrieval/retrieval-definition.md) | Find evidence through keyword, semantic, hybrid, or multimodal search. Embeddings, rerankers, and vector databases serve different stages. |
| [RAG](infrastructure/knowledge/rag/rag-definition.md) | Supply retrieved evidence to generation. Chunking, citations, grounding, and query strategy connect indexing to answers. |
| [Knowledge graphs](infrastructure/knowledge/knowledge-graphs/knowledge-graph-definition.md) and [GraphRAG](infrastructure/knowledge/graphrag/graphrag-definition.md) | [Ontologies](infrastructure/knowledge/knowledge-graphs/ontology-design.md) define entities and relationships. Domain, inquiry, evidence, and communication edges mean different things; graph storage alone is not GraphRAG or verification. |
| [Memory](infrastructure/knowledge/memory/memory-definition.md) | Retain information with correction, expiry, and deletion. [Temporal graphs](infrastructure/knowledge/knowledge-graphs/temporal-knowledge-graphs.md) separate fact validity from recording time. |
| [Indexing](infrastructure/knowledge/indexing/indexing.md) | Build searchable representations. Incremental updates, freshness, and deletion align derived data with originals. |
| [Multimodal understanding](infrastructure/knowledge/multimodal/multimodal-source-understanding.md) | Interpret media while preserving coordinates, timestamps, speakers, and source evidence. File acceptance is not understanding. |
| [Document intelligence](infrastructure/knowledge/document-intelligence/document-understanding.md) | Extract text, layout, and tables; OCR reads text from images. Extraction differs from generated interpretation. |
| [Web research](infrastructure/knowledge/web-research/web-research.md) | Discover, inspect, and compare sources. Provenance and source quality constrain responsible synthesis. |

## Infrastructure: application boundaries

| Concept | What it is about |
| --- | --- |
| [Hosting](infrastructure/hosting/agent-hosting.md) | Deploy applications and dependencies. Inference services, gateways, local runtimes, and execution sandboxes have different responsibilities. |
| [Computer use](infrastructure/computer-use/computer-use-definition.md) | Act through browser structures or visual interfaces when APIs are unsuitable. Verify outcomes, not just visible success messages. |
| [Identity](infrastructure/identity/agent-identity.md) | Establish who acts for whom. OAuth, delegation, and scoped credentials bound authority independently of prompts. |
| [Events](infrastructure/events/event-driven-agents.md) and [schedules](infrastructure/events/scheduled-agents.md) | Make work eligible. Define timing, overlap, recovery, authority, and completion; a successful trigger does not prove delivery. |
| [Files and artifacts](infrastructure/files/agent-files.md) | Manage storage, revisions, access, and lifecycle of source documents and generated outputs. |
| [Commerce](infrastructure/commerce/agentic-commerce.md) and [economics](infrastructure/economics/agent-payments.md) | Separate discovery and purchase intent from checkout, payment, and spending authority. Protocols address different transaction boundaries. |
| [Synthetic data](infrastructure/synthetic-data/synthetic-data-definition.md) and [simulation](infrastructure/simulation/agent-simulation.md) | Create examples or controlled environments for development and evaluation; neither automatically represents real workloads. |
| [Architecture](infrastructure/architecture/agent-native-applications.md) | Build agent-facing applications with deterministic boundaries around identity, validation, and consequential effects. |

## Agentic web and communication

The [agentic web](agentic-web/agentic-web-definition.md) treats agents as first-class clients. Discovery and machine-readable representations expose resources; APIs and agent protocols expose interaction surfaces. Identity, access policy, rate limits, and delegated authority constrain actions. Discoverability never grants access.

[Human collaboration](communication/human-agent-collaboration/human-in-the-loop.md) includes approvals, escalation, intervention, and supervision. [Messaging](communication/messaging/agent-messaging.md) exchanges information; [notifications](communication/notifications/agent-notifications.md) surface relevant changes without an open conversation.

## Interfaces

[Chat](interfaces/chat/chat-interfaces.md) presents messages, tool activity, and approvals. Desktop [interfaces](interfaces/agent-interfaces.md) connect local applications through permissions; the client need not host inference. [Generative UI](interfaces/generative-ui/generative-ui-definition.md) selects components. [Realtime](interfaces/realtime/realtime-agents.md) and [voice](interfaces/voice/voice-agents.md) add sessions, turn-taking, interruption, and delegation. The [implementation manual](interfaces/implementation-manual.md) and [testing guide](interfaces/testing-guide.md) connect these to lifecycle and failure handling.

## Operations

[Observability](operations/observability/agent-observability.md) explains runs through traces, spans, tool timing, and token usage. [Evaluation](operations/evaluation/agent-evaluation.md) measures answers, actions, and recovery; [retrieval evaluation](operations/evaluation/retrieval-evaluation.md) isolates evidence quality, while [graph evaluation](operations/evaluation/graphrag-evaluation.md) checks supported paths and incremental value.

[Performance](operations/performance/latency.md) balances latency, useful output, overhead, caching, and cost. [Reliability](operations/reliability/agent-reliability.md) defines retries, idempotency, cancellation, and recovery. [Security](operations/security/agent-security.md) constrains injection, exposure, tools, secrets, execution, and information flow. [Governance](operations/governance/agent-governance.md) supplies policies, auditability, and retention.

## Development and patterns

[Coding agents](development/coding-agents/coding-agent-definition.md) change software using context and verification. [Cloud coding](development/coding-agents/cloud-coding-agents.md) moves tools off the workstation; managed services and self-hosted workers differ in responsibility. [Specification-driven development](development/coding-agents/spec-driven-development.md) connects intent to acceptance evidence. [Scheduled development](development/coding-agents/scheduled-development.md) dispatches bounded approved work with checkpoints and review gates. [Instructions](development/instructions/agent-instructions.md) establish conventions; [skills](development/skills/skill-definition.md) package procedures; [plugins](development/plugins/plugin-definition.md) bundle extensions. [Proxies](development/proxies/proxy-definition.md) mediate protocols or context; [code intelligence](development/code-intelligence/code-intelligence.md) supplies symbols, semantic search, and code graphs.

[Patterns](patterns/incremental-build.md) combine tool loops, grounded answers, background work, agents-as-tools, handoffs, planners, routers, and supervisors. [Scheduled summaries](patterns/scheduled-summaries.md) connect source coverage to persisted artifacts and verified delivery. [Evaluator–optimizer loops](patterns/evaluator-optimizer-pattern.md) revise artifacts; [periodic supervision](patterns/periodic-loop-supervision.md) corrects cross-session strategy without changing requirements. Watchdogs handle hung processes. Add coordination only when its benefits justify the cost and failure modes.
