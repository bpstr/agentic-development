# OpenAI GPT-Live

Official documentation: [Getting started with GPT-Live](https://developers.openai.com/api/docs/guides/live) and [delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).

GPT-Live manages a spoken conversation while a backend handles reasoning and tools. It supports listening while speaking, and the backend can continue working through interruptions. Choose the voice model independently from the agent or model that performs the task.

Two delegation modes divide the integration differently. **Responses delegation** has OpenAI prepare backend model requests and return results to the live conversation. **Client delegation** lets the application choose context, run its own agent or service, and return verified results. In both modes, custom functions, permissions, confirmations, and durable business records remain application responsibilities.

## Basic session configuration

The official delegation guide documents this configuration shape:

```js
export const session = {
  model: "gpt-live-1",
  delegation: {
    type: "responses",
    responses: {
      model: "gpt-5.6-terra",
      instructions: "Answer release questions using verified project data.",
    },
  },
};
```

This configures a session; it does not open a connection. Use the WebRTC quickstart linked from the getting-started guide for a browser microphone, playback, and event channel. Serve the client over HTTPS or localhost and create the session through a trusted server holding the project API key. Wait for `session.started` before normal primary-connection commands.

## Correlate speech and work

Responses-backed backend events arrive inside `response.event` envelopes. Dispatch using the nested `event.type` and retain the outer `delegation_id`. A backend completion does not mean its result was spoken or heard.

With client delegation, maintain transcript and application context: the delegation event supplies metadata rather than a complete task prompt. Returning the correct result therefore depends on a context bridge as well as an execution service.

Keep detailed business instructions in the backend and conversational style in the voice prompt. Choose delegation mode when creating the session; changing modes requires a new session. Close sessions explicitly and account for voice duration separately from backend model and tool usage. The [Realtime API](https://developers.openai.com/api/docs/guides/realtime) remains a distinct documented voice architecture.
