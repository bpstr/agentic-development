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

<a id="proposed-events-extension"></a>

## Events extension

The [official Events extension](https://modelcontextprotocol.io/extensions/events/overview) (`io.modelcontextprotocol/events`, SEP-3415) reached Beta in November 2026; the SEP is Final. It requires protocol revision 2026-07-28 or later and is not part of the released core notification contract. The [canonical extension repository](https://github.com/modelcontextprotocol/ext-events) contains the specification. Check both client and server support before using extension methods.

The extension describes upstream business events, such as an email arriving or an incident opening. `events/list` advertises event names, subscription argument schemas, payload schemas and delivery modes. Each event type supports a subset of these operations:

| Operation | Delivery contract |
| --- | --- |
| `events/poll` | Ask for events with arguments and an opaque cursor. |
| `events/stream` | Receive occurrences while a request remains open. |
| `events/subscribe` | Register an HTTPS callback for signed deliveries under a renewable TTL. |

Occurrences include `eventId`, `name`, `timestamp`, `data` and `cursor`. Persist cursors and deduplicate stable event identifiers within a subscription. Replay is optional; `cursor: null` means no addressable history and `truncated: true` indicates a gap. Poll and push are ordered within a subscription; webhook ordering is best effort. Receiving an event does not prove exactly-once execution or authorize follow-up work. Reconcile authoritative state after gaps, enforce current permissions and approvals, and treat payloads as untrusted input. Use Tasks instead for the completion of an operation the client itself started.
