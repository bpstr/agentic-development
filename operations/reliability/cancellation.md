# Cancellation

Cancellation requests that execution stop. It does not imply that previously completed work is reversed. Model inference, tool execution, remote jobs, and UI streaming may have independent lifecycles, so cancellation must be propagated and observed at the relevant boundaries.

Represent `cancel_requested` separately from `cancelled`. A worker should stop scheduling new operations, signal interruptible work, and record completed effects. A final state must reflect races honestly: an action can commit just before the cancellation signal arrives.

For example, cancelling a release report can stop remaining searches while retaining already-written notes. Cancelling after an email was accepted by the delivery service cannot make the email unsent. Report the completed action and any remaining uncertainty.

Bind cancellation to a stable run identifier and authorize the caller. Closing a browser connection should not automatically cancel every durable background job; that behavior is a product decision.

Check cancellation before costly steps and after long waits. Release worker leases and temporary resources according to their lifecycle, while preserving enough state for diagnosis. Retrying a cancelled job must not silently restart it unless the application explicitly authorizes a resume.

Compensation is a separate operation that attempts to counteract an earlier effect. It can fail and may require new permission. Do not describe compensation as a guaranteed transactional rollback across independent services.
