# MCP resources

[Official resources specification](https://modelcontextprotocol.io/specification/2026-07-28/server/resources) · [Change subscriptions](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/subscriptions)

MCP resources expose contextual data identified by URIs. Examples include a document, database schema, or project configuration. Resources are application-driven: the host decides whether to offer a picker, attach relevant data automatically, or otherwise make it available as context.

Clients use `resources/list` to enumerate resources and `resources/read` to retrieve one. Resource templates describe parameterized URIs separately. An illustrative read:

```json
{
  "jsonrpc": "2.0",
  "id": "read-1",
  "method": "resources/read",
  "params": {
    "uri": "task://TASK-42",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": "read-1",
  "result": {
    "resultType": "complete",
    "contents": [
      {
        "uri": "task://TASK-42",
        "mimeType": "text/plain",
        "text": "Repair login. Current status: in progress."
      }
    ]
  }
}
```

This is synthetic resource content, not a fetched task.

## Identity and access

A URI identifies the resource; it does not grant permission or require that the client fetch it through ordinary HTTP. Custom schemes can represent application entities whose contents are served through MCP.

Use MIME types to describe returned content and bound large reads. For evolving documents, preserve version or freshness information in the application representation so the host can distinguish an old excerpt from current state. Resource listing and reads remain subject to request authorization.

Resources provide data; tools perform operations. A task may reasonably have both a readable resource representation and tools for controlled mutations.

## Resource-change notifications

A server can support change notifications without delivering resource contents in each event. In revision 2026-07-28, use the [subscription exchange](mcp-transport.md#change-notification-subscriptions) and check which requested URIs the server acknowledges. `notifications/resources/updated` identifies a changed URI; `notifications/resources/list_changed` instead invalidates the resource catalog.

An application should mark the corresponding cached representation stale, re-read or re-list with current authorization, then decide whether the refreshed material belongs in the next model context. Coalesce repeated invalidations and retain application-level revisions when ordering matters. A notification does not rewrite context already supplied to a model. After a disconnect, reconcile state instead of assuming every intervening update was delivered.

## Proposed Events extension

[SEP-3415](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3415) proposes `io.modelcontextprotocol/events` for upstream business events such as an email arriving or an incident opening. **As of October 8, 2026, it is an open, unmerged draft, not a released core capability; an official SDK reference implementation is still outstanding.** The [inspected proposal](https://github.com/pja-ant/modelcontextprotocol/blob/6859def4ba24ab41678d0e6799fe3f4c84228f9a/seps/0000-events-extension.md) targets protocol revision 2026-07-28 and later. Its method names and semantics can still change.

The draft extends discovery beyond resource URIs: `events/list` advertises event names, an `inputSchema` for subscription arguments, a `payloadSchema` for event data, and supported delivery modes. Proposed delivery operations are:

| Draft operation | Delivery contract |
| --- | --- |
| `events/poll` | Request events using arguments and an opaque cursor; no separate subscribe call. |
| `events/stream` | Hold a request open for pushed occurrences; closing it ends that subscription. |
| `events/subscribe` | Register an HTTPS callback for signed webhook delivery, renewing an expiring subscription before its granted lifetime ends. |

An event type advertises its supported modes; no particular mode is mandatory. Occurrences contain `eventId`, `name`, `timestamp`, `data`, and `cursor`. Replay is optional, and `truncated: true` signals missed events. This is not an exactly-once execution guarantee.

The client owns its desired subscriptions and must discover advertised extension support before calling `events/*`. Event payloads remain untrusted input under the MCP principal's authorization, not permission to execute their embedded instructions. Application policy must still control deduplication, budgets, approvals, and consequential actions.

The [Triggers & Events incubation repository](https://github.com/modelcontextprotocol/experimental-ext-triggers-events) tracks the evolving design. Keep this proposal distinct from released resource invalidation: “this document changed” is not the same contract as “a parameterized business event occurred.”
