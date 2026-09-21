# Universal Commerce Protocol

Official specification: [Universal Commerce Protocol](https://ucp.dev/specification/overview/). Canonical repository: [Universal-Commerce-Protocol/ucp](https://github.com/Universal-Commerce-Protocol/ucp). Release announcements: [UCP announcements](https://ucp.dev/documentation/announcements/).

The Universal Commerce Protocol (UCP) is an open protocol for commerce interactions between platforms, businesses, and payment providers. Google and Shopify introduced it in January 2026 with broader industry participation. The current published release is `v2026-08-25`, announced on 25 August 2026.

UCP separates commerce capabilities from transport. A business can advertise capabilities and expose them over supported interfaces such as REST, MCP, or A2A.

## Discovery and capability negotiation

Businesses publish a profile at:

```text
/.well-known/ucp
```

The profile declares protocol version, services, capabilities, schemas, transports, and endpoints. Clients use the intersection of compatible versions and capabilities rather than assuming every UCP business implements the same surface.

A simplified profile can look like:

```json
{
  "ucp": {
    "version": "2026-08-25",
    "services": {
      "dev.ucp.shopping": [
        {
          "version": "2026-08-25",
          "transport": "rest",
          "endpoint": "https://business.example.com/ucp"
        }
      ]
    },
    "capabilities": {
      "dev.ucp.shopping.checkout": [
        {
          "version": "2026-08-25"
        }
      ]
    }
  }
}
```

Use the exact schemas from the selected UCP version in a real implementation; this abbreviated object illustrates discovery only.

## Transport is separate from commerce semantics

The August 2026 specification defines bindings for multiple transports. For example, the catalog capability can be exposed through REST or MCP, while UCP extensions can also be advertised through an A2A Agent Card.

This means MCP and A2A remain general agent protocols. UCP supplies commerce-specific data models, capabilities, discovery, and negotiation on top of supported transports.

## Keep business state authoritative

Capability negotiation does not move pricing, inventory, checkout, payment acceptance, or fulfillment authority into the model. The business remains responsible for validating requests and returning authoritative commerce state.

Treat payment authorization as another explicit boundary. UCP documents interoperability with payment mechanisms such as AP2, but discovering a checkout capability does not grant spending authority.

## Version against the published schemas

UCP is actively evolving. Pin examples and integrations to a documented protocol release, publish the versions a business actually supports, and negotiate capabilities instead of mixing fields from different revisions.

The [agentic commerce](../agentic-commerce.md) page describes the broader commerce lifecycle; [agent payments](../../economics/agent-payments.md) covers payment authority separately.
