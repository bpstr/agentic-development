# Claude Managed Agents

Official documentation: [Overview](https://platform.claude.com/docs/en/managed-agents/overview), [Quickstart](https://platform.claude.com/docs/en/managed-agents/quickstart), [Session events](https://platform.claude.com/docs/en/managed-agents/events-and-streaming).

Claude Managed Agents is Anthropic's managed harness for stateful, asynchronous agent work. Its concepts are agent configuration, execution environment, session, and events. It is distinct from direct Messages API inference and the Claude Code development client.

First create an agent and environment using the Console or the quickstart's `ant apply` workflow. Configure model instructions, permitted tools, and sandbox networking deliberately. The built-in `agent_toolset_20260401` enables command and file tools; MCP servers provide external capabilities.

Install `anthropic` and set `ANTHROPIC_API_KEY`, `CLAUDE_AGENT_ID`, and `CLAUDE_ENVIRONMENT_ID`. With those existing configurations, this Python script starts a session and streams a tool-assisted task:

```python
import os
from anthropic import Anthropic

client = Anthropic()
session = client.beta.sessions.create(
    agent=os.environ["CLAUDE_AGENT_ID"],
    environment_id=os.environ["CLAUDE_ENVIRONMENT_ID"],
    title="Document example",
)
with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(session.id, events=[{
        "type": "user.message",
        "content": [{"type": "text", "text":
                     "Create hello.txt containing Hello and verify it."}],
    }])
    for event in stream:
        print(event)
        if event.type == "session.status_idle":
            break
```

The current beta requires `managed-agents-2026-04-01`; the SDK adds the header for these APIs. Save session IDs and consume persisted event history to recover from client disconnection. A production consumer also handles error and interruption outcomes rather than only waiting for idle.

A self-hosted sandbox changes command execution location while the harness remains managed. Persist user deliverables and business receipts outside transient execution assumptions. Bound sessions, restrict credentials, and distinguish tool success from an agent's narrative. Review current data-retention and feature restrictions for the exact deployment; a persistent agent session has different storage behavior from a direct inference request.
