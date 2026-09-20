# Models versus agents

A model computes outputs from inputs using learned parameters. An agent is an executing software system that uses a model to select actions within an environment. The same model can power a fixed extraction request, an interactive assistant, or a long-running investigation.

These terms describe different layers:

- A **model call** requests inference and can return text, tool requests, or other typed output.
- A **tool call** requests an operation exposed by the application or a connected service.
- A **run** tracks execution toward a goal, including intermediate calls and its terminal state.
- A **turn** is work associated with conversational input; a run can include multiple calls within a turn.
- A **session** retains continuity across interactions according to the runtime's state model.
- An **agent definition** configures model choice, instructions, tools, and policies; an **agent instance** executes that configuration.

For example, a model can emit an instruction to update task T-42. The agent runtime must validate arguments, authenticate the actor, enforce task permissions, execute the update, and return its result. This separation appears in the [function-calling interaction](https://developers.openai.com/api/docs/guides/function-calling).

Replacing the model changes one dependency. Replacing the runtime may change state retention, approvals, retries, tool execution, and hosting. A model benchmark therefore cannot measure the reliability of an entire agent, and two agents using the same model can behave very differently.
