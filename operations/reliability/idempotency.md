# Idempotency

An idempotent operation has the same intended effect when repeated as when applied once. Agent execution frequently encounters duplicate delivery because of retries, reconnects, queue redelivery, or lost responses. Idempotency prevents those duplicates from becoming repeated business actions.

For a comment creation, generate an operation key before execution and bind it to the authenticated actor, target, and validated payload. Persist the key and result atomically with the write when they share a transactional store. A retry with the same key returns the recorded result; the same key with changed arguments must be rejected.

Illustrative application logic:

```text
begin transaction
  insert operation key and payload hash if the key is absent
  load and lock the operation record
  require its actor, scope, and payload hash match this request
  if the operation is completed: commit and return its receipt
  create the intended comment
  save receipt under the operation key
commit
```

Concurrent attempts require a real uniqueness constraint or equivalent coordination. The insert must handle conflicts by loading the existing record; a reused key with a different payload must fail. Checking for a key and then writing outside that protection leaves a race. This example assumes the operation record, comment, and receipt share one transaction, so an abandoned transaction cannot leave an independently committed incomplete reservation.

External services complicate atomicity. Use their idempotency feature if available, or reconcile unknown outcomes through stable external references. A local transaction cannot roll back an already-sent external message.

Idempotency is distinct from deduplicating similar language. Two identical requests can be intentional separate actions. Use execution identity and the actual operation contract, not semantic similarity. Retain receipts long enough for the retry window and document what happens after they expire.
