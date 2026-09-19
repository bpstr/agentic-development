# Glossary

[Handbook](../../README.md) · [Chapter](README.md)

These definitions describe how the handbook uses each term. Follow the linked explanation for examples, tradeoffs, and primary sources. Product documentation sometimes uses broader meanings, particularly for “agent,” “memory,” and “platform.”

## A–C

| Term | Meaning | Read more |
| --- | --- | --- |
| A2A | A protocol for communication and task exchange between agent systems. | [Protocol boundaries](../04-tools-and-protocols/agent-communication.md) |
| A2UI | A declarative format describing interfaces that a client renders using its component catalog. | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) |
| Agent | A system in which a model chooses actions toward a goal within runtime constraints. | [Models, agents, and workflows](../01-foundations/models-agents-and-workflows.md) |
| Agentic | Describes action selection and execution toward a goal; it can use generative models. | [Generative and agentic](../01-foundations/models-agents-and-workflows.md#generative-and-agentic-describe-different-things) |
| Agent loop | Repeated model decisions, permitted tool execution, and feedback until a stopping condition. | [Execution and state](../05-orchestration/execution-and-state.md) |
| Agent runtime / harness | Software supplying the loop, state, tools, execution controls, and lifecycle around a model. | [What turns a model into an agent?](../01-foundations/models-agents-and-workflows.md#what-turns-a-model-into-an-agent) |
| AG-UI | An event protocol connecting agent execution to a user-facing application. | [Interface protocol boundaries](../07-interfaces-and-rendering/generative-ui.md#representative-approaches-and-protocol-boundaries) |
| Benchmark | A defined task set and measurement procedure; its results depend on the complete setup. | [Selection and benchmarks](../02-models-and-providers/selection-and-benchmarks.md) |
| Checkpoint | Saved execution state from which a workflow can resume. | [Execution and state](../05-orchestration/execution-and-state.md) |
| Chunk | A retrievable portion of a source document, ideally retaining meaningful structure and metadata. | [RAG pipeline](../06-knowledge-and-memory/rag.md#the-pipeline) |
| Compaction | Reducing context, often by summarizing older material; the result can lose information. | [Conversation memory](../06-knowledge-and-memory/memory-and-indexing.md#conversation-memory-needs-evidence) |
| Context engineering | Selecting and organizing the instructions, evidence, history, and tools provided at each model step. | [Context and prompting](../01-foundations/context-and-prompting.md) |
| Context window | The model's bounded capacity for the context of a request, measured in tokens. | [Context budget](../01-foundations/context-and-prompting.md#budget-for-the-complete-interaction) |
| Conversation state | Retained messages and related items used to continue an interaction. | [Streaming and state](../03-calling-models/streaming-and-state.md) |

## D–I

| Term | Meaning | Read more |
| --- | --- | --- |
| Dense embedding | A numerical vector used to compare content by learned similarity. | [Search terms](../06-knowledge-and-memory/rag.md#what-the-search-terms-mean) |
| Durable execution | Work whose recoverable state survives interruptions and process restarts. | [Execution and state](../05-orchestration/execution-and-state.md) |
| Evaluation / eval | A repeatable check of behavior against explicit criteria, including answers, actions, or recovery. | [Evaluations](../09-evaluation-and-operations/evaluations.md) |
| Gateway | An intermediary endpoint that can route model requests and apply shared access or operational policies. | [Providers and gateways](../08-hosting-and-delivery/providers-and-gateways.md) |
| Generative AI | Models and systems that produce content such as text, code, images, or structured output. | [Generative and agentic](../01-foundations/models-agents-and-workflows.md#generative-and-agentic-describe-different-things) |
| Generative UI | An interface whose components, layout, or code are influenced by model output. | [Generative UI](../07-interfaces-and-rendering/generative-ui.md) |
| Graph database | Storage and query software for entities and relationships; it is not itself a RAG pipeline. | [Graphs and Cognee](../06-knowledge-and-memory/graphs-and-cognee.md) |
| GraphRAG | Graph-assisted retrieval and generation; also the name of Microsoft's specific implementation. | [GraphRAG](../06-knowledge-and-memory/graphs-and-cognee.md#microsofts-graphrag) |
| Grounding | Connecting an answer's claims to relevant supporting evidence. | [Grounded answers](../06-knowledge-and-memory/rag.md) |
| Handoff | Transfer of responsibility for continuing work or an interaction to another agent. | [Delegation and handoffs](../05-orchestration/execution-and-state.md#delegation-and-handoffs) |
| Hybrid search | Retrieval combining different approaches, commonly keyword and vector search. | [Search terms](../06-knowledge-and-memory/rag.md#what-the-search-terms-mean) |
| Idempotency | Repeating the same identified operation without producing additional unintended effects. | [Recovery and side effects](../05-orchestration/execution-and-state.md#recovery-includes-side-effects) |
| Inference | Running a trained model on new input to obtain output. | [What is a model?](../01-foundations/models-agents-and-workflows.md#what-is-a-model) |

## M–Q

| Term | Meaning | Read more |
| --- | --- | --- |
| MCP | Model Context Protocol: a defined connection between applications and servers offering tools, resources, and prompts. | [MCP](../04-tools-and-protocols/mcp.md) |
| MCP discovery | Finding servers or their capabilities; catalog discovery and a connected server's tool listing are separate steps. | [Discovery and authentication](../04-tools-and-protocols/discovery-and-authentication.md) |
| Memory | Retained information for later use; specify whether this means history, working state, durable facts, or an index. | [Memory distinctions](../06-knowledge-and-memory/memory-and-indexing.md) |
| Model | Learned parameters and their computation that map input to output. | [What is a model?](../01-foundations/models-agents-and-workflows.md#what-is-a-model) |
| Model call | One inference request, potentially returning several output items rather than only text. | [Request and response](../03-calling-models/request-response.md) |
| Model card | Publisher documentation for a model's intended use, limitations, evaluation, and related artifact details. | [Open weights](../02-models-and-providers/open-weights.md) |
| Model provider | An organization or service supplying model access; distinguish the publisher from a serving intermediary. | [Models and providers](../02-models-and-providers/README.md) |
| Open source AI | A claim about a system's permissions and available components, beyond simply downloadable weights. | [Availability and licensing](../02-models-and-providers/open-weights.md#separate-availability-licensing-and-deployment) |
| Open weights | Trained parameters are available to obtain; other components and usage terms may remain restricted. | [Availability and licensing](../02-models-and-providers/open-weights.md#separate-availability-licensing-and-deployment) |
| Orchestration | Control of execution order, branching, state, delegation, and recovery across steps. | [Execution and state](../05-orchestration/execution-and-state.md) |
| Plugin | A host-specific extension package that may bundle instructions, tools, services, or interfaces. | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) |
| Prompt caching | Reuse of compatible prompt-prefix computation; it is distinct from returning a previously generated answer. | [Caching distinctions](../09-evaluation-and-operations/cost-and-latency.md#distinguish-two-kinds-of-caching) |
| Prompt injection | Untrusted content attempting to redirect a model or agent's behavior. | [Security and permissions](../09-evaluation-and-operations/security.md) |
| Provenance | The source identity, location, revision, and derivation behind a piece of information. | [Memory and indexing](../06-knowledge-and-memory/memory-and-indexing.md) |
| Proxy | Software forwarding or adapting requests between a client and upstream service. | [Discovery and proxies](../10-development-workflows/discovery-and-proxies.md) |
| Quantization | Reducing numerical precision in model representations to change memory and computation requirements. | [Local feasibility](../02-models-and-providers/open-weights.md#what-determines-local-feasibility) |

## R–W

| Term | Meaning | Read more |
| --- | --- | --- |
| RAG | Retrieval-augmented generation: supplying external evidence to help generate an answer. | [RAG](../06-knowledge-and-memory/rag.md) |
| Reranking | Reordering retrieved candidates using a further relevance-scoring step. | [Search terms](../06-knowledge-and-memory/rag.md#what-the-search-terms-mean) |
| Run | A tracked execution with a goal, limits, status, and outcome. | [Execution vocabulary](../01-foundations/models-agents-and-workflows.md#vocabulary-that-prevents-confusion) |
| Session | Continuity across interactions, associated with identifiers and retained state. | [Managed runtime identities](../03-calling-models/runtime-api.md#keep-the-boundaries-explicit) |
| Skill | Reusable instructions and supporting resources loaded by a compatible agent host for a task. | [Skills and plugins](../10-development-workflows/skills-and-plugins.md) |
| Span | One timed operation within a distributed trace, with attributes and relationships to other spans. | [Tracing](../09-evaluation-and-operations/tracing.md) |
| Streaming | Incremental delivery of output or lifecycle events before the complete result is available. | [Streaming and state](../03-calling-models/streaming-and-state.md) |
| Structured output | Model output constrained or validated against a machine-readable contract. | [Structured output](../03-calling-models/request-response.md#ask-for-a-machine-readable-answer) |
| Token | A model-specific unit of input or output representation, often a word fragment or punctuation. | [What is a model?](../01-foundations/models-agents-and-workflows.md#what-is-a-model) |
| Tool | A capability the surrounding system makes available through a defined invocation contract. | [Tool calling](../03-calling-models/tool-calling.md) |
| Tool call | Structured output requesting an operation; execution happens in a runtime or service. | [Tool calling](../03-calling-models/tool-calling.md) |
| Tool result | The correlated output or error from executing a requested tool operation. | [Tool calling](../03-calling-models/tool-calling.md) |
| Trace | A connected record of operations involved in an end-to-end request or unit of work. | [Tracing](../09-evaluation-and-operations/tracing.md) |
| Turn | Work triggered by user input, potentially spanning multiple model and tool calls. | [Execution vocabulary](../01-foundations/models-agents-and-workflows.md#vocabulary-that-prevents-confusion) |
| Workflow | Predefined control flow coordinating steps; individual steps may still use models. | [Models, agents, and workflows](../01-foundations/models-agents-and-workflows.md) |

For named frameworks and products, use the [tool and topic index](topic-index.md). Definitions and linked chapter evidence were assembled for the **2026-09-19** edition.
