# Agentic workflows

A workflow coordinates steps toward an outcome. In a fixed workflow, code largely determines the sequence. In an agentic workflow, a model selects some transitions or operations. Most useful applications combine these forms of control.

A document pipeline may always load a file, extract text, and validate a schema, then let an agent investigate missing references. A project assistant may use one deterministic read for “What is T-42's status?” and an adaptive tool loop for “Why is this release blocked?”

Choose control flow according to uncertainty:

- Use fixed steps when inputs and required operations are predictable.
- Use routing when distinct request types have known handlers.
- Use parallel work for independent operations with a clear merge rule.
- Use an adaptive loop when later actions depend on newly discovered evidence.
- Use a durable workflow when execution must survive process failure or long waits.

These patterns are discussed in [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents). Their names do not determine how much model inference is necessary.

For example, “Move T-42 to In Progress” may need entity resolution followed by one authorized mutation. It does not inherently need a planner, multiple specialist agents, and a final judge. Additional steps must improve an evaluated outcome enough to justify their latency and cost.

Define what happens at ambiguity, approval, timeout, retry, cancellation, and completion. A diagram of the happy path alone is not an execution contract. Preserve completed work across retries and make suspended state explicit so later input can resume the right operation.
