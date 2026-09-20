# Secrets in agent systems

Secrets include provider keys, OAuth tokens, database credentials, signing keys, and session material. Agent integrations often need them to execute tools, but the model usually needs only the resulting capability and authorized data.

Keep credentials in a secret store or controlled runtime configuration. Resolve them inside the tool executor rather than placing them in prompts, model-generated command strings, or returned tool output. [OWASP secrets management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) covers lifecycle, access, rotation, and auditability.

For example, a calendar tool can accept an event query while the service obtains the user's scoped token internally. Returning the token in an error message or trace negates that separation. Redact failures at the source and avoid logging entire request headers.

Prefer credentials scoped to the service, account, and operation needed. Separate development and production identities. Rotation should include caches, workers, and persisted sessions that may retain old credentials, not just the main application's environment.

A sandbox with a powerful credential can still perform authorized network operations using that credential. Restrict both code execution and the privileges of available secrets.

When investigating accidental exposure, revoke or rotate affected credentials and examine where they were copied: logs, traces, conversation storage, artifacts, and external integrations. Deleting one visible message does not establish that every retained copy disappeared.
