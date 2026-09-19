# 05 · Orchestration and execution

[Handbook](../../README.md)

Orchestration is the code or managed runtime that decides what runs next, preserves progress, and handles interruptions. A model can propose a tool call; the surrounding system decides whether it is allowed, executes it, and delivers the result back.

Keep three questions separate: **who chooses the next step, where execution happens, and what survives a crash?** A graph answers a control-flow question. A worker answers an execution question. A checkpoint answers a persistence question. One product may provide all three, but the responsibilities still exist.

| Read | What you will understand |
| --- | --- |
| [Execution and state](execution-and-state.md) | Direct loops, workflows, graphs, durable workers, delegation, and recovery |
| [Frameworks and managed runtimes](frameworks.md) | How LangChain, LangGraph, LangSmith, OpenAI Agents SDK/API, and Vercel AI SDK fit |

Start with one bounded loop and real application tools. Add explicit workflow stages when the task requires them; add delegation when independent work or distinct tool permissions justify it. Compare designs using [evaluations](../09-evaluation-and-operations/evaluations.md) and [traces](../09-evaluation-and-operations/tracing.md), including failure cases. [Hosting and delivery](../08-hosting-and-delivery/README.md) explains where those components run.

**Source review:** 2026-09-19. The linked pages distinguish documented capabilities from the handbook's implementation advice. No vendor integration was executed for this chapter.
