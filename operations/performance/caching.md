# Application caching

Caching reuses earlier work under an explicit validity contract. Agent systems can cache source reads, retrieval results, embeddings, generated answers, or provider-side input processing. These caches have different keys and invalidation rules.

Prompt caching reuses eligible model input processing. It does not return an old final answer. [OpenAI's prompt caching guide](https://developers.openai.com/api/docs/guides/prompt-caching) describes that provider's matching behavior; other APIs have their own policies.

Application answer caching returns stored output. Its key may need tenant, user access scope, source revisions, prompt revision, model configuration, locale, and the normalized task. Semantically similar questions are not necessarily entitled to the same private answer.

For example, a release summary can be reused until any relevant task or policy changes, provided the requesting user can access every cited record. A cache hit after permission revocation must not expose the earlier answer. Time-to-live alone cannot establish authorization.

Prefer caching immutable intermediate work, such as embeddings for a specific document revision, when final answers are highly contextual. Prevent concurrent misses from creating unnecessary duplicate work, but do not hold global locks across slow model calls.

Never treat a cached success sentence as permission to replay a mutation. Idempotency records recover the result of an identified operation; answer caches reuse content. Monitor hit rate alongside freshness failures and invalidation delay.
