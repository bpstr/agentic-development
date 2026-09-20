# Handoff pattern

A handoff transfers responsibility for continuing work or conversation from one agent to another. The receiving agent becomes the active owner of subsequent interaction. In agent-as-tool delegation, the original caller instead remains responsible and receives a subtask result.

A useful handoff carries the objective, relevant constraints, resolved entity IDs, completed actions, unresolved questions, and the reason for transfer. Preserve provenance for important decisions rather than forwarding an unexplained summary.

For example, a support agent may transfer a billing dispute to a billing specialist after identifying the account and invoice. The specialist needs those identities and the customer's request; it does not automatically need unrelated support conversations or broader account permissions.

[LangChain's handoff documentation](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs) describes state changes that determine the active agent or behavior. A handoff is an orchestration mechanism, not a universal wire protocol or permission grant.

Define what happens when the recipient is unavailable, rejects the task, or requires another specialist. Track the active owner in durable state and bound repeated transfers to prevent routing loops.

The user should retain continuity: previously supplied information should remain available, successful actions should not repeat, and the current agent should explain any genuinely missing context. Recheck mutable business state before acting on a transferred historical observation.
