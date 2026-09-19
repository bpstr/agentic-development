# Editorial and evidence policy

[Handbook](../../README.md) · [Orientation](README.md)

This repository is a curated explanation of agentic development. Its purpose is to make unfamiliar mechanisms understandable and direct readers toward deeper primary resources.

## Organize by durable questions

A model provider belongs under model selection. Its managed execution service also belongs under hosting. Its SDK belongs under calling or orchestration. Its coding client belongs under development workflows. Crosslink those roles instead of writing one enormous vendor chapter.

Separate a specification from implementations, a model from the service that runs it, a tool description from execution, and a user interface from the agent's state. Those distinctions remain useful when product names change.

## Select representative implementations

Prefer tools with a clear role, maintained primary documentation, inspectable interfaces, and a reproducible way to evaluate them. Established adoption can justify explaining a tool, but it does not prove suitability for every deployment. A smaller community utility can earn a short profile when it illustrates a different mechanism; explain its scope and evidence limits.

Avoid adding products solely because they are new, have many stars, or advertise broad autonomy. For an unfamiliar implementation, establish its exact identity and actual documented behavior first. Describe competing approaches only where they help the reader make a decision.

## State what has been checked

| Evidence | Meaning | Does not establish |
| --- | --- | --- |
| Source-reviewed | Primary material was read on the stated date | Production reliability, correctness of marketing benchmarks, or account availability |
| Locally tested | The documented command ran against the stated example and environment | Compatibility with every provider or performance in production |
| Illustrative | An original teaching example or unexecuted integration sketch | A working drop-in implementation |

The first edition uses these labels to avoid turning an aggregation effort into an implied certification program. Protocol and provider snippets are source-reviewed and illustrative unless their page explicitly records an executed integration.

## Handle changing facts

Use a versioned specification when the wire format matters. Link official model descriptions, model cards, pricing, release notes, and benchmark methods. For a comparison, record the model ID, harness, tools, dataset, date, sampling settings, and cost boundary. Keep a vendor's claims attributed to that vendor.

The last source-review date describes when information was checked; it is not a guarantee that a linked page has remained unchanged. Periodic link checks can find a missing page, while human review must catch an API meaning that changed behind a working URL.

## Keep examples useful

Start with small, original examples that isolate one mechanism. Name synthetic data and placeholders. Teach failure paths alongside success: invalid arguments, denied access, empty retrieval, duplicate actions, cancellation, and exhausted budgets. Avoid hiding the essential loop behind an unexplained helper.

The [contribution guide](../../CONTRIBUTING.md) defines the practical checks. The [verification record](../../VERIFICATION.md) describes the actual initial validation.
