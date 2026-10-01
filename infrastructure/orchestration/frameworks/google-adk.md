# Google Agent Development Kit

Official documentation: [ADK](https://adk.dev/), [Python quickstart](https://adk.dev/get-started/python/). Source and releases: [google/adk-python](https://github.com/google/adk-python), [releases](https://github.com/google/adk-python/releases).

Google Agent Development Kit (ADK) 2.0 is a code-first framework for agents, tools, workflows, sessions, callbacks, evaluation, and deployment. Its current workflow runtime is graph-based and supports routing, fan-out/fan-in, loops, retry, state management, dynamic nodes, human-in-the-loop, and nested workflows. ADK is distinct from Gemini inference and Google's managed agent hosting, and the framework itself is model- and deployment-agnostic.

Install the current stable package and create a project with its CLI:

```bash
python -m pip install google-adk
adk create document_agent
```

ADK currently requires Python 3.10 or newer. For production installs, consider Google's published constraints files so transitive dependency changes do not silently alter a deployment.

A minimal agent can use the current top-level import surface:

```python
import os
from google.adk import Agent

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

From the directory containing the package, run `adk run document_agent`; `adk web` provides a local development interface. The exported `root_agent` remains the conventional package entry point.

For deterministic orchestration, ADK 2.0 also exposes `Workflow` as a graph abstraction rather than requiring a model to choose every transition. That makes routing, parallel branches, retries, and nested flows explicit application structure. The framework also documents a Task API for structured agent-to-agent delegation and tool-confirmation flows for human approval.

Choose session and artifact services explicitly for deployment; local development state is not a production durability guarantee. Call business services from tools with trusted identity context. Workflow ordering does not remove the need to coordinate parallel writes, and model failover does not make different providers behaviorally identical. ADK can deploy to multiple runtimes, so selecting it does not require every application component to live in Google Cloud.

## Current release boundaries

ADK 2.10 adds experimental skill lifecycle management, including ephemeral one-turn skills, explicit unloading, and active-skill limits. These controls are off by default and currently require `ADK_ENABLE_SKILL_LIFECYCLE=1`. Treat them as experimental resource-management behavior rather than a stable authorization mechanism. The same release adds evaluation efficiency metrics for duration, token usage, and model-call counts so correctness can be evaluated alongside operational cost.

A breaking change introduced in ADK 2.9 is especially important for durable workflows: a workflow node that failed now runs again when execution resumes. A node that performs an external side effect and then fails can therefore repeat that effect. Make node bodies idempotent or place consequential effects behind their own idempotency boundary and operation receipt.

ADK 2.9 also added support for MCP SDK 2.x alongside 1.x, while default installs continued to resolve 1.x at that release. If opting into MCP 2.x, validate server extensions and metadata because undeclared fields can be discarded by the newer SDK's closed models; use declared `_meta` for extension data.
