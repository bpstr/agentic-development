# OpenAI Agents SDK

Official documentation: [Overview](https://developers.openai.com/api/docs/guides/agents/sdk), [Quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart), [Sandbox agents](https://developers.openai.com/api/docs/guides/agents/sandboxes). Source: [openai/openai-agents-python](https://github.com/openai/openai-agents-python).

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

## Sandbox agents

The current SDK also exposes Sandbox Agents for work that needs a filesystem, shell, skills, memory, or context compaction inside an isolated execution environment. A `SandboxAgent` combines an agent manifest with a sandbox backend; the SDK supports local Unix or Docker-backed development and provider-backed sandboxes through adapters.

Keep the control plane and compute boundary explicit. The SDK decides the agent lifecycle and capabilities, while the sandbox implementation supplies the isolated workspace. A sandbox session is not the same thing as durable business state, and filesystem persistence is not proof that an external mutation committed. Scope credentials and networking to the task, retain accepted artifacts outside disposable runtimes, and use a persistent backend only when resumption actually requires it.

Review tracing configuration and captured data, cap run duration and turns, and propagate cancellation to your tools. Moving a loop into the SDK or a sandbox changes the code and infrastructure you maintain; it does not eliminate model inference, execution, or network time.
