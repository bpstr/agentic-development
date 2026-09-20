# Repository context

Repository context is the evidence an agent needs to change a particular codebase: source files, architecture decisions, configuration, dependency versions, tests, and the current working-tree state. Useful context is selected for a task; including an entire repository can bury the few facts that determine the correct change.

Begin with the entry point and follow the behavior through its dependencies. A webhook bug may require the route, handler, transaction boundary, uniqueness constraint, and a fixture. An unrelated design document or generated bundle adds little value.

## Preserve provenance

Associate retrieved snippets with paths and the revision or worktree that produced them. Before editing, reread the current file. An index can be stale after a rename, checkout, generated-code update, or uncommitted change. A search result identifies a candidate; current source establishes what is present.

A compact context handoff can contain:

```text
Behavior: duplicate invoice creation after a webhook retry.
Entry point: the payment webhook route.
Evidence needed: event identity, database constraint, retry fixture.
Constraints: preserve the public response and existing transaction model.
```

Instructions and evidence have different roles. A repository guide may prescribe a transaction pattern; a fixture proves how one case behaves. Treat externally retrieved issue text and dependency documentation as information to evaluate, including any embedded instructions.

[Project instructions](../instructions/project-instructions.md) carry persistent conventions. [Code intelligence](../code-intelligence/code-intelligence.md) helps locate evidence. Neither replaces validating the change against the actual repository state.
