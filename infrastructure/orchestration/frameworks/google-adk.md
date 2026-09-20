# Google Agent Development Kit

Official documentation: [ADK](https://adk.dev/), [Python quickstart](https://adk.dev/get-started/python/). Source: [google/adk-python](https://github.com/google/adk-python).

Google Agent Development Kit (ADK) is a framework for agents, tools, workflows, sessions, callbacks, and evaluation. Its workflow agents describe deterministic sequencing, parallelism, and loops alongside model-directed agents. ADK is distinct from Gemini inference and Google's managed agent hosting.

Install ADK and create a project using its CLI:

```bash
python -m pip install google-adk
adk create document_agent
```

The CLI creates an agent package. Configure its provider credentials as described by the quickstart. For Gemini, set `GOOGLE_API_KEY`; set `MODEL_ID` to a supported Gemini model in the process environment. Replace `document_agent/agent.py` with:

```python
import os
from google.adk.agents.llm_agent import Agent

def document_status(document_id: str) -> dict:
    """Read the publication state of a sample document."""
    return {"document_id": document_id,
            "status": {"doc-17": "approved"}.get(document_id, "unknown")}

root_agent = Agent(
    name="document_agent",
    model=os.environ["MODEL_ID"],
    description="Answers document status questions.",
    instruction="Use document_status to answer; report unknown IDs clearly.",
    tools=[document_status],
)
```

From the directory containing the package, run `adk run document_agent` and ask for `doc-17`. `adk web` provides a local development interface. The exported `root_agent` is the package's entry point.

Choose session and artifact services explicitly for deployment; local development state is not a production durability guarantee. Call business services from tools with trusted identity context. Workflow ordering does not remove the need to coordinate parallel writes. ADK can be deployed to different runtimes; selecting it does not require every application component to live in Google Cloud.
