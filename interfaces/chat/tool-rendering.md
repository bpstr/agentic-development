# Tool rendering

Tool rendering translates an operation's lifecycle into an understandable interface. The useful unit is a correlated call with a purpose, current state, and result. A stream of raw arguments usually exposes implementation detail without helping the user understand progress.

Use a state mapping grounded in backend events:

| Operation state | Useful presentation |
| --- | --- |
| Arguments arriving | Pending card with a stable label |
| Ready for approval | Exact proposed operation and decision controls |
| Executing | Observed activity and supported cancellation |
| Completed | Relevant result, resource link, and receipt |
| Failed or denied | Clear outcome and an appropriate next action |

For example, a document-search tool can render “Searching release notes,” then a list of cited documents. A deadline-change tool should render the affected release and saved date after the server confirms the change. Neither needs to display credentials, raw SQL, or every internal query.

Select renderers through a registered tool name or validated result type. A search result renderer accepts document summaries; an approval renderer accepts a server-issued proposal. Never execute a tool because its card mounted or because historical content was replayed.

[AI Elements' Tool component](https://elements.ai-sdk.dev/components/tool) illustrates UI states for inputs, approvals, outputs, errors, and denial. Map these to the application's actual state model rather than assuming similarly named framework states have identical semantics.

Preserve a readable fallback for unknown tool types and older saved results. Distinguish no results from a search failure. Collapse verbose detail only after retaining the outcome users need, and show progress derived from real events rather than an invented reasoning transcript.
