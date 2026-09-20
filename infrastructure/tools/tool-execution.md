# Tool execution

Tool execution turns a proposed operation into an actual result. A dependable executor validates the request, resolves trusted identity, checks authorization, applies operational limits, calls an allowlisted handler, and records the outcome.

This complete local Python example demonstrates dispatch and object-level access for a read operation:

```python
TASKS = {"TASK-42": {"title": "Repair login", "workspace": "alpha"}}

def execute(name, arguments, *, allowed_workspace):
    if name != "get_task":
        raise ValueError("Unknown tool")
    if (
        not isinstance(arguments, dict)
        or set(arguments) != {"key"}
        or not isinstance(arguments["key"], str)
    ):
        raise ValueError("Expected one string argument: key")
    task = TASKS.get(arguments["key"])
    if task is None or task["workspace"] != allowed_workspace:
        raise LookupError("Task unavailable")
    return {"key": arguments["key"], "title": task["title"]}

print(execute("get_task", {"key": "TASK-42"}, allowed_workspace="alpha"))
```

The caller supplies `allowed_workspace` from trusted application state. A production implementation should obtain that scope from authenticated identity and current access rules, rather than accepting an arbitrary client-provided value.

## Writes need durable evidence

For mutations, persist a business operation key and receipt. If a worker crashes after a write commits but before returning the result, recovery should find the receipt rather than perform the same write again. Provider call IDs correlate exchanges but may change across retries.

Bound duration, concurrency, output size, and dependency access. Distinguish a rejected operation, a known execution failure, and an uncertain timeout. Retrying all three identically can duplicate effects or hide permission errors.

Tool results are data for later reasoning. Keep untrusted retrieved content separate from privileged instructions and redact credentials from results and logs. [MCP tool security considerations](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#security-considerations).
