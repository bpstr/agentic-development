# OpenAI Agents SDK

Official documentation: [Overview](https://developers.openai.com/api/docs/guides/agents/sdk), [Quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart). Source: [openai/openai-agents-python](https://github.com/openai/openai-agents-python).

The OpenAI Agents SDK supplies application-owned agent loops, function tools, handoffs, guardrails, sessions, and tracing. The SDK runs in your process; the separately named Agents API operates a managed harness.

Create a Python environment and install the SDK:

```bash
python -m pip install openai-agents
```

Set `OPENAI_API_KEY` and `MODEL_ID` to an available tool-capable model. Save this as `example.py` and run it with Python:

```python
import asyncio
import os
from agents import Agent, Runner, function_tool

@function_tool
def document_title(document_id: str) -> str:
    """Return the title for a sample document identifier."""
    return {"doc-17": "Release checklist"}.get(document_id, "Unknown document")

agent = Agent(
    name="Document assistant",
    model=os.environ["MODEL_ID"],
    instructions="Look up titles with document_title; do not guess.",
    tools=[document_title],
)

async def main():
    result = await Runner.run(agent, "What is doc-17 called?")
    print(result.final_output)

asyncio.run(main())
```

The decorator exposes a schema from the function signature. The runner handles model/tool turns and returns the final output. The function remains ordinary application code, so a real implementation must authorize the resource and return a verifiable result.

Use async runner methods inside async services rather than nesting synchronous event loops. Configure session storage when history must persist; separately store business records and operation receipts. Guardrails complement deterministic authorization, but cannot grant users permissions they do not have.

Review tracing configuration and captured data, cap run duration and turns, and propagate cancellation to your tools. Moving a loop into the SDK changes the code you maintain; it does not eliminate model inference or network time.
