# Automated client identity

Automated client identity establishes which software operator or agent infrastructure sent a web request. It addresses a different question from user authentication: identifying the automated caller does not by itself prove which user it represents or what that user authorized.

A self-declared `User-Agent` string is weak evidence because another client can copy it. IP allowlists can help for stable infrastructure but become awkward for distributed, shared, or intermediary agent services.

## Signed automated requests

The IETF Web Bot Auth working group is developing a protocol that uses HTTP Message Signatures to authenticate automated traffic. The current working-group draft, published 1 September 2026, describes signed HTTP requests and key discovery for automated clients.

Primary references: [Web Bot Auth working group](https://datatracker.ietf.org/wg/webbotauth/documents/) and [HTTP Message Signatures for automated traffic](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/).

Cloudflare documents Web Bot Auth as one verification method for bots and agents and uses cryptographic request signatures to associate traffic with a verified automated client. See [Cloudflare Web Bot Auth](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/).

## Keep identities distinct

A web request can involve several principals:

- **operator** — organization or infrastructure controlling the automated client;
- **agent** — configured software acting for a task;
- **user or business subject** — principal whose authority is being exercised;
- **run** — one execution instance;
- **resource account** — tenant or account at the destination service.

Preserve these separately in authorization and audit records. [Agent identity](../../infrastructure/identity/agent-identity.md) and [user delegation](../../infrastructure/identity/user-delegation.md) cover the application-level authority chain.

## Verified does not mean authorized

A valid signature can establish that a request came from a recognized automated client and was not modified in transit according to the signature contract. It does not automatically grant access to protected resources, prove that a user approved a purchase, or make the request safe.

After verifying the caller, apply ordinary authorization, rate limits, resource policy, validation, and abuse controls.

Commerce-specific schemes can carry additional context. Visa's [Trusted Agent Protocol](https://developer.visa.com/capabilities/trusted-agent-protocol/docs) uses message signatures and merchant-side verification to help distinguish recognized commerce agents and communicate agent intent. Treat such protocol assertions according to their documented trust model rather than converting them into unrestricted application authority.

## Operational checks

Verification code should reject invalid or expired signatures, use the protocol's replay protections, resolve keys from trusted locations, and record enough identity material to explain later policy decisions. A proxy or CDN can verify an automated client at the edge, but the application still needs a trustworthy way to receive the resulting identity and policy decision.
