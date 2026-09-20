# Speech-to-speech interaction

Speech-to-speech systems process spoken input and produce spoken output within an audio model or integrated voice session. They can use acoustic information such as timing and emphasis that a plain transcript does not fully preserve. The surrounding application must still manage turns, playback, tools, and history.

Distinguish the audio pipeline from the conversational model. Input capture supplies samples in an accepted encoding and sample rate. A session processes those samples, emits audio and events, and the client queues playback. Transcription may be available alongside audio, but its ordering and completeness need not match playback exactly.

For example, an assistant begins “The first issue is…” and the user interrupts with “Only show critical ones.” A correct response requires more than muting the speaker: the system needs to identify the interruption, discard or truncate obsolete playback, update conversational context, and decide what to do with any active retrieval.

Maintain separate records for input transcript, generated response, and delivered audio where the provider exposes that distinction. Do not record an unheard paragraph as though it were fully communicated to the user. A tool result may also arrive after the spoken interaction has moved on.

Measure audio quality under realistic conditions: noise, speaker feedback, accents, silence, network jitter, and rapid interruptions. End-to-end latency includes capture buffering, turn detection, model processing, transport, and output buffering.

Speech-to-speech is not synonymous with full duplex. Listening while speaking, interruption semantics, and control over output depend on the chosen implementation. Compare those capabilities explicitly when choosing between a direct audio session and a chained speech pipeline.
