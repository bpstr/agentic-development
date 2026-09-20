# Agent2Agent protocol

[Official A2A specification](https://a2a-protocol.org/latest/specification/) · [Agent discovery](https://a2a-protocol.org/latest/topics/agent-discovery/) · [Canonical repository](https://github.com/a2aproject/A2A)

A2A standardizes communication with agent services that own their execution. Its object model includes Agent Cards, messages, tasks, status updates, and artifacts. It is useful when a client needs to delegate work without adopting the remote agent's internal framework.

## Discover and send work

An Agent Card advertises interfaces, supported capabilities, security requirements, and skills. Public discovery can use `/.well-known/agent-card.json`; private integrations can configure discovery directly.

This illustrative **A2A 1.0 HTTP+JSON binding** request sends a text message:

```http
POST /message:send HTTP/1.1
Host: research.example.com
Content-Type: application/a2a+json
A2A-Version: 1.0

{"message":{"messageId":"message-42","role":"ROLE_USER","parts":[{"text":"Investigate the deployment failure and produce a report."}]},"configuration":{"acceptedOutputModes":["text/plain"]}}
```

Use the endpoint advertised by the Agent Card and supply its required authentication. The example host is fictional.

## Track the outcome

A response can provide a message or task; ongoing work is represented through the task lifecycle and associated artifacts. The application must retain task identity, inspect status, and collect the resulting artifact. An acknowledgement is not evidence that the report is complete.

A2A defines multiple bindings, including JSON-RPC, gRPC, and HTTP+JSON. Do not mix their envelopes or copy older 0.3 `kind` discriminators into a 1.0 message.

Authentication, artifact access, and result validation remain integration responsibilities. A2A describes the exchange, not the remote service's quality or trustworthiness. A service reached through A2A can itself use MCP for tools; the protocols serve different boundaries.
