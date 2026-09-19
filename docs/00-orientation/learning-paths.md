# Learning paths

[Handbook](../../README.md) · [Orientation](README.md)

Choose the question you have now. Read the linked pages in order, then use the chapter indexes for details. The paths are editorial suggestions, not prerequisites enforced by a particular framework.

## I am a web developer entering the field

1. [Models, agents, and workflows](../01-foundations/models-agents-and-workflows.md): establish the vocabulary.
2. [Request and response](../03-calling-models/request-response.md): see what crosses the network.
3. [Tool calling](../03-calling-models/tool-calling.md): understand how software performs the action.
4. [The offline tool loop](../../examples/tool-loop/README.md): run the mechanism without an API account.
5. [Deployment responsibilities](../08-hosting-and-delivery/deployment.md): map the pieces to an ordinary application.

By the end, explain what your application owns, what the provider owns, and what happens if a tool fails.

## I am building an assistant into a product

1. [Context and prompting](../01-foundations/context-and-prompting.md).
2. [Execution and state](../05-orchestration/execution-and-state.md).
3. [Chat rendering](../07-interfaces-and-rendering/chat-rendering.md).
4. [Security](../09-evaluation-and-operations/security.md).
5. [Evaluations](../09-evaluation-and-operations/evaluations.md).
6. [Background work recipe](../11-recipes/background-work.md).

Design one useful action with observable results before expanding tool count or adding multiple agents.

## My assistant needs private knowledge

1. [RAG](../06-knowledge-and-memory/rag.md).
2. [Memory and indexing](../06-knowledge-and-memory/memory-and-indexing.md).
3. [Graphs and Cognee](../06-knowledge-and-memory/graphs-and-cognee.md).
4. [Grounded answers recipe](../11-recipes/grounded-answers.md).

Finish with a retrieval evaluation containing answerable questions, missing answers, outdated sources, and documents the user cannot access.

## My agent is slow, expensive, or unreliable

1. [Tracing](../09-evaluation-and-operations/tracing.md).
2. [Cost and latency](../09-evaluation-and-operations/cost-and-latency.md).
3. [Selection and benchmarks](../02-models-and-providers/selection-and-benchmarks.md).
4. [Framework choices](../05-orchestration/frameworks.md).

Measure the complete successful task. Faster token generation may not fix queueing, tool latency, or repeated model turns.

## I use coding agents and want better extensions

1. [Coding agents](../10-development-workflows/coding-agents.md).
2. [Skills and plugins](../10-development-workflows/skills-and-plugins.md).
3. [MCP](../04-tools-and-protocols/mcp.md).
4. [Discovery and proxies](../10-development-workflows/discovery-and-proxies.md).
5. [Code intelligence](../10-development-workflows/code-intelligence.md).

Be able to distinguish written instructions from executable tools, the discovery catalog from authorization, and a code index from the actual repository state.
