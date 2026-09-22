# Agentic development at a glance

An **agent** uses a model to choose steps toward a goal; application code supplies tools, state, permissions, and limits. A **workflow** fixes more of those steps in advance. Neither is just a chatbot. This map explains the repository's capability families; the [complete index](README.md#contents) lists every implementation and deeper article.

**The whole system:** understand the request → assemble context → infer → authorize and execute tools → record outcomes → continue, ask, or stop → evaluate the result.

## Foundations

[Generative AI](foundations/generative-ai.md) produces new content; [models](foundations/models-vs-agents.md) supply learned capabilities; [agentic systems](foundations/agentic-systems.md) combine them with actions. [Prompts and instructions](foundations/prompts-and-instructions.md) express intent, while [workflows](foundations/agentic-workflows.md) define how work proceeds. Use model judgment where ambiguity warrants it, not where a direct operation already suffices.

## Infrastructure: models, context, and execution

| Concept | What it is about |
| --- | --- |
| [Models and selection](infrastructure/models/model-selection.md) | Compare capabilities, reasoning, multimodality, benchmarks, cost, and actual task performance. Providers expose models; open weights raise separate licensing and local-hardware questions. |
| [Voice](infrastructure/models/voice/voice-models.md) and [media models](infrastructure/models/media/media-models.md) | Transcribe speech, synthesize speech, converse speech-to-speech, or generate/edit images and video. Generating media differs from understanding a source. |
| [Model adaptation](infrastructure/model-adaptation/model-adaptation.md) | Fine-tuning changes behavior through weights; distillation transfers behavior; quantization reduces numeric precision and resource requirements. |
| [Prompt optimization](infrastructure/optimization/prompt-optimization.md) | Compare instructions and demonstrations against explicit metrics before reusing them. DSPy supplies one implementation; this is not automatically model training. |
| [Inference](infrastructure/inference/inference-definition.md) | Send model requests and interpret responses, structured output, streaming, reasoning controls, caching, batches, and conversation state. An API response is not proof of task completion. |
| [Context](infrastructure/context/context-engineering.md) | Select instructions, evidence, tool descriptions, and history within a finite window. Budgeting, compaction, and working memory preserve what the next decision needs. |
| [Tools](infrastructure/tools/tool-definition.md) | Defined operations connect decisions to reads and effects. Discovery, calling, execution, permissions, approvals, and hosted tools are distinct responsibilities. |
| [Protocols](infrastructure/protocols/protocols.md) | MCP exposes tools, resources, and prompts; A2A supports agent communication; AG-UI carries interaction events; WebMCP exposes browser-side tools. Transport and authentication still matter. |
| [Orchestration](infrastructure/orchestration/orchestration-definition.md) | Loops, graphs, state, delegation, handoffs, and multi-agent coordination organize work. Frameworks help construct it; managed runtimes operate parts of it. |
| [Durability](infrastructure/orchestration/durable-execution.md) and [harnesses](infrastructure/orchestration/agent-harness.md) | Recover execution after failure and preserve meaningful progress across sessions. Checkpoints, receipts, and handovers serve different purposes. |

## Infrastructure: knowledge and evidence

| Concept | What it is about |
| --- | --- |
| [Retrieval](infrastructure/knowledge/retrieval/retrieval-definition.md) | Find relevant evidence through keyword, semantic, hybrid, or multimodal search. Embeddings represent similarity; reranking reorders candidates; vector databases store searchable vectors. |
| [RAG](infrastructure/knowledge/rag/rag-definition.md) | Supply retrieved evidence to generation. Chunking, source citations, grounding, and query strategy connect the indexing and answering pipelines. |
| [Knowledge graphs](infrastructure/knowledge/knowledge-graphs/knowledge-graph-definition.md) and [GraphRAG](infrastructure/knowledge/graphrag/graphrag-definition.md) | [Ontologies](infrastructure/knowledge/knowledge-graphs/ontology-design.md) define identities and relationships; GraphRAG retrieves supported paths or summaries. Domain graphs differ from execution graphs, and graph storage alone is not GraphRAG. |
| [Memory](infrastructure/knowledge/memory/memory-definition.md) | Retain selected information with correction, expiry, and deletion. [Temporal graphs](infrastructure/knowledge/knowledge-graphs/temporal-knowledge-graphs.md) distinguish when facts apply from when they were recorded. |
| [Indexing](infrastructure/knowledge/indexing/indexing.md) | Turn sources into searchable representations; incremental updates, freshness, and deletion keep derived data aligned with originals. |
| [Multimodal understanding](infrastructure/knowledge/multimodal/multimodal-source-understanding.md) | Interpret images, audio, and video while preserving coordinates, timestamps, speakers, and source evidence. Preprocessing and file acceptance are not understanding. |
| [Document intelligence](infrastructure/knowledge/document-intelligence/document-understanding.md) | Extract text, layout, and tables; OCR reads text from images. Structured extraction differs from a generated description of a document. |
| [Web research](infrastructure/knowledge/web-research/web-research.md) | Discover, inspect, and compare sources; source selection and provenance determine what a synthesis can responsibly claim. |

