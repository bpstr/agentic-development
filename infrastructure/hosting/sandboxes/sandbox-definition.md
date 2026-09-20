# Execution sandboxes

A sandbox is an isolated environment for running code, commands, or applications with constrained access to resources. In an agent system it separates generated or otherwise untrusted execution from the application service and its credentials.

The boundary includes filesystem mounts, network destinations, identity, process privileges, CPU, memory, time, and output size. Containers, virtual machines, and language runtimes offer different isolation properties. Calling an environment a sandbox does not establish which protections it enforces.

A typical lifecycle creates an environment from a controlled image, supplies selected inputs, executes work, captures logs and artifacts, and destroys or suspends the environment. Persist user deliverables outside transient storage before cleanup. Reusing an environment across users can leak files, caches, or processes.

A sandbox is not an authorization decision. Code that receives a powerful credential can use it within permitted network access. Supply narrow credentials and keep sensitive business actions behind validated tools when possible.

Plan for timeouts and abandoned sessions. Record an environment ID with its run, propagate cancellation, and perform cleanup even when execution fails. [E2B](https://docs.e2b.dev/quickstart), [Daytona](https://www.daytona.io/docs/en/sandboxes/), and [Modal Sandboxes](https://modal.com/docs/guide/sandboxes) provide concrete lifecycle APIs; compare their documented isolation and persistence behavior before adopting one.
