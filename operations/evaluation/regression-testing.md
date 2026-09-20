# Regression testing

Regression testing checks whether a change breaks behavior that previously met requirements. Agent changes include prompts, models, tool schemas, retrieval configuration, memory policies, and framework adapters as well as application code.

Run inexpensive deterministic checks for protocol parsing, authorization, state transitions, and idempotency. Recorded model events are useful inputs for these tests, but replaying them cannot establish how the current model will behave. Selected live cases cover that separate uncertainty.

For example, changing a task tool's status field from a label to an identifier should exercise schema rejection, correct identifier resolution, and compatibility with the actual model adapter. A snapshot of the final sentence alone will miss an update to the wrong status.

Keep a small representative suite for frequent iteration and a broader evaluation set for material behavior changes. Bound concurrent calls, attempts, and spend. “Offline evaluation” often means a dataset experiment outside production; it may still call paid model APIs.

Compare identical dataset revisions and inspect individual failures. A higher overall pass rate can conceal a new authorization failure or large latency regression. Treat critical invariants separately from average quality.

When a production incident yields a new case, preserve its failure mechanism in a sanitized fixture. Record the application and prompt revisions that fixed it. The goal is to reproduce a consequential behavior, not to create tests that merely repeat the implementation's internal structure.
