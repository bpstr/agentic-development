# Failure recovery

Failure recovery restores useful execution after interruption while preserving completed work and authorization. It requires durable facts about the run, not merely a conversational summary saying what the agent planned to do.

Persist the goal, validated scope, current state, required continuation data, operation receipts, and pending user decisions. Claim work using a lease or equivalent mechanism so a crashed worker can be replaced without allowing uncontrolled concurrent execution.

On restart, distinguish three cases: work known to have failed before execution, work known to have completed, and work with an unknown outcome. Retry the first when appropriate, reuse the second, and reconcile the third before risking a duplicate effect.

For example, a provider timeout after a remote ticket was created should lead to a lookup using the operation's external reference. Re-running the entire conversation may create another ticket with a slightly different title, defeating ordinary duplicate detection.

Re-check mutable permissions and resource versions after long pauses. A stored approval must remain bound to the concrete operation and payload the user approved. Changed arguments or destinations require the applicable policy to run again.

Limit recovery attempts and provide a terminal failure with preserved diagnostics when automated recovery is exhausted. Test worker loss between persistence boundaries, duplicate job delivery, expired leases, and client reconnects. A checkpoint is useful only if its surrounding side-effect contract is well defined.
