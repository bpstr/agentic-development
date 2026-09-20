# Tool approvals

An approval is a recorded decision allowing a specific proposed action to proceed. It is useful when a workflow requires human judgment about an external message, payment, deletion, deployment, or other consequential effect. The application's policy determines when approval is needed.

Approval should describe the concrete effect. “Allow tools” is less informative than “Publish document 42, version 7, to this URL.” A useful approval record binds the decision to the principal, operation, target, arguments, and relevant object version.

Illustrative application record:

```json
{
  "approval_id": "approval-17",
  "operation": "publish_document",
  "document_id": "doc-42",
  "expected_version": 7,
  "decision": "approved",
  "approved_by": "user-8"
}
```

This is not a provider schema. Store it alongside the operation record and enforce it in trusted code.

## Keep the proposed action stable

If the target, recipients, amount, or content changes after review, the old decision may no longer apply. Revalidate authorization and object versions before execution. An approval cannot grant permissions the approving user lacks.

Pause work through an explicit state such as `awaiting_approval`. A timeout, disconnected browser, or unrelated chat message is not an affirmative decision. Resuming the workflow should execute the reviewed operation once and retain its result.

Remote tool systems may expose provider-specific approval events; for example, OpenAI's [MCP integration](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) supports approval requests before data is shared with remote servers. That mechanism's scope differs from a business application's publishing policy.

Avoid unnecessary approval prompts for work already covered by clear authorization. Excessive prompts make significant decisions harder to identify.
