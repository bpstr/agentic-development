# AutoGen

Official documentation: [AgentChat quickstart](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/quickstart.html). Source and project status: [microsoft/autogen](https://github.com/microsoft/autogen).

AutoGen provides message-based agent coordination, with AgentChat supplying ready-made agents and team patterns. It remains useful for understanding and maintaining existing multi-agent applications. The canonical repository currently places AutoGen in maintenance mode and directs new development toward [Microsoft Agent Framework](https://github.com/microsoft/agent-framework).

Install the AgentChat package and the required model extension:

```bash
python -m pip install autogen-agentchat 'autogen-ext[openai]'
```

Set `OPENAI_API_KEY` and `MODEL_ID` to a model supported by the adapter. Save and run this Python script:

```python
import asyncio
import os
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def document_status(document_id: str) -> str:
    """Read the publication state of a sample document."""
    return {"doc-17": "approved"}.get(document_id, "unknown")

async def main():
    client = OpenAIChatCompletionClient(model=os.environ["MODEL_ID"])
    try:
        agent = AssistantAgent(
            "document_reader", model_client=client,
            tools=[document_status],
            system_message="Use document_status to answer document questions.",
            reflect_on_tool_use=True,
        )
        result = await agent.run(task="What is doc-17's status?")
        print(result.messages[-1].content)
    finally:
        await client.close()

asyncio.run(main())
```

For team execution, define termination conditions and a bounded coordination policy. State saving and loading require explicit application ownership; a running agent object is not a durable service. Avoid concurrent operations on one mutable conversation without synchronization.

The v0.2 and later AgentChat APIs differ substantially. Match examples to installed packages and follow the official migration guides when maintaining older applications. Do not choose an obsolete API simply because an older tutorial uses the same AutoGen name.
