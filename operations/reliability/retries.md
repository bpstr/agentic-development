# Retries

A retry repeats an operation after a failure. It helps only when the failure is plausibly temporary and repetition is safe. Invalid arguments, denied access, and exhausted credentials generally need correction rather than repeated identical requests.

Set a total deadline and attempt budget. Apply bounded backoff with jitter to avoid synchronizing many clients against a recovering service, and respect documented retry guidance. Account for retries already performed by SDKs or gateways; nested retry layers can multiply attempts unexpectedly.

For example, three application attempts around a client configured for three attempts can generate up to nine downstream requests. That amplifies load, latency, and cost. Choose a primary retry owner and retain attempt numbers in telemetry.

A timeout on a read is usually easier to retry than a timeout after a mutation. Before repeating a write, establish whether the original operation committed. Use an operation key and receipt or a provider-supported idempotency mechanism.

The retry decision should retain the original authorized intent. Asking the model to reinterpret the whole task after every network failure may create a different action. Preserve validated arguments and replay only the failed boundary when appropriate.

HTTP method semantics provide useful context in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods), but an endpoint's actual application contract determines whether a particular operation can be retried safely.
