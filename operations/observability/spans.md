# Spans

A span records a timed operation inside a distributed trace. It has an identity, start and end times, attributes, optional events, and causal relationships. Parent spans often surround child operations. A trace's elapsed duration is therefore not the sum of all span durations. [OpenTelemetry span concepts](https://opentelemetry.io/docs/concepts/signals/traces/).

Give spans operational names such as `load_project`, `model_request`, and `execute_tool`. Attach bounded attributes for model, tool, status, and attempt. Avoid embedding full user messages or unique URLs in span names; high-cardinality names make aggregation difficult and can expose private data.

Suppose a worker span lasts six seconds and contains two parallel database calls lasting one second each. Those calls occupy about one second of elapsed time together. The sum of their operation durations is two seconds; it is neither the user's elapsed time nor a measurement of CPU or other resource usage.

Use events for instants such as first useful text or cancellation requested. Use separate spans for independently timed attempts. Preserve causality across asynchronous queues with context propagation or span links as appropriate.

Record errors according to the operation's contract. A successful search with zero matches is not necessarily an infrastructure error. Likewise, a transport success returning a business-level rejection should retain that outcome. Span attributes should let a reader distinguish the two without inspecting a complete private payload.
