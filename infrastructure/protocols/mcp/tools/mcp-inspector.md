# MCP Inspector

[Official Inspector documentation](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector) · [Canonical repository](https://github.com/modelcontextprotocol/inspector)

MCP Inspector is developer tooling for connecting to servers, inspecting protocol traffic, and exercising their features. Its browser, CLI, and terminal interfaces help separate server defects from problems in an agent host or model integration.

## Start an inspection

Using a Node.js version supported by the current package, launch the web interface:

```sh
npx @modelcontextprotocol/inspector
```

For a local server you already trust, list tools through the CLI:

```sh
npx @modelcontextprotocol/inspector --cli node path/to/server/index.js --method tools/list
```

Replace the example server path with the actual entry point. These commands install or launch software when run. Pin the package version in a reproducible development environment.

Configure the server's transport and required credentials in the appropriate local environment or connection settings. The web interface's session token protects local inspection access; avoid sharing its full URL.

## Inspect a complete behavior

Check capability discovery, tool listing, schema details, a valid invocation, invalid arguments, and an expected permission failure. For resources, inspect listing and reading; for prompts, inspect argument resolution.

Read actual result types and error bodies instead of treating an open connection as a successful integration. Test the protocol revision used by the target application, especially when bridging legacy and modern servers.

Inspector verifies a server interaction. It does not establish that a model will choose the correct tool, that production credentials have the same permissions, or that application-side business mutations are idempotent.
