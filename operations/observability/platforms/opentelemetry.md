# OpenTelemetry

[Official documentation](https://opentelemetry.io/docs/) · [Python instrumentation](https://opentelemetry.io/docs/languages/python/instrumentation/) · [Collector](https://opentelemetry.io/docs/collector/)

OpenTelemetry supplies APIs, SDKs, conventions, and collection components for telemetry. It instruments applications and exports data to a compatible backend; it is not itself the trace storage and analysis interface.

For a minimal local Python example, install `opentelemetry-sdk` in a virtual environment. This program emits spans to the console and makes no model request:

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor
from opentelemetry.sdk.trace.sampling import ALWAYS_ON

provider = TracerProvider(sampler=ALWAYS_ON)
provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("task-assistant")

with tracer.start_as_current_span("agent_run"):
    with tracer.start_as_current_span("load_task") as span:
        span.set_attribute("app.task.id", "T-42")
        span.add_event("record_loaded")

provider.shutdown()
```

The shared trace ID and parent relationship connect the operations. `app.task.id` is an application attribute, not an official semantic convention. The demo explicitly samples every span so inherited sampling configuration cannot hide its output; choose an appropriate sampling policy for production.

For deployment, configure a service resource, appropriate exporter, batching, sampling, and context propagation through HTTP and jobs. A Collector can receive and process telemetry before forwarding it. Bound buffers and test shutdown flushing so exporting neither blocks requests indefinitely nor silently loses every short-lived process's spans.

Keep sensitive payloads out of default attributes. Adding instrumentation establishes visibility into measured boundaries; it does not measure uninstrumented work inside another provider.
