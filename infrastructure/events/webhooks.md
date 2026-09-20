# Webhooks

Webhooks deliver event notifications to an application's HTTP endpoint. Agent systems can use them to trigger background work when a pull request changes, a document is published, or an external job finishes.

## Validate before scheduling work

Check the provider's signature over the original request bytes before trusting parsed content. Re-serializing JSON can change those bytes and break verification. GitHub, for example, signs configured webhook deliveries with HMAC-SHA256 in `X-Hub-Signature-256`. [GitHub signature validation](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries).

A typical receiver performs these steps:

1. Validate signature and any provider-defined freshness checks.
2. Persist the delivery identity and payload.
3. Enqueue the authorized workflow.
4. Acknowledge receipt promptly.

For example, a pull-request webhook can enqueue a review for a specific repository and commit. The worker should verify that the commit still needs review before posting an outcome.

## Receipt differs from completion

Avoid keeping the webhook connection open while an agent performs long work. A successful acknowledgement confirms accepted delivery, not a completed review.

Providers have different retry and redelivery contracts. Deduplicate using the documented delivery or event identity and make business effects idempotent.

A valid signature authenticates the sender; it does not make user-written issue text trustworthy instructions. Apply the application's authorization and prompt-injection boundaries when that content enters model context.
