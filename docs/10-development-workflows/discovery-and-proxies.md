# Discovery and proxies

[Handbook](../../README.md) · [Chapter](README.md)

**Source review: 2026-09-19. Evidence: source-reviewed; commands are illustrative and external utilities have not been runtime-tested.**

“Discover a tool” can describe several operations. Finding a project online, connecting to a server, loading its function definitions, and selecting the right function for a task happen at different layers. Keep them separate when debugging an agent that cannot reach a capability.

## Four discovery questions

| Question | Mechanism | Result |
| --- | --- | --- |
| Which server or package exists? | Registry or curated directory | Publisher, package, endpoint, configuration metadata |
| What does this connected server offer? | MCP capability discovery such as `tools/list` | Tool names and schemas |
| Which definitions should the model see now? | Host/provider tool search or deferred loading | A relevant subset of callable tools |
| Does this server actually behave correctly? | Protocol inspection and integration checks | Observed responses, errors, and compatibility |

The official [MCP Registry](https://modelcontextprotocol.io/registry/about) publishes server metadata and points to packages or remote endpoints; it does not itself host every server. The registry describes an ecosystem of downstream aggregators and marketplaces. Its listing is distinct from an authenticated connection to the listed service.

Once connected, MCP uses protocol methods to list available tools and call a selected tool. This protocol-level discovery is distinct from searching a public catalog. See the [MCP 2026-07-28 tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) and the handbook's [protocol chapter](../04-tools-and-protocols/README.md).

## Inspect before involving a model

The official MCP Inspector can inspect a local process or a remote server and provides interactive and CLI surfaces. For a server you have already built, a documented CLI pattern is:

```bash
npx @modelcontextprotocol/inspector --cli \
  node ./server/index.js --method tools/list
```

The current Inspector requires Node.js **22.19.0 or newer**. The command assumes the server and its dependencies are available; `npx` may download the Inspector. It starts the specified server process. Review the returned names and input schemas, then exercise a representative call, a validation failure, and an upstream failure. This separates a server problem from model selection or prompting. [MCP Inspector documentation](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector)

## Runtime tool search

Loading every schema can consume substantial context. Claude Code documents deferred MCP tool loading: names and server guidance can be available first, with definitions retrieved when needed. That is a host behavior layered over MCP. It does not remove the need for clear names, descriptions, authorization, or reliable server responses. [Claude Code tool search](https://code.claude.com/docs/en/mcp#scale-with-mcp-tool-search)

When a tool is missing, investigate discovery, connection state, authentication, policy, and deferred loading separately. A successful package install proves only that installation completed.

## What a proxy changes

A model proxy sits between a client and an upstream inference service. It may forward requests, translate an API format, or apply shared policy. A gateway commonly adds routing, access controls, usage accounting, and operational features. [LiteLLM's documentation](https://docs.litellm.ai/docs/) describes a self-hosted example of this category.

An MCP proxy has a different boundary: it mediates MCP connections or tool access. Neither category automatically hosts your application's agent loop. Deployment and ownership are covered in [hosting and delivery](../08-hosting-and-delivery/README.md).

For any compatibility bridge, verify streaming events, tool-call identifiers, structured output, error propagation, cancellation, and usage accounting. A request that produces text is insufficient evidence that a multi-step agent workflow preserves its behavior.

### Codex Proxy: a local compatibility gateway

**Codex Proxy** is the community project [`icebear0828/codex-proxy`](https://github.com/icebear0828/codex-proxy). Its [English README](https://github.com/icebear0828/codex-proxy/blob/dev/README_EN.md) describes a local gateway for connecting clients such as Cursor, Claude Code, Continue, and Pi to Codex-oriented Responses traffic.

| Client-facing format | Documented endpoint or bridge |
| --- | --- |
| OpenAI Chat Completions | `/v1/chat/completions` |
| Anthropic Messages | `/v1/messages` |
| Gemini | Generate-content and streaming routes |
| Codex Responses | `/v1/responses` passthrough |
| Ollama-compatible chat | Optional `/api/chat` bridge |

The endpoint format and the actual upstream model are separate choices. For example, a client can speak the Anthropic Messages format while the gateway translates its request for a Codex model. The gateway runs locally; inference can still run remotely. The client's tools and execution loop also remain separate from this translation layer. This is a source-reviewed community integration, with no OpenAI support or runtime compatibility implied by inclusion here.

Evaluate the exact release, upstream authentication contract, and API semantics before making such a bridge a dependency. Keep proxy credentials and upstream identity distinct. Compare against a direct supported integration using the same workload; an extra layer can change behavior and adds its own operational surface.

Related: [calling models](../03-calling-models/README.md), [skills and plugins](skills-and-plugins.md), [evaluation and operations](../09-evaluation-and-operations/README.md).
