# Agent access policy

Agent access policy defines what automated clients may read or do on a web property. Treat crawling, content use, authenticated access, and transactional authority as separate policy dimensions.

A useful policy asks independently:

- may this client crawl the resource?
- may it index or reference the content?
- may the content be supplied as input to an AI system?
- may it be used for model training?
- may the client authenticate as a user or workload?
- may it invoke a modifying operation?
- may it transact or spend money?

One affirmative answer does not imply the others.

## Crawl directives are not authorization

`robots.txt` standardizes crawler access preferences for automated retrieval. RFC 9309 explicitly defines the Robots Exclusion Protocol; it is not an access-control mechanism. Protected data should require authentication and authorization independently of crawler directives.

Primary source: [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309).

Likewise, [content-use signals](content-use-signals.md) can express preferences about downstream use after content has been accessed. They do not secure the resource.

## Bind action policy to the operation

A page that exposes an [agent-addressable action](../agent-addressable-actions.md) should apply the same server-side authorization and validation as the corresponding human operation. Browser session state or successful agent discovery does not grant broader access.

For modifying operations, define scopes, approval requirements, rate limits, retry semantics, and whether the operation is reversible. Recheck authority at execution time instead of relying on a capability description cached earlier in the workflow.

## Combine identity with policy

Cryptographic [automated client identity](../trust/automated-client-identity.md) gives a site a stronger input for policy than a spoofable user-agent string. A site can then differentiate anonymous crawlers, known service bots, user-directed agents, authenticated users, and first-party automation.

Identity is still only an input. Authorization should consider the effective user, resource, tenant, requested operation, current grant, and destination policy.
