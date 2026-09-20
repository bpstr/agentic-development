# Agent identity

Agent identity distinguishes the software workload, configured agent, individual run, and user whose authority an operation uses. These identifiers have different lifetimes: restarting a worker changes its instance, while the service identity and user's account can remain unchanged.

A useful audit record keeps those roles separate:

```json
{
  "subject_id": "user-8",
  "actor_id": "reporting-agent",
  "run_id": "run-42",
  "workspace_id": "workspace-alpha",
  "operation": "read_project"
}
```

This is an application record, not a token format. Populate trusted identity fields from authenticated execution context rather than model-generated arguments.

## Authenticate the workload

A service account or workload credential authenticates the executing software. [SPIFFE](https://spiffe.io/docs/latest/spiffe-about/overview/) defines identities and short-lived identity documents for workloads. OAuth token exchange can represent delegated authority with distinct subject and actor claims. [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693).

Authentication still does not decide whether that actor may read a particular project. Apply authorization using the subject, actor, tenant, and target resource as the service's policy requires.

A model name, persona, prompt, or self-reported MCP client name is not a security identity. Changing the model behind an agent need not create a new principal; changing its permissions or delegated role should remain visible in configuration and audit history.
