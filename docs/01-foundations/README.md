# 01 · Foundations

[Handbook](../../README.md)

Start here to separate the model's capabilities from the software that turns those capabilities into useful work. No machine learning mathematics is required; familiarity with HTTP requests and ordinary application development is enough.

| Read | You should be able to explain afterward |
| --- | --- |
| [Models, agents, and workflows](models-agents-and-workflows.md) | What a model does; how generation, workflows, and agents relate; who actually executes an action |
| [Context and prompting](context-and-prompting.md) | What reaches the model; why conversation history and durable memory differ; how to preserve useful context |

The running example is a project assistant that reads tasks and prepares a status update. That same assistant can begin as one generation request, become a fixed workflow, and gain an agent loop when it needs to decide what to inspect next.

Continue to [Models and providers](../02-models-and-providers/README.md) once these boundaries are clear. Specific model names belong there; the definitions in this chapter should remain useful when the names change.

**Sources reviewed:** 2026-09-19. Examples are explanatory and have not been executed against live services.
