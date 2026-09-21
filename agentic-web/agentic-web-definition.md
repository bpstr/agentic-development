# Agentic web

The **agentic web** is the part of the web in which software agents are treated as first-class clients: they can discover information and capabilities, interpret machine-readable representations, invoke structured operations, establish authority, and complete tasks without relying exclusively on interfaces designed for manual human interaction.

This does not replace the human web. A service can expose an HTML interface for people and, from the same underlying application state, expose Markdown, structured data, APIs, browser tools, or agent-to-agent interfaces for software.

## Separate the layers

A useful model has five layers:

1. **Discovery** — find relevant content, services, agents, or capabilities.
2. **Representation** — obtain content in a form whose structure and provenance can be understood.
3. **Interaction** — invoke operations with defined inputs, outputs, errors, and effects.
4. **Authority and trust** — establish who is acting, for whom, and within which permissions.
5. **Economic exchange** — quote, purchase, pay, meter, or otherwise exchange value under explicit policy.

These layers solve different problems. An `llms.txt` file can help discover documentation but does not authorize a purchase. A cryptographically signed automated request can establish the caller's identity but does not grant it access to a user's account. An API can expose an operation without providing a way for an unknown agent to discover it.

## Human and agent interfaces can coexist

A human-oriented flow often looks like:

```text
human -> browser -> HTML/UI -> application -> services
```

An agentic flow can instead use:

```text
human -> agent -> machine-readable content / tools / APIs -> application -> services
```

The same task may cross several interfaces. An agent can read product data from structured content, check live inventory through an API, use WebMCP inside an authenticated browser session, and complete a purchase through a commerce protocol. Prefer the interface that preserves the strongest application contract rather than forcing every task through visual automation.

[Agent-readable web](agent-readable-web.md) covers representations, [agent-addressable actions](agent-addressable-actions.md) covers callable operations, and [interaction models](interaction-models.md) compares the available execution surfaces.

## First-class does not mean unrestricted

An agent-friendly service still needs ordinary application guarantees. Authenticate callers where required, bind authorization to the resolved resource, validate every operation server-side, make consequential effects explicit, and record durable outcomes.

Automated traffic also creates operational concerns that human interfaces often hide: concurrency, retries, polling, scraping, cost amplification, and machine-speed transactions. [Agent traffic](operations/agent-traffic.md) covers those production effects.

The agentic web is therefore not one protocol. MCP, WebMCP, A2A, HTTP APIs, structured data, commerce protocols, bot authentication, and payment mechanisms each address different boundaries of the same larger environment.
