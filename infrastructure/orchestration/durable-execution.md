# Durable execution

Durable execution preserves enough history and state to continue work after process failure, deployment, or a long wait. It includes recovery semantics, not merely storing the last chat message or placing a job in a queue.

A durable agent run needs a stable identity, persisted inputs, checkpoints, outstanding tool calls, recorded results, and terminal or suspended states. The worker should acknowledge a step only after its next recoverable state exists.

The difficult boundary is an external side effect. Suppose a worker creates an invoice and crashes before saving the response. Retrying the same tool without an operation key can create a second invoice. Use downstream idempotency support, transactional writes where available, and reconciliation for unknown outcomes. Durability does not automatically provide exactly-once business effects.

Replay-based engines also distinguish deterministic workflow decisions from activities that perform I/O. A model request is an activity whose returned result must be recorded; replay should not silently ask a nondeterministic model to decide again.

Use durable execution for background research, approval waits, scheduled jobs, and operations that must finish despite client disconnects. Define cancellation and retention alongside retries. [Temporal's execution model](https://docs.temporal.io/workflow-execution) and [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) document ways to preserve execution state; their precise replay and retry guarantees differ.

## Recover an unknown external-write outcome

This is an **application timeline**, not an assertion that every provider supports idempotency:

| Moment | Durable local evidence | External state | Recovery rule |
| --- | --- | --- | --- |
| Before sending | Operation op-84, payload hash, authorized intent, state prepared | No known effect | Persist intent before making the request |
| Request in flight | op-84 in-flight | Outcome not yet known | A disconnect does not establish failure |
| External write commits | Still in-flight | One invoice exists for op-84 | The business effect already happened |
| Worker crashes before saving response | Still in-flight | Invoice still exists | Mark outcome unknown; do not generate a new key |
| Replacement worker reconciles | Receipt recovered for op-84 | Same invoice | Persist the receipt and resume from its result |

Recovery may query by a provider-supported operation reference or resend the identical request with the original key **only within that provider's documented deduplication semantics and retention window**. Keep the payload fingerprint with the key; changed arguments require a new authorized operation, not reuse of an old key. A local outbox alone cannot make a non-idempotent external service exactly-once.

When the service supports neither reliable lookup nor deduplication, suspend the operation as unresolved and escalate. Do not claim failure or success from a timeout alone. A cancellation received after commit stops later work; reversing the committed effect is a separate, authorized compensating operation.

Exercise crashes before send, after external commit, and after receipt persistence. Also test two workers claiming the same job, key expiry, and changed payloads. Verify both the local operation state and the number of actual external effects in an isolated test service. A mocked successful response verifies your control flow, not the downstream service's guarantee.
