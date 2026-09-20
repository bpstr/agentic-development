# Agent approvals

An approval authorizes a specific action, plan, or transition within a defined scope. It can come from an explicit user instruction, a recorded decision on a pending proposal, or a standing authorization recognized by application policy. The system should preserve valid authorization across turns instead of repeatedly requesting the same decision.

Store the proposed operation, relevant arguments, approving principal, time, scope, and eventual execution receipt. Bind the decision to the actual resource and intended effect. For example, approval to publish a particular draft applies to that draft and destination; a materially changed audience or payload may require another policy decision.

Approval belongs in application state. A model's recollection that someone “probably agreed earlier” cannot establish who authorized which action. Record authorization from the authenticated interaction and carry the resulting identifier into execution. Recheck applicable conditions if the resource changes while the action is pending.

The interface should show enough concrete information to make a decision, including the target and consequence. Expiration, rejection, and cancellation must have defined outcomes. An unanswered prompt is not approval. When existing authorization covers the action, continue within its scope and record the outcome without adding a redundant approval step.
