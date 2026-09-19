# Agent loops

[Handbook](../../../README.md) · [Chapter](../README.md)

An agent loop repeatedly asks a model for an answer or action, executes permitted actions, and supplies results back to the model. A workflow fixes more of the order in code; a graph makes steps and transitions explicit.

A bounded loop should load authorized state, enforce step/time/spend budgets, persist model responses and tool-call IDs, validate and authorize every action, execute with stable operation IDs, and persist terminal or suspended outcomes.

Do not treat every non-error model response as successful work. A run can succeed, fail, be cancelled, exhaust a budget, or suspend while waiting for approval or user input.

Run the [offline tool-loop example](../../../examples/tool-loop/README.md) to inspect validated calls, denied access, limits, and cancellation.
