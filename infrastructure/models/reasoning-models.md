# Reasoning models

A **reasoning model** is trained or configured to allocate computation to intermediate problem solving before producing an answer or action. This can help with planning, coding, mathematical work, and resolving ambiguous evidence. Reasoning is a behavior and resource allocation strategy, not proof that the output is correct.

Some providers expose an effort level or thinking budget. These controls are model-specific: the same word, such as `high`, need not mean the same token budget or latency across models. The [OpenAI reasoning guide](https://developers.openai.com/api/docs/guides/reasoning) explains its reasoning-token mechanism and integration requirements.

Distinguish three observable artifacts:

- The final answer presented to the user.
- A provider-supported reasoning summary, when available.
- Tool calls and results, which are external actions and evidence.

A reasoning summary is not an execution log. An explanation that a database was checked must be supported by a successful tool result if the task required that check.

For example, compare a migration-planning task at two effort settings using the same schema and failure cases. Measure whether the larger budget detects more incompatible changes and how much total response time it adds. Routine routing may benefit little from additional reasoning, while difficult dependency analysis may benefit substantially.

Give the model clear objectives, evidence, constraints, and output requirements. Reserve enough output budget for the requested answer, and preserve provider-required continuation state across tool turns. Increasing effort cannot supply missing facts, grant tool permissions, or repair an invalid tool implementation.
