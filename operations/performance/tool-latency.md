# Tool latency

Tool latency covers the time needed to validate, authorize, execute, and deliver an operation result. Separate dispatch overhead from the underlying database or service request when deciding what to optimize. A fast tool handler can still wait behind a saturated connection pool.

Measure client and server boundaries, queue wait, dependencies, response size, and retries. The model's delay before selecting a tool belongs to inference; the application's tool execution belongs to the operation. Keep them visible separately.

For a task search, a useful trace might show 20 ms validation, 600 ms database wait and query, and 80 ms serialization and transfer. Removing a 10 ms adapter cannot resolve most of that delay. Reducing result size or improving the database path can.

Run independent reads concurrently when permissions and consistency allow it. Keep dependent steps ordered: an update that needs the result of an earlier lookup cannot safely execute against a guessed identifier. Bound concurrency to avoid creating a slower overloaded dependency.

Use deadlines and distinguish cancellation from unknown outcomes. A timeout after a write is not proof that the write failed. Cache only operations whose freshness and authorization contracts allow reuse, and use operation receipts to recover completed mutations. Record tail latency and timeout rate, not only successful averages.
