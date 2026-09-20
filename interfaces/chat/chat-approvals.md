# Approval controls in chat

An approval control records a user's decision about a specific pending operation. It should display the operation the server will execute: target, proposed change, recipient or destination when relevant, and any material cost. A generic “Allow?” button cannot communicate what its approval covers.

Create the proposal before rendering the control. An illustrative display record is:

```json
{
  "approvalId": "approval_6",
  "operationId": "op_18",
  "proposalVersion": 2,
  "target": {"id": "release_7", "label": "September release"},
  "change": {"field": "deadline", "from": "2026-09-24", "to": "2026-09-25"},
  "state": "pending"
}
```

The client submits the decision and proposal identity. The server authenticates the actor, reloads the proposal, checks that it remains pending and unchanged, and authorizes execution. Client-supplied labels and an `approved: true` value cannot replace those checks.

Represent pending, submitting, approved, rejected, expired, and superseded states explicitly. Approval and successful execution are separate outcomes: an approved request can still fail because the target changed or a dependency became unavailable. Display the execution receipt when it arrives.

An approval policy should ask only for decisions that actually require human input. Routine authorized actions do not benefit from repeated confirmation. For operations that need approval, keep the control keyboard accessible and explain the consequence in plain language. Bind voice or text confirmations to the same authoritative proposal.

The [AI Elements Confirmation component](https://elements.ai-sdk.dev/components/confirmation) is one presentation implementation. The policy and decision record remain backend responsibilities. Reopening the conversation should restore the existing decision instead of offering an already consumed approval again.
