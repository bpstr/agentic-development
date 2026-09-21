# Voice session states

A voice interface should model connection, microphone, user activity, agent activity, and durable work as separate state dimensions. Collapsing them into one “online/offline” flag produces misleading UI during permission errors, reconnection, interruptions, and background work.

A practical UI can derive a compact visible state from facts such as:

```text
connection: disconnected | connecting | connected | reconnecting | failed
microphone: unknown | requesting | granted | denied | muted
user:       idle | speaking
agent:      idle | thinking | speaking
work:       idle | running | awaiting-approval | completed | failed
```

The visible label may still be only **Listening**, **Thinking**, or **Speaking**, but the underlying distinctions make transitions and recovery deterministic.

## Microphone and browser state

Browser microphone capture uses `navigator.mediaDevices.getUserMedia()`, which requires a secure context such as HTTPS or localhost and explicit user permission. Permission denial is not the same as a network failure. See [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

For two-way audio, inspect the actual selected track settings when debugging echo or feedback. Browser media constraints can request processing such as echo cancellation, but the resulting settings should be observed rather than assumed. See [MDN echoCancellation](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/echoCancellation).

## Connection lifecycle

Keep the transcript and useful completed work when the realtime transport fails. Reconnection should restore or reconcile session state where the provider supports it; it should not silently create duplicate user turns or replay already-committed actions.

Provider and framework event models can help drive UI state. For example, [LiveKit AgentSession events](https://docs.livekit.io/agents/logic/sessions/) expose user and agent state changes, while [ElevenLabs client events](https://elevenlabs.io/docs/eleven-agents/customization/events/client-events) distinguish audio, transcripts, corrections, interruptions, and connection-health events.

## UI requirements

Always provide:

- a clear microphone permission or muted state;
- a visible way to stop playback;
- a text fallback or transcript where the product supports it;
- a recoverable connection error;
- explicit pending/approval state for consequential tools;
- an ended-session state that does not look like a temporary pause.

Do not equate generated text with heard audio, or an agent tool request with a completed application action.
