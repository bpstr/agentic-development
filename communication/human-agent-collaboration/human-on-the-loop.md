# Human on the loop

Human-on-the-loop systems let automated work proceed while a person supervises, inspects progress, and can intervene. The agent operates within an established mandate; a human does not need to approve each individual step covered by that mandate.

This arrangement fits work with bounded consequences, observable progress, and practical recovery. For example, a repository agent can inspect files, prepare a change, and run checks while a developer reviews progress and can redirect the task. Publishing the change can remain a separate action governed by the application's existing authorization rules.

Effective supervision needs more than a stream of generated narration. Show durable task state, completed operations, failures, and the evidence behind consequential decisions. Provide controls to pause, cancel, or change direction, and define what those controls mean for operations already in flight. Stopping an agent loop does not necessarily cancel an external service request.

Set escalation conditions for missing authority, unexpected effects, or unresolved ambiguity. These conditions determine when supervision becomes a required decision before work continues. The model is less suitable when effects happen faster than a person can detect and interrupt them. In that case, narrow execution limits or explicit decision points provide a stronger boundary than passive monitoring alone.
