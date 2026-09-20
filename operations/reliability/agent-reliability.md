# Agent reliability

Reliability is the ability to complete intended tasks within defined operational limits while preserving application invariants. It includes meaningful failures: an agent should clearly report a denied operation, an unmet prerequisite, or exhausted budget rather than claim success.

Define success from the underlying outcome. For a task update, require the correct record and field change, current authorization, a durable receipt, and an accurate response. For research, require adequate evidence and a stored result. A valid model response alone proves neither.

Plan for failures at each boundary: provider timeout, invalid arguments, tool error, worker restart, disconnected client, and revoked permission during a pause. Assign each a retry, suspend, reconcile, or terminal-failure behavior.

For example, if a worker loses its connection after saving a comment, the next attempt should retrieve the operation receipt. Creating another comment and then apologizing for the duplicate does not preserve reliability.

Use explicit budgets for time, attempts, model steps, and delegation. Record terminal state independently of the UI stream. Test recovery from actual boundary conditions rather than only ordinary successful conversations.

Service-level objectives should identify the task class and measurable event, such as authorized read requests completed within a deadline. Aggregate uptime can remain high while a critical tool path consistently fails, so track outcome quality and dependency failures alongside infrastructure availability.
