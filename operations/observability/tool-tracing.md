# Tool tracing

Tool tracing connects a model's operation request to the actual executor and result. The model's call ID identifies the requested tool interaction; an application operation ID identifies the business action; trace and span IDs describe telemetry relationships. Preserve all three when they serve different purposes.

A useful sequence is validation, authorization, dispatch, dependency work, persistence, and result delivery. Trace the boundary where execution really occurs. If an MCP client sends a request to another process, instrument the receiving service as well as the client to explain internal delays. [OpenTelemetry context propagation](https://opentelemetry.io/docs/concepts/context-propagation/) describes how causal context travels across service boundaries.

For example, a task update may commit in the database before the HTTP response times out. The trace should show a committed operation receipt and a delivery failure, so retry handling can recover the existing result.

Useful attributes include tool name, operation key, attempt, target type, validation result, terminal outcome, and elapsed time. Capture arguments selectively; authentication tokens and complete retrieved records rarely belong in routine telemetry.

Do not merge retries into one unexplained span or interpret every failed tool response as a model error. A malformed argument, permission denial, unavailable dependency, and unknown commit outcome require different recovery. Link tool traces to evaluated outcomes to establish whether the final answer accurately described the operation.
