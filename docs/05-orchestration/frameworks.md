# Frameworks and managed runtimes

[Handbook](../../README.md) · [Chapter](README.md)

Choose a framework by the responsibility it takes over. Provider adapters, agent loops, persistence, observability, and UI streaming are different layers. Similar product names often hide that distinction.

## The LangChain ecosystem

| Product | Main responsibility | Typical reason to use it |
| --- | --- | --- |
| **LangChain** | Model/tool integrations and higher-level agent abstractions | Build a conventional agent using existing integrations |
| **LangGraph** | Stateful orchestration, graph control flow, persistence, interruptions | Make branching and resumable execution explicit |
| **LangSmith** | Tracing, evaluation, prompt tooling, and deployment offerings | Inspect runs and compare changes across an application |

Current LangChain agents build on LangGraph. LangGraph can also be used without LangChain. LangSmith works across frameworks, so tracing an application with LangSmith does not imply that LangChain controls its execution. These products can be combined or adopted independently. [LangChain overview](https://docs.langchain.com/oss/python/langchain/overview) · [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview) · [LangSmith observability](https://docs.langchain.com/langsmith/observability).

For example, a document-review product might use LangChain model adapters, a LangGraph review-and-approval workflow, and LangSmith evaluations. An application with its own loop could use LangSmith alone. A slow request should be diagnosed through [timing spans](../09-evaluation-and-operations/tracing.md), rather than attributed to the entire ecosystem's name.

## OpenAI: model API, Agents SDK, Agents API

| Surface | Where loop ownership sits | Practical distinction |
| --- | --- | --- |
| **Responses API used directly** | Your application owns surrounding tool dispatch and continuation | Lower-level integration when you want explicit control |
| **Agents SDK** | SDK runtime in your application process | Agent loops, tools, handoffs, guardrails, sessions, and tracing |
| **Agents API** | OpenAI-managed harness | Managed sessions, orchestration, context compaction, and recovery |

The SDK's documented default for OpenAI models is the Responses API. Installing an SDK does not deploy your application. The separate Agents API exposes a managed Codex harness; an execution environment is optional when tools provide the required capabilities. Its current examples use the beta API surface. See the [SDK documentation](https://openai.github.io/openai-agents-python/), [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview), and [architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture).

Do not use “Agents API” as a generic synonym for any API used by an agent. Record the actual surface in architecture diagrams and measurements. Switching from an SDK to direct calls moves execution responsibilities into your code; it does not automatically remove provider inference time.

Anthropic also offers [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview), documented as beta, distinct from direct Messages API access. Compare managed execution, sandbox ownership, and retention in [hosting and delivery](../08-hosting-and-delivery/README.md).

## Vercel AI SDK

Vercel AI SDK is a TypeScript toolkit spanning provider access and application integration. Its core covers model calls, structured output, tools, and agent loops; its UI layer supports streamed application state. The official project supports direct provider packages as well as Vercel AI Gateway. The SDK and gateway are separate choices. [Official repository](https://github.com/vercel/ai) · [Documentation map](https://ai-sdk.dev/llms.txt).

For a React application, the SDK can connect server-side execution with a chat interface. UI hooks do not provide domain authorization, database transactions, or durable job recovery. See [interfaces and rendering](../07-interfaces-and-rendering/README.md) for the presentation layer.

## A small adoption checklist

Before committing to a framework, implement one representative read, one write, one denied action, one cancellation, and one interrupted run. Check the following:

- Can your team inspect requests, tool results, and state transitions?
- Which persistence and retry guarantees are supplied, and which remain yours?
- Can you enforce permissions before every side effect?
- Can you replace a model adapter without rewriting domain tools?
- Do the [evaluations](../09-evaluation-and-operations/evaluations.md) still pass after an upgrade?

**Source review:** 2026-09-19. This is a comparison of documented responsibilities. No comparative performance benchmark or vendor integration was run.
