# Agent handoffs

A handoff transfers responsibility for continuing an interaction to another agent or handler. After a successful handoff, the receiving agent becomes the active owner of the conversation or workflow segment. Delegation instead returns a subtask result to the original coordinator.

For example, a support triage agent can hand a billing conversation to a billing specialist. The handoff should include the user's request, verified account context, work already performed, unresolved questions, and the reason for transfer. Avoid copying every message when a bounded summary and evidence references suffice.

Model the transition explicitly: proposed recipient, accepted transfer, new active owner, and fallback if the recipient cannot proceed. A tool named `transfer_to_billing` alone does not prove that another service accepted the interaction.

Tool permissions follow the receiving execution context. A handoff must not escalate privileges just because the destination has broader tools. Recheck resource authorization and carry only credentials the destination is entitled to use.

Prevent routing loops with a transfer budget and a clear escalation path. Measure resolution quality and time across the whole interaction, including transfers. The [OpenAI Agents SDK handoff reference](https://openai.github.io/openai-agents-python/handoffs/) shows how a runtime can expose transfers through tool-like interfaces.
