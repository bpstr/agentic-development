# Webhooks

Webhooks deliver event notifications between services over HTTP. Agent systems can use them to trigger background work or update context when external systems change.

Verify signatures, store event IDs, acknowledge only after durable receipt where reliability matters, and make handlers idempotent because providers may retry delivery.
