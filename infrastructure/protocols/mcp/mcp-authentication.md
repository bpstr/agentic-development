# MCP authentication and authorization

[Official authorization specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) · [OAuth protected resource metadata](https://www.rfc-editor.org/rfc/rfc9728)

Authentication establishes who is calling; authorization decides what that caller may do. MCP's HTTP authorization framework uses OAuth-based discovery and access tokens for protected servers. Local stdio integrations usually obtain credentials through their execution environment rather than the HTTP authorization flow.

## Discover the authorization service

A protected server can return this illustrative challenge:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource", scope="tasks:read"
```

The client retrieves protected resource metadata, discovers the appropriate authorization server, obtains a client identity through a supported registration mechanism, and completes the documented authorization flow. A successful flow gives the client a token for the protected resource.

The server must validate tokens for their intended audience and scopes. Forwarding an unrelated service's token without an appropriate exchange is not a substitute for MCP authorization.

## Scope is not object access

A `tasks:read` scope can permit task reads while application rules restrict the caller to one workspace. Resolve task identities inside that scope and enforce object-level checks on each request.

Keep tokens out of model context, tool descriptions, and shared logs. Discovery responses can describe required authentication without disclosing secrets.

Distinguish unauthenticated requests, insufficient scope, and inaccessible objects. Request only the access needed for the operation, and follow the protocol's step-up flow when additional access becomes necessary.

Approval of a particular action is another layer. Signing in or granting an OAuth scope does not imply consent to every consequential business operation that the account could perform.
