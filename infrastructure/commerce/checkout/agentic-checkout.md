# Agentic checkout

Agentic checkout is a checkout flow in which an authorized software agent can create, inspect, update, and complete purchase state for a user through structured interfaces.

A robust agentic checkout should expose authoritative merchant state rather than asking the agent to calculate totals or infer availability. Typical primitives include checkout-session creation, retrieval, updates, completion, cancellation, fulfillment choices, buyer details, payment handoff, interventions, and idempotency.

The Agentic Commerce Protocol defines a concrete merchant REST contract for this pattern. Its checkout API keeps the merchant as the system of record and specifies safe retry mechanisms such as idempotency keys.

“Agentic checkout” should therefore be used as the lexical capability; vendor experiences such as ChatGPT Instant Checkout belong as implementations or product surfaces.
