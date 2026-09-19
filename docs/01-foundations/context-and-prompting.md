# Context and prompting

[Handbook](../../README.md) · [Chapter](README.md)

**Sources reviewed:** 2026-09-19 · **Evidence:** official guidance; examples are illustrative, not live-tested.

## The input is more than the user's message

Prompt engineering shapes instructions and examples. **Context engineering** decides what information reaches the model at each step, including instructions, history, retrieved evidence, tools, and their results. Anthropic's [context engineering guide](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) explains why selecting relevant information matters even with large context windows.

| Context component | Example | Application responsibility |
| --- | --- | --- |
| Instructions | “Summarize blockers and cite task IDs” | Define the goal and output contract |
| Current input | “What changed since Monday?” | Resolve the relevant date and project |
| Recent history | User corrected the project selection | Preserve corrections and references |
| Retrieved evidence | Task records and dated comments | Enforce access and retain provenance |
| Tool definitions | Search tasks, read document | Expose clear schemas and limited scope |
| Tool results | Task status, version, and URL | Return useful data and explicit errors |
| Durable state | Approved plan and completed steps | Store separately and reload deliberately |

The model only benefits from information available in its effective context. A stored chat message, a file on disk, or an indexed document is not automatically visible to inference.

## Give the model a concrete contract

This is an illustrative instruction, separate from the changing task records:

```text
Goal: explain release blockers using the supplied project evidence.
For each blocker, identify the task, supporting record, and next action.
Use stable task IDs in references.
If evidence is missing or contradictory, say what needs checking.
Return a short overview followed by the blocker list.
```

Use examples when wording alone leaves ambiguity. Version the instructions with the tool schemas and evaluation cases so a behavior change can be investigated. Different model families can respond differently to the same prompt. OpenAI's [prompt engineering guide](https://developers.openai.com/api/docs/guides/prompt-engineering) covers instructions, message roles, examples, and evaluations.

Retrieved documents should be presented as evidence, with source boundaries. A document containing instructions does not itself acquire authority over the application. Authorization still belongs in application code.

## History, memory, and current truth

History records what happened in a conversation. Memory retains selected information for later use. Current truth lives in the underlying system: a task's status may have changed since yesterday's summary.

For continuity, keep a bounded recent window plus a compact record of decisions and unresolved work. Reload exact sources when precision matters. Compaction is lossy, so preserve stable references rather than relying on compressed prose alone. These are practical uses of the retrieval and compaction techniques in [Anthropic's guide](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

Illustrative application state, **not an API schema**:

```yaml
goal: Explain September release blockers
project_id: project_release
decisions:
  - Scope excludes optional analytics work
source_refs:
  - task: REL-42
    version: 7
next_step: Read the unresolved dependency of REL-42
```

Do not treat a remembered approval as a reusable permission token. Store authorization in a form the application can check against the specific action and current user.

Providers also offer conversation state APIs. OpenAI supports manually supplied history, conversation objects, and response chaining. These are continuity mechanisms; they do not make every past record relevant or remove context limits. See [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state).

## Budget for the complete interaction

Context includes more than the visible text bubble. Tool schemas and results consume input capacity; generated output can include tool arguments and reasoning-related usage. OpenAI distinguishes internal reasoning tokens from visible answers and documents how output limits apply in its [reasoning guide](https://developers.openai.com/api/docs/guides/reasoning).

Start with the current task, essential instructions, recent corrections, and a few relevant records. Retrieve more when needed. Measure missed references, unnecessary retrieval, and context loss after compaction. A larger window is useful capacity, not a substitute for deciding what the agent needs next.
