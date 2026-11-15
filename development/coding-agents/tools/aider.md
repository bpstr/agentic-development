# Aider

[Official documentation](https://aider.chat/) · [Canonical repository](https://github.com/Aider-AI/aider) · [Apache-2.0 license](https://github.com/Aider-AI/aider/blob/main/LICENSE.txt)

Aider is a terminal-based AI pair-programming tool for changing an existing codebase or starting a project. It combines model-guided edits with Git integration and a repository map. It is useful when the developer wants a focused editing conversation while retaining an existing editor and normal source-control workflow.

Its documented capabilities include multi-file edits, linting and testing, hosted or local models, and automatic Git commits. These are coding-workflow facilities; Aider is not a desktop application for coordinating unrelated agent runtimes.

## Setup and editing lifecycle

The [official installation guide](https://aider.chat/docs/install.html) uses a dedicated installer:

```sh
python -m pip install aider-install
aider-install
```

Configure a supported model and its credentials using the provider instructions, then open Aider from the repository. The [usage documentation](https://aider.chat/docs/usage.html) explains file selection and the interactive editing workflow. Choose a currently supported model from those instructions rather than copying an old model identifier from an example.

Start by asking Aider to explain the relevant code. Add the files needed for the change, state the expected behavior, and request a small implementation. Inspect the diff, run the project checks, and use the Git history to inspect or undo changes. If automatic commits are enabled, an agent-created commit still needs review before publishing.

A useful request names a concrete result, such as preserving an API response while fixing one validation bug, and identifies the test that should demonstrate it. This reduces unrelated edits and gives both the developer and the tool an observable completion condition.

## Context and execution boundaries

The repository map helps discover relationships across the codebase; it does not mean every implementation detail fits into the model's context. Keep explicit context focused on the task and inspect omitted dependencies when a proposed change crosses module boundaries.

Configured linting and test commands execute development tooling. Apply the same [permission boundaries](../coding-agent-permissions.md) and environment separation as with other coding agents, especially around credentials and commands with external side effects.

The Apache-2.0 license covers Aider's source. Model inference is a separate dependency, including its cost and data-handling policy. Use [coding-agent verification](../coding-agent-verification.md) to distinguish a completed editing conversation from a validated change; clean syntax alone does not demonstrate preserved behavior.
