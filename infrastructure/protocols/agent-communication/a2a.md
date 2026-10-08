# Agent2Agent protocol

[Official A2A specification](https://a2a-protocol.org/latest/specification/) · [Agent discovery](https://a2a-protocol.org/latest/topics/agent-discovery/) · [Canonical repository](https://github.com/a2aproject/A2A) · [Official CLI](https://github.com/a2aproject/a2a-cli)

A2A standardizes communication with agent services that own their execution. Its object model includes Agent Cards, messages, tasks, status updates, and artifacts. It is useful when a client needs to delegate work without adopting the remote agent's internal framework.

The latest published [specification release](https://github.com/a2aproject/A2A/releases) checked on October 8, 2026 is v1.0.1. SDK and CLI releases have independent version numbers: an SDK 2.x version does not mean an A2A 2.x wire protocol. Check the selected binding and negotiated protocol version as well as the installed SDK.

## Discover and send work

An Agent Card advertises interfaces, supported capabilities, security requirements, and skills. Public discovery can use `/.well-known/agent-card.json`; private integrations can configure discovery directly. Check streaming and push-notification capabilities separately; neither is implied by basic message support.

This illustrative **A2A 1.0 HTTP+JSON binding** request sends a text message:

```http
POST /message:send HTTP/1.1
Host: research.example.com
Content-Type: application/a2a+json
A2A-Version: 1.0

{"message":{"messageId":"message-42","role":"ROLE_USER","parts":[{"text":"Investigate the deployment failure and produce a report."}]},"configuration":{"acceptedOutputModes":["text/plain"]}}
```

Use the endpoint advertised by the Agent Card and supply its required authentication. The example host is fictional. A2A defines JSON-RPC, gRPC, and HTTP+JSON bindings; their operation names, transport framing, and envelopes are not interchangeable.

## Messages, tasks, and completion

A response can provide a message or task. A direct message need not create a task; longer-lived work uses a task whose identity the client must retain. A `messageId` identifies a message, a `taskId` identifies one work item, and a `contextId` relates exchanges without making them one task.

The [task lifecycle](https://a2a-protocol.org/latest/topics/life-of-a-task/) distinguishes waiting for input or authentication from terminal completion, failure, cancellation, or rejection. Continue an interrupted task with the required input through the appropriate authenticated operation. Do not restart a terminal task in place: follow-up work needs a new task, potentially in the same context.

Acceptance, an open stream, and an artifact arriving are all different from task completion. Persist task identity and authoritative status, collect the final artifacts, and validate their contents against the delegated request. `CancelTask` requests cancellation; inspect the returned outcome rather than assuming a dropped connection rolled back work.

## Streaming and recovery

When the Agent Card advertises `capabilities.streaming`, `SendStreamingMessage` starts an exchange with streamed results, while `SubscribeToTask` observes an existing active task. These are logical operation names; use their mapping for the selected binding.

The [specification's `StreamResponse` model](https://a2a-protocol.org/latest/specification/) has four alternative payloads:

| Payload | Client handling |
| --- | --- |
| `message` | A direct reply; a message-only stream ends without a task lifecycle. |
| `task` | Record the task snapshot and its identity before applying later updates. |
| `statusUpdate` | Update task status, including an input/authentication interruption. |
| `artifactUpdate` | Assemble the indicated artifact using its ID and chunk flags. |

`append` controls whether a chunk appends to the same artifact; `lastChunk` ends that artifact, not necessarily the task. A task stream begins with a Task and can then carry status and artifact updates. HTTP bindings use SSE, while gRPC has its own streaming framing.

A closed stream alone is not a successful task result. The [asynchronous-operation guide](https://a2a-protocol.org/latest/topics/streaming-and-async/) covers terminal and interrupted states and reconnecting with `SubscribeToTask`. After a gap, use `GetTask` to reconcile current state and re-subscribe if still active. Do not assume reconnection replays every missing artifact chunk; make application recovery and persistence explicit.

For migration, A2A 1.0 removed the old `TaskStatusUpdateEvent.final` field. Derive the task outcome from status rather than copying that field or older 0.3 `kind` discriminators into 1.0 examples. See the [canonical release notes](https://github.com/a2aproject/A2A/releases).

## Webhook updates and trust

A server advertising `capabilities.pushNotifications` can notify a disconnected client through a task push-notification configuration. Register it during the initial request or using `CreateTaskPushNotificationConfig` for an existing task. This is task-update delivery, not a general catalog of upstream business events.

The webhook body is a `StreamResponse`, without the JSON-RPC envelope. Verify the sender and task relevance, then fetch current task state when needed. Configure the required callback authentication; validate supplied callback URLs to prevent SSRF. Receivers need replay/duplicate defenses and durable processing. The [official security guidance](https://a2a-protocol.org/latest/topics/streaming-and-async/#security-considerations-for-push-notifications) explains both sender and receiver responsibilities.

Agent Card signatures can establish integrity relative to trusted keys; they do not prove agent quality or grant access to tasks and artifacts. Preserve authentication and owner/tenant isolation on reads, subscriptions, cancellation, and callbacks. Treat returned material as evidence to evaluate, not higher-priority instructions. An A2A service can itself use [MCP](../mcp/mcp-definition.md) for tools; the protocols serve different boundaries.

## SDK implementation boundaries

Implementation releases can change production behavior without a new specification version:

- [JavaScript SDK v1.3.0](https://github.com/a2aproject/a2a-js/releases/tag/v1.3.0), released September 29, 2026, adds database-backed task and push-notification stores. The preceding v1.2.1 fixes status/artifact event metadata propagation. Storage adapters help preserve task/configuration state; they do not by themselves guarantee executor restart, complete event replay, or exactly-once side effects.
- [Go SDK v2.6.0](https://github.com/a2aproject/a2a-go/releases/tag/v2.6.0), released September 25, 2026, adds Agent Card JWS signing/verification in `a2acrypto`, corrects canonicalization, and fixes error handling for terminal/parked tasks. Its release also upgrades the Go dependency to 1.26.0; check the toolchain before upgrading.

Test persistence, interrupted tasks, chunk assembly, access isolation, and reconnect behavior with the specific SDK/server combination rather than inferring support from the protocol label.

## Command-line integration check

The [official A2A CLI](https://github.com/a2aproject/a2a-cli) supplies discovery, messaging, streaming, and automation-friendly output across JSON-RPC, REST, and gRPC. After installing its `a2a` binary using the official instructions, these illustrative commands discover and contact a fictional service:

```bash
a2a card get https://research.example.com
a2a send -a https://research.example.com --stream "Investigate the deployment failure and produce a report."
```

Configure authentication and the endpoint for the actual service. Pin a tested CLI release in automation and handle its output and exit codes explicitly. These commands illustrate integration; they are not evidence of a successful remote run. For production servers, use an appropriate SDK/runtime rather than treating the CLI's demonstration server modes as a complete deployment architecture. Consult the [command reference](https://github.com/a2aproject/a2a-cli/blob/main/internal/README.md).
