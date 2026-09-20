# Agentic commerce

Agentic commerce is commerce in which software agents participate in discovery, product selection, configuration, purchasing, order management, or merchant operations on behalf of people or businesses. The category includes shopping assistance and operational work such as catalog maintenance.

It spans several distinct capabilities: finding products, understanding offers, maintaining a cart, obtaining an authoritative quote, completing checkout, delegating payment credentials, tracking fulfillment, and handling support. An implementation may support only some of them.

## Keep merchant state authoritative

An agent can translate “a large blue shirt under my budget” into structured catalog constraints. The merchant service determines which variants exist, whether stock remains available, and the current total. The agent should not invent a discount, infer payment success from conversational text, or substitute a stale offer for a fresh checkout response.

A useful application separates recommendation from execution:

1. Retrieve candidate products with stable identifiers.
2. Ask the merchant to calculate purchase state.
3. Resolve missing information or required user decisions.
4. Complete the authorized purchase through a defined contract.
5. Reconcile the order and fulfillment state.

[Agentic checkout](checkout/agentic-checkout.md) describes the purchase capability. The [Agentic Commerce Protocol](protocols/agentic-commerce-protocol.md) specifies one concrete interaction model. [Schema.org Actions](structured-actions/schema-org-actions.md) describe web semantics, while [Claude commerce skills](../../development/skills/platforms/claude-commerce-skills.md) package reusable agent behavior.

These layers can cooperate, but none removes the need for explicit identity, business authorization, reliable state transitions, and auditable outcomes.
