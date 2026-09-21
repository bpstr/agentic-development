# Content use signals

Content-use signals express a publisher's preferences for how already-accessible content may be used by automated systems. They are policy metadata, not authentication or access control.

Different uses should remain distinguishable. Search indexing, retrieval for an immediate AI answer, agentic task input, dataset construction, and model training have different operational and licensing implications.

## Content Signals

Cloudflare's Content Signals framework uses the `Content-Signal` HTTP response header to express preferences such as:

- `search` — use in search;
- `ai-input` — use as input to AI systems, including agentic use;
- `ai-train` — use for AI training.

Cloudflare's Markdown for Agents preserves an origin-provided Content Signals policy when converting HTML to Markdown. If no origin policy is present, the service currently adds its documented default.

Primary sources: [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) and [Content Signals policy announcement](https://blog.cloudflare.com/content-signals-policy/).

## Keep policy close to the representation

When a site exposes HTML and Markdown forms of the same content, the policy should not accidentally diverge because one representation passed through a converter or CDN. Preserve the origin's signal where possible and keep the canonical resource, revision, and provenance identifiable.

A client also needs to distinguish a machine-readable preference from an enforceable license or authenticated entitlement. A header can communicate intended use; contractual terms, authentication, paywalls, and technical controls may impose additional conditions.

## Do not overload robots.txt

Crawler access and downstream content use are related but separate. `robots.txt` primarily communicates which resources a crawler may fetch. Content-use metadata communicates what the publisher says should happen after access.

Systems that honor these signals should record the policy observed with the fetched revision so later processing can explain which rules applied to that copy.
