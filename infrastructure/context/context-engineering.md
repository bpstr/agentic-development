# Context engineering

Context engineering is the design of what information reaches a model at each inference step. It includes instructions, recent conversation, retrieved evidence, tool definitions, tool results, durable state, and dynamically selected resources.

The goal is not to maximize context size. It is to supply the smallest set of relevant, trustworthy information that lets the model complete the current step reliably.
