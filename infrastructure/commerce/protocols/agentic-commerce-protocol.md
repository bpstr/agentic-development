# Agentic Commerce Protocol

Official documentation: [Agentic Commerce Protocol](https://www.agenticcommerce.dev/). Specification repository: [agentic-commerce-protocol](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol). Concrete snapshot: [2026-04-17 checkout API](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol/blob/main/spec/2026-04-17/openapi/openapi.agentic_checkout.yaml).

The Agentic Commerce Protocol (ACP) specifies programmatic commerce interactions among buyers, agents, merchants, and payment providers. The OpenAI- and Stripe-maintained repository currently labels the specification beta and publishes date-versioned snapshots.

ACP keeps the merchant's commerce system authoritative. The agent interacts with checkout state while the merchant controls pricing, inventory, payment acceptance, and fulfillment.

## A versioned checkout contract

The cited snapshot defines these operations:

| Operation | Method and path |
| --- | --- |
| Create | `POST /checkout_sessions` |
| Retrieve | `GET /checkout_sessions/{checkout_session_id}` |
| Update | `POST /checkout_sessions/{checkout_session_id}` |
| Complete | `POST /checkout_sessions/{checkout_session_id}/complete` |
| Cancel | `POST /checkout_sessions/{checkout_session_id}/cancel` |

A minimal retrieval request is:

```http
GET /checkout_sessions/session_example HTTP/1.1
Host: merchant.example.com
Authorization: Bearer <merchant-access-token>
API-Version: 2026-04-17
```

The merchant returns the session object defined by that snapshot. Mutating POST requests require an `Idempotency-Key`; preserve it across retries of the same operation and payload. Use the corresponding OpenAPI schemas and examples rather than combining fields from different versions.

## Implementation boundary

Implement the merchant endpoints against existing commerce services, test retry and intervention behavior, and reconcile completion with durable order state. Protocol compatibility does not automatically list a merchant in a shopping product; participation and discovery are separate integration processes.

The acronym ACP is also used by unrelated agent protocols. Use the full name when distinguishing commerce from editor or agent communication contracts.
