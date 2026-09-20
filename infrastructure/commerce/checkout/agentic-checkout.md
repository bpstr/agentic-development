# Agentic checkout

Agentic checkout is a purchase flow in which an authorized software agent can create, inspect, update, and complete checkout state through structured interfaces. It gives the agent a concrete transaction model instead of requiring it to infer purchase semantics from page appearance.

The merchant remains authoritative for products, availability, prices, taxes, fulfillment options, and accepted payment methods. An agent supplies user choices and presents the resulting state; it does not calculate a competing total from product descriptions.

## The checkout lifecycle

A typical flow creates a session for selected item identifiers, supplies buyer and delivery information, applies fulfillment choices, and resolves any required intervention. Completion uses the chosen payment mechanism and returns a durable result that can be reconciled with an order.

The exact status names and endpoints depend on the protocol. The [Agentic Commerce Protocol](../protocols/agentic-commerce-protocol.md) provides a versioned concrete contract.

Consider a delivery-price change after the address is entered. The application should present the updated total and ensure authorization covers that actual purchase. A user's earlier interest in an item is different from authorization to complete an altered transaction.

Reliable completion also needs an idempotency strategy. If a request times out after the merchant commits the order, retrying must not silently create a second order. Preserve the operation identifier, retrieve authoritative state, and distinguish a definitive failure from an unknown outcome.

Checkout completion, payment settlement, and fulfillment are related but distinct events. An agent-facing receipt should report the state actually established, including any action that still requires user intervention.
