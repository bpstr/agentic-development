# PydanticAI

Official documentation: [Overview and examples](https://pydantic.dev/docs/ai/overview/), [Agent API](https://pydantic.dev/docs/ai/api/pydantic-ai/agent/). Source: [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai).

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
