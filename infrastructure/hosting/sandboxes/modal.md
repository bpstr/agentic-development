# Modal Sandboxes

Official documentation: [Sandboxes](https://modal.com/docs/guide/sandboxes), [Modal setup](https://modal.com/docs/guide). Source: [modal-labs/modal-client](https://github.com/modal-labs/modal-client).

Modal Sandboxes run commands and code in isolated cloud environments with programmable images and resource configuration. They fit generated-code execution, repository checks, and applications that need a temporary runtime with selected dependencies.

Install `modal` and configure credentials using the documented setup. This Python script creates an application-associated sandbox, runs a bounded command, and cleans up:

```python
import modal

app = modal.App.lookup("agent-examples", create_if_missing=True)
sandbox = modal.Sandbox.create(app=app)
try:
    process = sandbox.exec("python", "-c", "print(sum([2, 4, 6]))", timeout=10)
    print(process.stdout.read())
    process.wait()
    if process.returncode != 0:
        raise RuntimeError("Sandbox command failed")
finally:
    sandbox.terminate()
    sandbox.detach()
```

Run the saved script with Python; this direct sandbox API does not require a deployed function entry point. The sandbox and command have separate lifecycles. Detaching the client handle is not the same operation as terminating the sandbox.

Build images with the required packages and pin external image versions. Add volumes or copy artifacts out when results must survive environment termination. Readiness probes help when a tool needs a running server rather than a completed command.

Constrain time, resources, network access, and available credentials. Store environment IDs for cancellation and cleanup, and inspect process outcomes separately from generated output. Modal supplies compute isolation and lifecycle APIs; business authorization, agent orchestration, and durable product state remain separate application responsibilities.