## Infrastructure: application boundaries

| Concept | What it is about |
| --- | --- |
| [Hosting](infrastructure/hosting/agent-hosting.md) | Deploy the application and its dependencies. Inference services run models; gateways route requests; local runtimes self-host inference; sandboxes isolate generated execution. |
| [Computer use](infrastructure/computer-use/computer-use-definition.md) | Act through browser structure or visual interfaces when a suitable API is absent. A visible success message still needs outcome verification. |
| [Identity](infrastructure/identity/agent-identity.md) | Establish who acts for whom. OAuth, delegated access, and scoped credentials bound authority independently of model instructions. |
| [Events](infrastructure/events/event-driven-agents.md) | Webhooks, schedules, and other signals initiate work. Delivery can repeat, so triggers need deduplication and recoverable execution. |
| [Files and artifacts](infrastructure/files/agent-files.md) | Manage source documents and generated outputs, including storage, revisions, access, and artifact lifecycle. |
| [Commerce](infrastructure/commerce/agentic-commerce.md) and [economics](infrastructure/economics/agent-payments.md) | Separate discovery and purchase intent from checkout, payment, and spending authority. ACP and UCP describe commerce interactions; AP2 and x402 address payment-related boundaries. |
| [Synthetic data](infrastructure/synthetic-data/synthetic-data-definition.md) and [simulation](infrastructure/simulation/agent-simulation.md) | Generate examples or controlled environments for development and evaluation; neither automatically represents real workloads. |
| [Architecture](infrastructure/architecture/agent-native-applications.md) | Build agent-facing APIs and applications with deterministic boundaries around identity, validation, and consequential effects. |

## Agentic web and communication

The [agentic web](agentic-web/agentic-web-definition.md) treats software agents as first-class web clients. Discovery and machine-readable representations help them find and understand resources; APIs, MCP, A2A, and WebMCP expose different interaction surfaces; identity, access policy, rate limits, and delegated authority constrain what they may do. Discoverability never grants access.

[Human collaboration](communication/human-agent-collaboration/human-in-the-loop.md) includes approvals, escalation, and active intervention; human-on-the-loop supervision watches ongoing work. [Messaging](communication/messaging/agent-messaging.md) exchanges information, while [notifications](communication/notifications/agent-notifications.md) surface relevant changes without requiring an open conversation.

## Interfaces

[Chat](interfaces/chat/chat-interfaces.md) presents messages, streamed parts, tool activity, and approvals. [Generative UI](interfaces/generative-ui/generative-ui-definition.md) selects or describes interactive components. [Realtime](interfaces/realtime/realtime-agents.md) and [voice](interfaces/voice/voice-agents.md) add session state, turn-taking, interruption, and delegation. The [implementation manual](interfaces/implementation-manual.md) and [testing guide](interfaces/testing-guide.md) connect these elements to lifecycle and failure handling.

## Operations

[Observability](operations/observability/agent-observability.md) explains a run through traces, spans, tool timing, and token usage. [Evaluation](operations/evaluation/agent-evaluation.md) measures answers, actions, and recovery with datasets, graders, and regression tests; [retrieval evaluation](operations/evaluation/retrieval-evaluation.md) isolates evidence quality, while [graph evaluation](operations/evaluation/graphrag-evaluation.md) checks supported paths and incremental retrieval value.

[Performance](operations/performance/latency.md) balances latency, first useful output, tool overhead, caching, and cost. [Reliability](operations/reliability/agent-reliability.md) defines retries, idempotency, cancellation, and recovery. [Security](operations/security/agent-security.md) constrains injection, data exposure, tools, secrets, and execution. [Governance](operations/governance/agent-governance.md) supplies policies, auditability, and retention.

## Development and patterns

[Coding agents](development/coding-agents/coding-agent-definition.md) change software using repository context and verification. [Cloud coding](development/coding-agents/cloud-coding-agents.md) moves repository tools off the workstation; product tasks, managed APIs, and self-hosted workers differ in responsibility. [Specification-driven development](development/coding-agents/spec-driven-development.md) connects intent to acceptance evidence. [Instructions](development/instructions/agent-instructions.md) set project conventions; [skills](development/skills/skill-definition.md) package procedures; [plugins](development/plugins/plugin-definition.md) bundle extensions. [Proxies](development/proxies/proxy-definition.md) mediate protocols or context; [code intelligence](development/code-intelligence/code-intelligence.md) supplies symbols, semantic search, and code graphs.

[Patterns](patterns/incremental-build.md) compose these capabilities: bounded tool loops, grounded answers, background work, agents-as-tools, handoffs, planners, routers, and supervisors. An [evaluator–optimizer loop](patterns/evaluator-optimizer-pattern.md) revises one artifact against a fixed rubric. Add coordination only when it improves the outcome enough to justify its cost and failure modes.
