# Daytona

Official documentation: [Sandboxes](https://www.daytona.io/docs/en/sandboxes/), [Python SDK](https://www.daytona.io/docs/en/python-sdk/). Source: [daytonaio/daytona](https://github.com/daytonaio/daytona).

Daytona provides programmable execution environments for agent workloads. Its APIs manage sandbox creation, code and process execution, filesystem access, and lifecycle operations. It is useful for tasks that need an isolated workspace with dependencies or a running application.

Install `daytona` and set `DAYTONA_API_KEY` for the configured service. This Python example explicitly selects a Python runtime and destroys the sandbox after use:

```python
from daytona import Daytona, CreateSandboxFromSnapshotParams

client = Daytona()
sandbox = client.create(CreateSandboxFromSnapshotParams(language="python"))
try:
    response = sandbox.process.code_run("print(sum([2, 4, 6]))")
    print(response.result)
finally:
    sandbox.delete()
```

For real work, inspect the documented execution result and exit/error status before treating output text as success. Preserve needed artifacts through the filesystem APIs before deletion.

Choose the relevant sandbox type, image or snapshot, resources, network rules, and stop policy. Lifecycle behavior differs between stopping, deleting, snapshotting, and forking; do not assume all environment types implement each operation identically. The current documentation explicitly distinguishes container and VM capabilities.

Track the sandbox identity with the application run and clean up abandoned work. Avoid sharing mutable environments across unrelated users. A sandbox limits execution access but cannot decide whether a user's requested business action is authorized. Supply narrow credentials and keep application-level approvals and durable operation receipts outside the generated code's control.
