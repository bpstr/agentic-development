# Tool permissions

Tool permissions determine which operations a principal may perform, on which resources, under which conditions. The relevant principal may be a user, service account, or delegated agent identity. A model-generated argument is not a trustworthy source of that identity.

Permission checks commonly have several layers:

- The runtime enables a tool family.
- A token allows a service or scope.
- The application allows the requested action.
- Object-level rules allow access to the particular task or document.

Passing the first layer does not imply passing the others.

## Example: update a task

A request to change `TASK-42` to `done` should resolve the task within the caller's authorized workspace and check the caller's update capability. If the task belongs elsewhere, deny it even when the token has a general `tasks:write` scope.

Treat permission filtering in the tool catalog as a usability improvement. Repeat the effective checks at execution time because permissions can change between listing and invocation.

For remote HTTP MCP, the [authorization specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) defines how clients obtain and present scoped access tokens. The protected application still owns object-level decisions.

## Separate availability and approval

A disabled tool is unavailable. An unauthorized action is forbidden. An action awaiting user approval may be permitted only after a concrete decision. These are different states with different recovery paths.

Bind background work to an explicit execution identity. Decide whether revocation stops already queued work and check access again when sensitive effects are about to occur. Do not rely on an earlier successful read as enduring authority for a later write.

Descriptions such as “read-only” and protocol annotations can help planning, but the actual handler and access checks must enforce the promised behavior.
