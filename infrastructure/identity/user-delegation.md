# User delegation

User delegation gives an agent bounded authority to act on a user's behalf. Identify the user, actor, allowed operations, resources, duration, and revocation behavior.

For example, “summarize comments in this project every weekday” can authorize recurring reads and report creation in that project. It does not inherently authorize deleting comments or posting reports to unrelated external recipients.

## Preserve the authority chain

OAuth token exchange distinguishes delegation from impersonation and defines an `act` claim for identifying the current actor. A token can therefore identify both the user represented by its subject and the service executing the request. [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693).

An application can also maintain a delegation record alongside ordinary service credentials. The resource server must enforce that record; writing a user ID into a tool request does not establish delegated authority.

When work is queued, retain the delegation identity and recheck its validity before consequential effects. Define what happens if the user leaves the workspace, loses access, or revokes the agent while a run is pending.

Delegating a task does not automatically permit further delegation to arbitrary agents. Any subagent should receive authority within the original boundary.

Keep durable audit records of the initiating user, acting service, effective grant, and operation outcome. A user's approval of one concrete action should not silently become a permanent delegation.
