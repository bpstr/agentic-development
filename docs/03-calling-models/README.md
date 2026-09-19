# 03 · Calling models and agent runtimes

[Handbook](../../README.md) · [Chapter](README.md)

**Question:** What actually crosses the network when an application asks an AI system to do work?

Start by identifying which service you are calling. A request to generate a response, a request to continue a managed agent session, and a request to execute a business operation have different contracts. Putting all three behind a method named `askAgent()` can hide the most useful distinctions when debugging.

| Interface | What the caller submits | What comes back | Responsibility to locate |
| --- | --- | --- | --- |
| Model inference API | Context, model settings, optional tool definitions | Messages, structured output, tool requests, usage | Who executes requested tools and sends their results? |
| Managed agent runtime API | Agent configuration and task/session input | Session events, work items, outcomes, artifacts | Who owns orchestration, execution environments, recovery, and context? |
| Tool or application API | An operation and its arguments | Operation result or error | Who validates permissions and commits the change? |
| UI event interface | User input and application state | Text, progress, tool, and state events | Who reconstructs the visible conversation after reconnecting? |

For concrete examples, OpenAI exposes both [Responses and agent runtimes](https://developers.openai.com/api/docs/guides/agents), while Anthropic's [Messages API](https://platform.claude.com/docs/en/api/messages/create) generates messages from supplied context. [MCP](../04-tools-and-protocols/mcp.md) connects tools and context sources; [AG-UI](https://docs.ag-ui.com/introduction) addresses communication with an application interface. These interfaces can coexist in one product.

## Read this chapter

1. [Requests, responses, and structured output](request-response.md): inspect a model API exchange without SDK abstractions.
2. [Tool calling](tool-calling.md): follow a requested function through validation, execution, and continuation.
3. [Streaming and conversation state](streaming-and-state.md): distinguish partial output, durable history, and bounded model context.
4. [Calling a managed agent runtime](runtime-api.md): inspect the session and event contract above individual model calls.

The [offline tool-loop example](../../examples/tool-loop/) demonstrates application control flow with deterministic synthetic events. It is intentionally separate from these provider wire examples.

## Questions to answer before integrating

For each boundary, write down the request identifier, completion signal, timeout, retry owner, and place where the result is saved. These five details make a diagram operationally useful.

For example, “rename a document” can involve a browser message, a queued application run, a model response, a tool invocation, and one database write. Retrying the browser message should not accidentally repeat the write. A model response ID can correlate generation; a separate operation key should identify the business action across retries.

Choose an interface by the responsibility you want it to own. For a classifier, a single model call with a validated schema may be sufficient. For an agent that runs commands and resumes work, a managed session may save substantial runtime implementation. If the product already has a durable worker and strongly defined operations, an application-owned loop can fit naturally. These are design starting points to evaluate against actual workflows, not a ranking of frameworks.

## Scope and verification

The payloads in this chapter are synthetic teaching examples reviewed against official documentation on **2026-09-19**. No paid inference, hosted session, or provider integration was executed for these pages. Model access, SDK versions, beta headers, and current limits must be checked before adopting an example.
