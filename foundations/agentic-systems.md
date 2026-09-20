# Agentic systems

An agentic system lets a model choose some of the actions used to reach a goal. A runtime supplies instructions, context, callable tools, state, and stopping conditions. The agent's effective capabilities come from this complete system, including permissions and integrations.

The degree of autonomy is a design choice. A research assistant may choose which sources to inspect while application code limits it to reading. A support agent may draft a refund and require approval before a payment operation. A deployment workflow can allow diagnosis while reserving release authorization for a person.

Consider a request to explain a delayed release. The runtime makes project tools available; the model selects a task search, inspects a dependency, and produces an explanation. Each tool result supplies evidence for the next decision. The application records the completed run and its source references.

[Anthropic's architectural guidance](https://www.anthropic.com/engineering/building-effective-agents) distinguishes predefined workflows from systems where models choose their next actions. Products use the word “agent” more broadly, so document actual control flow when comparing them.

An agent needs explicit completion and suspension conditions: a supported answer, an executed action, a request for missing information, a budget limit, or a failure. Unbounded continuation is not a useful success criterion. Evaluate persisted outcomes and operation receipts; an agent saying it completed work is not evidence that the underlying system changed.
