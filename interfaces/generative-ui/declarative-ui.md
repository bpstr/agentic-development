# Declarative UI

Declarative UI describes what should be displayed without providing arbitrary code for how to construct it. In an agent application, the model emits a structured description and a trusted renderer maps that description to components it already implements.

Three contracts are usually involved: a **catalog** defines available components and their props; a **surface** identifies a region of UI; and a **data model** contains values that components can reference. Actions connect user interaction to application behavior.

For example, a release-planning surface might contain a heading, a deadline field bound to `/release/deadline`, and a submit button. Changing the field updates local draft state. Submitting sends the draft to the backend, which validates the date and permissions and returns the saved value or a pending approval. A form submission should not rely on the model interpreting a new natural-language message correctly.

Stable component IDs let streamed updates modify existing UI without discarding keyboard focus or user-entered values. Define how remote updates interact with a locally edited field; silently overwriting unsaved input is usually the wrong default.

Version the catalog and reject unknown components or invalid properties. Limit nesting, collection sizes, resource destinations, and action types. A declarative description can still contain hostile URLs, excessive data, or misleading labels; a trusted renderer must enforce the actual capability boundary.

[A2UI's component and surface specification](https://a2ui.org/specification/v0.9.1-a2ui/) is a concrete example of this separation. Declarative UI does not prescribe a particular visual framework or transport: web and native renderers can implement the same agreed catalog with platform-appropriate controls.
