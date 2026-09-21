# Voice agent interfaces

A voice agent interface turns a model or agent runtime into an understandable spoken interaction. The interface is responsible for capture, playback, session feedback, interruption controls, text fallback, and presentation of tool or background-work state. The underlying model architecture belongs under [voice and audio models](../../infrastructure/models/voice/voice-models.md).

A usable voice surface should make a small set of states obvious without exposing provider protocol details:

- whether microphone access is available and active;
- whether the system is listening, thinking, or speaking;
- whether the connection is healthy or reconnecting;
- whether a consequential action is awaiting approval;
- whether background work continues after the spoken turn;
- how to stop playback or end the session.

Do not treat the transcript as identical to the audio experience. Partial recognition can be revised, generated speech can be interrupted, and backend text can exist without ever being heard.

For example, “Summarize the release blockers” may start a longer backend analysis while the voice conversation continues. The interface should show that work separately, preserve the result in the conversation, and speak only the useful summary when appropriate. An interrupted spoken sentence should not erase a completed task.

Voice activity detection is not consent. A partial transcript such as “move the deadline to Friday—actually, Monday” illustrates why consequential actions should depend on resolved intent and the application's approval policy.

See [voice turn-taking](voice-turn-taking.md) for interruptions and backchannels, [voice session states](voice-session-states.md) for connection and microphone behavior, and [voice delegation](voice-delegation.md) for long-running work. [LiveKit frontends](https://docs.livekit.io/frontends/) and OpenAI's [voice-agent architecture guide](https://developers.openai.com/api/docs/guides/voice-agents) are useful implementation references.
