# E2B

Official documentation: [Sandbox quickstart](https://docs.e2b.dev/quickstart). Sources: [E2B](https://github.com/e2b-dev/E2B), [Code Interpreter](https://github.com/e2b-dev/code-interpreter).

E2B provides remotely managed sandboxes and SDKs for executing code and working with files. It is useful when an agent needs a controlled compute environment for analysis, generated scripts, or artifacts while the application keeps orchestration elsewhere.

Install `e2b-code-interpreter` and set `E2B_API_KEY`. This Python script creates a sandbox, executes code, inspects logs, and cleans up the environment:

```python
from e2b_code_interpreter import Sandbox

sandbox = Sandbox.create()
try:
    execution = sandbox.run_code("print(sum([2, 4, 6]))")
    print(execution.logs)
    if execution.error:
        raise RuntimeError(str(execution.error))
finally:
    sandbox.kill()
```

A code execution result can include an error even when the SDK request itself succeeds. Check the execution outcome before reporting task completion. For file-producing work, use the file APIs to retrieve and persist deliverables before cleanup.

Configure the template, packages, network access, credentials, and lifetime for the workload. Reusable environments need deliberate tenant separation and cleanup of prior inputs. Store the sandbox ID with its application run so retries and cancellation target the correct environment.

The sandbox executes code; it does not choose the agent's tools, validate user permissions, or own business transactions. Keep sensitive side effects behind authorized application services and provide only the narrow credentials required for the sandbox task. Review current lifecycle and resource limits before relying on a long-lived session.
