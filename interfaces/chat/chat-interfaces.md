# Chat interfaces

A chat interface presents a conversation as ordered contributions while supporting the operations that conversation initiates. Agent chat commonly combines text, attachments, sources, tool activity, and pending decisions. Treating every contribution as a Markdown string loses information needed for reliable controls and history.

A useful interface has a composer, a message timeline, clear run status, and contextual actions. The composer owns the draft; the timeline displays persisted messages and current streaming parts. A separate run record distinguishes “request accepted” from “answer complete.”

Consider “Move the release deadline to Friday.” The interface first shows the user's request. If clarification is needed, it asks for the affected release. If policy requires confirmation, it displays the exact proposed date and release. After execution, it shows the saved value and a link to the release. These states must come from application events, not from interpreting phrases in generated text.

Keep conversational controls distinct:

- Editing a message changes or branches conversation history.
- Regenerating an answer creates another response attempt.
- Stopping generation interrupts output production.
- Cancelling an operation asks the worker to stop work that may already have effects.

Support reconnection by loading authoritative messages, pending approvals, and active runs. Replaying a conversation for display must not execute its historical tools again.

For rendering, choose a library with a state adapter that fits the backend and a component system that fits the product. [assistant-ui](libraries/assistant-ui.md) provides runtime-aware primitives and styled elements; [AI SDK UI](libraries/vercel-ai-sdk-ui.md) supplies conversational state and transport integration. Neither choice decides the application's authorization or persistence model.
