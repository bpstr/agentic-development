# PydanticAI

Official documentation: [Overview and examples](https://pydantic.dev/docs/ai/overview/), [Agent API](https://pydantic.dev/docs/ai/api/pydantic-ai/agent/). Source and releases: [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai), [releases](https://github.com/pydantic/pydantic-ai/releases).

PydanticAI is a Python agent framework centered on typed dependencies, function tools, and validated outputs. It is useful when an agent is part of a typed application service and the result needs to satisfy a concrete schema.

Install `pydantic-ai`. Set the provider key and `PYDANTIC_MODEL` to the documented `provider:model` form, such as an OpenAI model with `OPENAI_API_KEY`. This example includes both a tool and a typed result:

```python
import os
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext

class DocumentAnswer(BaseModel):
    document_id: str
    status: str

agent = Agent(os.environ["PYDANTIC_MODEL"], output_type=DocumentAnswer)

@agent.tool
def status_lookup(ctx: RunContext[None], document_id: str) -> str:
    """Look up a sample document's publication status."""
    return {"doc-17": "approved"}.get(document_id, "unknown")

result = agent.run_sync("Use status_lookup to report the status of doc-17.")
print(result.output.model_dump())
```

Run this as a normal Python script. In an async service, use the corresponding async runner. Real tools can receive request-scoped dependencies through `RunContext` so tenant identity and database clients do not have to become model-generated arguments.

Schema validation establishes shape and types; it does not establish that the reported status is true or authorized. Preserve source evidence and validate domain invariants in application code. Set usage and retry limits so validation retries cannot expand indefinitely.

PydanticAI's durable-execution integrations are separate choices. A typed `Agent` object alone does not persist a run across worker restarts. Keep model output, execution checkpoints, and business state distinct.

## Current v2 boundaries

PydanticAI's v2 line now includes a harness/workspace layer as well as the typed `Agent` API. A workspace gives harness capabilities such as filesystem and shell operations one interface across the local machine or a configured sandbox, including durable-execution integrations. Keep workspace execution permissions separate from model output validation: a valid typed request is not permission to run a command or read a path.

Upgrade deployed v2 applications to **2.52.0 or later** if they use the local `web_fetch` tool with untrusted content. The September 29, 2026 release fixes a moderate denial-of-service issue where deeply nested attacker-controlled HTML could consume excessive CPU and memory during local HTML conversion. The v1 maintenance line carries the same fix in 1.107.7; provider-native web fetching is not affected by that advisory.

Recent v2 releases also expand realtime-provider support, including GPT-Live and Gemini 3.8 Live. Treat realtime model compatibility as version-sensitive and pin the framework version together with the provider/model configuration used in evaluation.
