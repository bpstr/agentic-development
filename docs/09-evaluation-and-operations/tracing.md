# Tracing an agent request

[Handbook](../../README.md) · [Chapter](README.md)

A **trace** connects operations involved in one request or job. A **span** records one operation's start, end, attributes, and relationship to other operations. An **event** marks an instant, such as the first visible answer token. OpenTelemetry defines these concepts independently of any agent framework. [Trace concepts](https://opentelemetry.io/docs/concepts/signals/traces/).

## Follow the whole user action

Instrument the browser submission, application request, queue wait, worker, context preparation, each provider call, tool dispatch, MCP client/server, underlying database or API, and final UI delivery. A provider dashboard cannot automatically measure work inside your uninstrumented application.

Propagate trace context across HTTP and queued jobs. Where a background job has a separate trace, retain its causal link and application run ID. Do not pretend that adding the same text label creates a parent-child relationship. [Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/).

Useful attributes include model ID, prompt revision, tool name, attempt number, terminal status, usage counters, and a non-secret application run ID. Capture payloads only under an explicit retention and access policy.

## Read durations without double-counting

This is a **synthetic timeline**, in seconds from browser submission. It is not a vendor measurement.

| Operation | Start | End | Duration |
| --- | ---: | ---: | ---: |
| User-visible action | 0.00 | 6.60 | 6.60 |
| HTTP acknowledgement | 0.00 | 0.10 | 0.10 |
| Queue wait | 0.10 | 0.20 | 0.10 |
| Worker, parent of the following work | 0.20 | 6.45 | 6.25 |
| Context preparation | 0.20 | 0.40 | 0.20 |
| First provider call | 0.40 | 2.40 | 2.00 |
| MCP tool A | 2.40 | 3.40 | 1.00 |
| MCP tool B, parallel with A | 2.40 | 3.00 | 0.60 |
| Second provider call | 3.40 | 6.40 | 3.00 |
| Persist result | 6.40 | 6.45 | 0.05 |
| Deliver and render completion | 6.45 | 6.60 | 0.15 |

The user waited **6.60 seconds**. Adding the parent worker to its children counts the same elapsed time twice. Adding A and B also exaggerates their contribution: together they occupied **1.00 second** on the critical path, because B finished while A was running.

## What a provider span cannot tell you

A measured two-second API request may contain network transit, provider queueing, input processing, internal orchestration, inference, and output delivery. Unless the provider supplies appropriately defined timings, those components remain unobserved. Subtracting visible tool spans from a larger “envelope” leaves unattributed time; it does **not** prove “reasoning time” or framework overhead.

Streaming introduces several distinct measurements: HTTP acknowledgement, first event, first useful answer text, and completed result. A heartbeat or progress event can arrive quickly while the useful answer remains slow. Define the event used by every metric.

Clock differences across services can distort a timeline. Prefer local monotonic durations and synchronize hosts; investigate impossible ordering before drawing latency conclusions.

## Representative observability tools

| Tool | Role |
| --- | --- |
| [OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/traces/) | Instrumentation and trace propagation conventions across the application |
| [LangSmith](https://docs.langchain.com/langsmith/observability) | Agent/model traces and evaluation workflows across supported frameworks |
| [Langfuse](https://langfuse.com/docs/observability/overview) | LLM-oriented tracing, usage, prompt management, and evaluation; self-hosting is available |

Check SDK capture defaults: OpenAI Agents SDK documents controls for sensitive model and function payloads. [Tracing data controls](https://openai.github.io/openai-agents-python/tracing/). Measure exporter overhead and queue behavior instead of assuming either zero cost or responsibility for all missing time.

**Source review:** 2026-09-19. All timings above are invented for explanation; no tracing service was performance-tested.
