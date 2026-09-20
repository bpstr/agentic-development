# MCP Registry

[Official registry documentation](https://modelcontextprotocol.io/registry/about) · [Canonical repository](https://github.com/modelcontextprotocol/registry)

The MCP Registry is a metadata directory for publicly available MCP server implementations. It points to packages or remote endpoints; it does not host all server code or execute tools for clients.

## What a record identifies

A server's metadata can describe its namespace, version, package or endpoint, and required configuration. For example, a record named `io.github.example/task-server` could point to a versioned package and document which environment variables it expects. This is an illustrative identity, not an installation recommendation.

Namespace verification helps establish control of a publisher identity. It does not establish that every tool is safe, that a package has been audited, or that a remote endpoint will remain available.

## Use discovery in an integration

A typical integration finds an implementation through a registry or downstream catalog, checks its canonical source, chooses a version, configures credentials separately, and then queries the actual server's capabilities. Registry search and runtime `server/discover` are different operations.

The official registry documentation describes downstream aggregators as the intended source for host-facing catalogs. Private organizations can maintain a compatible private catalog without publishing internal endpoints to a public directory.

Treat catalog entries as untrusted external data until validated. Do not execute a package solely because a model found its name. Resolve installation provenance, transport, configuration requirements, and the target host's compatibility first.

The official registry is documented as preview; its schema and service guarantees should be checked before building a dependency on publication or synchronization behavior.
