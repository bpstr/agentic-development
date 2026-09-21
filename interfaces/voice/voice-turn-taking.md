# Voice turn-taking

Turn-taking is the interface behavior that decides when the user is speaking, when the system should answer, and what happens when speech overlaps. It is distinct from the selected voice model.

A natural voice UI needs to handle at least four cases:

1. the user is still speaking despite a pause;
2. the user has finished and expects a quick response;
3. the user intentionally interrupts the assistant;
4. the user produces a backchannel such as “mhm” or “right” that should not necessarily seize the turn.

Voice activity detection alone is often insufficient because silence does not reveal conversational intent. Systems may combine VAD, transcription endpointing, semantic or acoustic turn detectors, and model-native turn signals.

[LiveKit's turn documentation](https://docs.livekit.io/agents/logic/turns/) is a useful implementation reference because it separates turn detection, endpointing, interruptions, false interruptions, and preemptive generation. Its [adaptive interruption handling](https://docs.livekit.io/agents/logic/turns/adaptive-interruption-handling/) also distinguishes deliberate barge-ins from short backchannels.

## Interface behavior

When the user interrupts:

- stop or fade obsolete playback quickly;
- visibly switch from speaking to listening;
- truncate displayed or stored “spoken” content only when the underlying provider supports reliable delivered-audio semantics;
- decide separately whether any backend task should continue;
- preserve committed tool results even if the spoken response was interrupted.

When an interruption is judged false, resuming speech can be better than generating a new answer. The UI should avoid flashing through several states for short background noises.

Expose state without making the user understand the underlying pipeline. Typical labels are **Listening**, **Thinking**, **Speaking**, **Reconnecting**, and a concise failure state. Do not expose raw VAD or token-stream events as the primary interaction model.

ElevenLabs documents explicit [interruption events](https://elevenlabs.io/docs/eleven-agents/customization/events/client-events) and per-tool [interruption modes](https://elevenlabs.io/docs/eleven-agents/customization/tools/tool-configuration/tool-interruptions), which are useful references for testing cases where speech may be interruptible while an operation itself must continue.

Measure end-of-turn latency, accidental interruptions, recovery after false interruptions, and whether the transcript/history matches what the user actually heard.
