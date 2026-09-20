# Tool authorization

Tool authorization decides whether the authenticated actor may perform a concrete operation on a resource. The model can propose an action, but cannot grant itself a user identity, tenant membership, or approval by including those claims in arguments.

Derive identity from the trusted request context. Validate input, resolve resources within authorized scope, and check the applicable permission immediately before execution. [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) recommends denying by default and checking access for each request.

An illustrative application sequence is:

```text
actor = authenticate(request)
scope = resolve_allowed_workspace(actor, request.workspace)
arguments = validate(tool_arguments)
task = lookup_task_within(scope, arguments.task_id)
authorize(actor, "task.update", task)
execute_validated_operation(task, arguments)
```

Keep authorization distinct from consent. An actor may have permission to publish while application policy still requires approval of the specific text and destination. Bind approval to the actor, operation, payload revision, target, and expiration appropriate to the workflow.

Re-check permissions after a suspended run resumes. A previously valid resource may have moved or access may have been revoked. Avoid leaking existence through error messages for inaccessible objects.

Use the same business authorization service for forms, agents, APIs, and background jobs. Duplicating weaker checks in a tool adapter creates a path around the application's ordinary rules. Tests should deliberately inject forbidden model arguments and verify that no unauthorized effect occurs.
