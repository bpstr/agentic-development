# Agent-native applications

An agent-native application treats model-driven work as a first-class execution mode. The term describes an architectural direction rather than a formal standard: agents can compose domain capabilities while sharing the application's durable state, identity, and user-visible outcomes.

Keep domain operations explicit. The same application service can handle a task update from a form, an API client, or an agent tool. Authorization, validation, transactions, and activity recording should follow the same rules across those entry points.

For example, “prepare the next release” may involve reading tasks, identifying blockers, drafting notes, and proposing a release date. The agent coordinates these steps; the task service owns task state, document storage owns the draft, and the user can inspect the resulting artifacts through ordinary product views.

[Anthropic's workflow and agent distinction](https://www.anthropic.com/engineering/building-effective-agents) helps separate fixed application flows from model-directed choices. Both can coexist within one product.

Persist long-running work independently of the chat connection. Expose progress, pending decisions, failure, and cancellation through durable run state so reconnecting users see what actually happened.

Avoid making conversation text the sole record of business state. A message claiming success is weaker than a committed operation receipt. The application should remain usable for inspection and correction when the model is unavailable or makes an incorrect choice.
