# OAuth for agents

OAuth delegates access to a protected service through tokens instead of sharing a user's password. An agent application is an OAuth client; the API it calls is a resource server. OAuth authorizes access, while user authentication may involve a separate identity protocol.

## Choose the appropriate grant

For user delegation, a common flow sends the user to the authorization server, receives an authorization code, and exchanges it for an access token. Apply current security guidance, including PKCE and redirect validation. [OAuth security best current practice](https://www.rfc-editor.org/rfc/rfc9700).

For example, a user connects a project service and grants `tasks:read`. The agent backend stores the token securely and uses it to request tasks. The token stays outside model context.

Client credentials instead authorize a confidential client acting under its own or previously arranged authority. They do not implicitly represent a logged-in user. [OAuth grant definitions](https://www.rfc-editor.org/rfc/rfc6749).

The resource server validates the token and enforces scope plus object-level access. A `tasks:read` scope does not grant access to every tenant.

Refresh tokens and revocation require their own lifecycle. Expiring an access token does not necessarily end a grant that can mint another. Keep the OAuth grant, application delegation, and individual operation approval distinct; obtaining a token is not approval for every action it technically permits.
