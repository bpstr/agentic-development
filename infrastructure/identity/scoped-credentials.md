# Scoped credentials

Scoped credentials restrict the authority available to an agent's executor. Relevant boundaries include operation, resource, tenant, environment, audience, and lifetime. A credential may encode some restrictions while a resource server or credential broker enforces the others.

For example, a release-summary worker needs permission to read one repository. Its credential should not also permit production deployments or writes to unrelated repositories. A short expiration limits exposure, but does not compensate for an excessive permission set.

## Bind access to its destination

OAuth resource indicators let a client identify the resource for which it requests a token, enabling audience restriction. A token for a document service should not automatically be accepted by a payment service. [RFC 8707](https://www.rfc-editor.org/rfc/rfc8707).

Issue credentials through trusted backend code, inject them only into the process that needs them, and return result data to the model without the credential. Record a credential identifier for diagnosis rather than logging its secret value.

Check restrictions at execution time. A descriptive label such as “project-alpha-only” has no effect unless the issuer or consuming service enforces it.

Plan expiration, renewal, and revocation together. Long-running jobs may need refreshed credentials; refresh must preserve the original restrictions and respect revoked delegation. Application budgets usually require a separate ledger because ordinary API scopes do not enforce spending totals.
