# CrewAI

Official documentation: [Quickstart](https://docs.crewai.com/en/quickstart), [Agents](https://docs.crewai.com/en/concepts/agents), [Tools](https://docs.crewai.com/en/concepts/tools). Source: [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI).

CrewAI organizes role-based agents and tasks into crews, while Flows provide explicit application state and execution order. Use a crew for bounded agent collaboration and a Flow for the surrounding process and lifecycle.

Install `crewai` in an isolated Python environment. Set the chosen provider's API key and `CREWAI_MODEL` to its supported model identifier. A one-agent crew demonstrates the tool/task/run lifecycle without requiring a search subscription:

```python
import os
from crewai import Agent, Crew, Process, Task
from crewai.tools import tool

@tool("document_status")
def document_status(document_id: str) -> str:
    """Read the publication state of a sample document."""
    return {"doc-17": "approved"}.get(document_id, "unknown")

reader = Agent(
    role="Document status reader",
    goal="Report verified document states",
    backstory="You consult the supplied registry tool.",
    llm=os.environ["CREWAI_MODEL"],
    tools=[document_status],
    allow_delegation=False,
)
task = Task(
    description="Use document_status to inspect doc-17.",
    expected_output="The document identifier and its retrieved state.",
    agent=reader,
)
crew = Crew(agents=[reader], tasks=[task], process=Process.sequential)
print(crew.kickoff().raw)
```

Run the saved file with Python. For a project with explicit steps, the current quickstart uses `crewai create flow`, followed by `crewai install` and `crewai run` in the generated project.

Use narrow tools and disable delegation where it is unnecessary. Define completion using retrieved records or artifacts, not only the generated task summary. A task can produce prose that describes a failed operation, so expose structured tool failures and choose the appropriate failure policy. Configure persistence and operational recovery explicitly for production Flows.
