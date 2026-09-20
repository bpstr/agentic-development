# Agent loops

An agent loop repeatedly supplies context to a model, receives an answer or proposed action, executes allowed actions, and returns observations for the next decision. The loop ends when it reaches a defined outcome or a limit.

A practical iteration has distinct responsibilities:

1. Load the authenticated principal, current task state, and relevant context.
2. Call the model with the tools it may request.
3. Persist the response and correlate each tool call with its identifier.
4. Validate arguments and authorize the specific resource and action.
5. Execute permitted tools, recording results and write receipts.
6. Feed results back or persist a terminal or suspended state.

A request to execute a tool is data. It does not grant permission and does not prove that the action happened. A successful model response also does not necessarily mean the user's task succeeded: work can fail, be cancelled, exhaust its budget, or wait for input.

Bound iterations, elapsed time, parallel calls, and spending independently. Check cancellation before scheduling new actions. Preserve unresolved call results after a disconnect so the next worker does not blindly repeat a mutation.

The [tool-loop pattern](../../patterns/tool-loop.md) shows application responsibilities. [OpenAI's agent runner documentation](https://developers.openai.com/api/docs/guides/agents/running-agents) describes a framework implementation of the same loop.
