# Computer use

Computer use gives an agent the ability to observe and operate graphical software environments. Inputs can include screenshots, accessibility structures, DOM state, or application-specific observations; actions can include clicks, typing, scrolling, keyboard shortcuts, and navigation.

The execution loop observes the environment, selects an action, executes it, and inspects the resulting state. The model proposes behavior; a separate executor operates the browser or desktop. A screenshot of a filled form proves that fields are populated, while a submitted form needs separate evidence such as a confirmation page or persisted record.

Computer use is useful for legacy applications and workflows without structured APIs. It is generally less deterministic than calling a purpose-built tool because focus, loading state, overlays, and layout affect the meaning of each action. Repeating a click after a timeout can duplicate an operation that already succeeded.

For example, an agent updating a task should locate the intended task, inspect its current status, change the field, and verify the saved value. Record observations and action results separately so failures can be diagnosed. Give the environment only the accounts and files needed for that task, set step and time limits, and apply confirmation rules at consequential boundaries. Instructions encountered inside a page remain external content, even when they look like operating guidance.
