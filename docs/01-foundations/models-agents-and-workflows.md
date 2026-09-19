# Models, agents, and workflows

[Handbook](../../README.md) · [Chapter](README.md)

**Sources reviewed:** 2026-09-19 · **Evidence:** conceptual guidance and official documentation; no runtime testing.

## What is a model?

A machine learning model applies learned parameters to an input to produce an output. For a language model, training produces weights that encode patterns in language and other training material. Inference is running the trained model on new input. The model needs an architecture and software that executes it; a weights download alone is not a running service. See the [OSI component definitions](https://opensource.org/ai/open-source-ai-definition).

A generative language model can produce prose, code, structured data, or requests to use tools. Its prompt contains instructions and other available input. Text is represented using tokens, which can be words, pieces of words, or punctuation. Tokenization varies by model and language. An embedding model instead produces vectors useful for similarity search. [OpenAI's key concepts](https://developers.openai.com/api/docs/concepts) introduce these distinctions.

Training knowledge does not automatically include today's project state. A model needs supplied context or access to a retrieval tool to answer questions about private tasks and recent changes.

## Generative and agentic describe different things

**Generative** describes producing content. **Agentic** describes a system that can choose and carry out steps toward a goal. An agent usually uses a generative model; the two categories overlap.

| Pattern | Who chooses the steps? | Project assistant example |
| --- | --- | --- |
| Single generation | Application makes one request | Turn supplied task records into a summary |
| Fixed workflow | Application code controls the sequence | Load overdue tasks, summarize them, save a draft |
| Agent loop | Model selects next actions within application constraints | Investigate a delayed project, follow dependencies, inspect relevant documents, then explain the blockers |

This handbook uses **workflow** for predefined control flow and **agent** when the model decides which action to take next. Product documentation sometimes uses “agent” more broadly. Anthropic explains this architectural distinction in [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).

## What turns a model into an agent?

The surrounding **runtime**, also called a **harness**, supplies instructions, state, tools, execution, and stopping conditions. A framework can implement that runtime, but the framework is not the model.

Consider “Explain why the September release is delayed.”

1. The application authenticates the user and exposes tools for the accessible project.
2. The model requests the release's tasks.
3. The runtime validates the request, queries the project service, and returns records with IDs.
4. The model notices a blocked dependency and requests its details.
5. The runtime returns the dependency and its recent comments.
6. The model writes a supported explanation with references. The runtime stores the outcome and ends the run.

The model proposed calls; actual software performed them. A tool call is structured output requesting an operation, and a tool result is the operation's response. The application may execute the tool itself or delegate execution to a hosted service. [Function calling](https://developers.openai.com/api/docs/guides/function-calling) shows the request/result loop.

An answer saying “I updated the task” proves nothing about application state. The operation result and persisted record establish whether the update happened.

## Vocabulary that prevents confusion

| Term | Meaning in this handbook |
| --- | --- |
| Model call | One request for model inference; it may produce several output items |
| Tool call | A request to perform an operation; it is not necessarily an HTTP request |
| Turn | Work triggered by user input, potentially spanning several model and tool calls |
| Run | A tracked execution with a goal, limits, status, and result |
| Session | Continuity across turns, with identifiers and retained state |
| Agent definition | Configuration: model, instructions, allowed tools, and relevant policies |
| Agent instance | A running or resumable execution using that definition |

Prefer the simplest pattern that reliably completes the task. Adaptive investigation can justify an agent loop; predictable extraction often needs only a generation request and validation. Next: [Context and prompting](context-and-prompting.md).
