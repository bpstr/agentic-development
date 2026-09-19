# Delegation and handoffs

[Handbook](../../../README.md) · [Chapter](../README.md)

**Delegation** gives another agent a bounded subtask and returns its result to the coordinator. A **handoff** transfers responsibility for continuing the interaction.

Pass a concrete objective, necessary context, tool permissions, budget, and expected result. Bound delegation depth. Parallelize independent reads; coordinate writes to shared resources.

More agents add calls, context transfer, and coordination work. Require measured benefit rather than assuming a multi-agent design is more capable.

OpenAI's SDK documents both agents-as-tools and handoffs in its [SDK documentation](https://openai.github.io/openai-agents-python/handoffs/).
