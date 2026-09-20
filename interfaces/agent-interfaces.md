# Agent interfaces

An agent interface lets a person express intent, inspect work, supply missing information, and act on results. Chat is one interface; an inline editor, task panel, voice session, and command palette are others. The interface should expose the same underlying conversation and operation records when they represent the same work.

Separate three responsibilities:

- **Presentation:** messages, forms, files, audio playback, and feedback.
- **Interaction state:** drafts, selected items, expanded cards, and pending user decisions.
- **Execution state:** accepted requests, tool calls, approvals, durable runs, and completed changes.

A page can optimistically display a submitted message while the server assigns its permanent identifier. It cannot optimistically declare that a task was updated before the authoritative write succeeds. A browser disconnect also says nothing about whether a background worker stopped.

For example, a user requests a release summary by voice. The interface acknowledges the request, shows an active operation in the existing thread, and later displays a cited document. The spoken summary and document are two presentations of one result. They should share a run identifier so the application can recover the result after a reconnect.

Choose presentation according to the user's next decision. Prose suits explanations; a compact list suits search results; a form suits several interdependent inputs; an approval card suits a specific proposed action. Preserve a readable fallback for interactive content so history, notifications, and exports remain useful.

Accessibility belongs in the interaction contract: controls need names, focus must survive streaming updates, and progress announcements should not overwhelm screen readers. Keep operation outcomes visible even when the conversation's cosmetic state changes.
