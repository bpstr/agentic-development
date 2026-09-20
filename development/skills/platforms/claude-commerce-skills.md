# Claude commerce skills

Official overview: [Build commerce agents with Claude](https://claude.com/solutions/commerce).

Anthropic's commerce materials package reusable agent behavior for consumer and merchant workflows. The published overview links to a forkable blueprint, reference implementations, and a Claude Code plugin for adapting the blueprint to a commerce system.

The consumer side includes product discovery, planning, cart and checkout actions, customer care, and personalization. Merchant workflows include catalog, inventory, analytics, promotions, and campaign operations. These are categories of agent behavior; they do not imply that every merchant API has the same operations.

## Adapt a workflow to real merchant tools

Start from the blueprint linked by the official overview and select a reference implementation that resembles the domain. Configure its documented model access and replace example catalog or merchant integrations with real interfaces.

An illustrative behavior specification is:

```text
Find products matching the customer's constraints.
Use merchant responses for price, availability, and variants.
Present the selected cart and resolve required information.
Complete checkout only within the user's authorized purchase.
```

The skill supplies decision guidance. Catalog services supply product state; checkout and payment interfaces execute the transaction. Preserve those boundaries when adapting the implementation. Adopters maintain their fork; Anthropic's overview states that the reference code carries no service-level agreement.

## Verify with commerce edge cases

Use test data to exercise unavailable items, price changes, ambiguous variants, failed payment handoffs, and interrupted requests. Check that the agent reports authoritative state and does not invent successful orders.

The [commerce infrastructure](../../../infrastructure/commerce/agentic-commerce.md) taxonomy explains the underlying capabilities. These skills are implementation resources for Claude-based behavior, distinct from the [Agentic Commerce Protocol](../../../infrastructure/commerce/protocols/agentic-commerce-protocol.md).
