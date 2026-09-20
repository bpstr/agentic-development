# Agentic Commerce Protocol

Official documentation: https://www.agenticcommerce.dev/
Specification repository: https://github.com/agentic-commerce-protocol/agentic-commerce-protocol

The Agentic Commerce Protocol (ACP) is an open interaction model and specification for programmatic commerce between buyers, AI agents, sellers, and payment providers. It is maintained by OpenAI and Stripe and is currently beta.

ACP keeps sellers as the merchant of record. Agents can create and update checkout sessions, present authoritative seller state, and complete purchases while merchants retain pricing, inventory, payment acceptance, fulfillment, and post-purchase responsibilities.

The protocol uses date-versioned specifications and publishes OpenAPI definitions, JSON Schemas, examples, and RFCs. Current protocol work covers checkout, payments, capability negotiation, extensions, catalog/feed and order-related surfaces, authentication, and MCP integration.

ACP should be distinguished from a generic “agentic checkout” feature. **Agentic checkout** is a commerce capability; ACP is one concrete protocol that specifies such interactions.
