# Cursor Agent

Official documentation: [Cursor Agent overview](https://cursor.com/docs/agent/overview).

Cursor Agent integrates model-driven coding work with an editor and development tools. Its agent combines instructions, a selected model, and tools for searching code, editing files, and executing terminal commands. Editor context can make a focused change easier to inspect and review.

## Work from a concrete repository task

Install Cursor through the official product distribution, open the repository, and configure the account and model supported by the installation. Give the agent an observable behavior to change:

```text
In the invoice list, preserve the selected filters when opening an item
and returning. Locate the existing navigation state and verify the flow.
```

Point to the relevant files or UI context when known. Review the agent's proposed scope, inspect the resulting diff, and run the checks that establish the behavior. For interface work, that includes exercising the actual interaction rather than relying only on TypeScript compilation.

## Editor assistance and execution

The editor supplies useful context and review surfaces, but a visible file is only part of the application. Follow dependencies and state transitions as needed. Codebase search can locate candidates without proving that a particular branch executes.

Rules, tools, and model selection are independent configuration choices. A stronger model does not resolve a missing local service, and permission to run a shell command does not imply authority to change a production account.

Compare Cursor with terminal agents using the same task, repository state, and acceptance criteria. Evaluate correctness and review effort alongside completion time.
