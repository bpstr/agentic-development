# OpenAI Agents API

Official documentation: [overview](https://developers.openai.com/api/docs/guides/agents-api/overview), [quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart), [architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture), [session operations](https://developers.openai.com/api/docs/guides/agents-api/sessions).

The Agents API operates an OpenAI-managed Codex harness with sessions, orchestration, context handling, and recovery. It is separate from Responses inference, the Agents SDK running in your application, and the consumer [Codex Cloud product](../../../development/coding-agents/tools/codex.md). A Platform API session does not inherit that product's connected repositories, environment IDs, or subscription allowance.

A harness coordinates work; an environment supplies compute and files. Choose no environment, an OpenAI-hosted sandbox, or a self-hosted environment connected through an executor. Hosting the environment yourself does not move the managed harness onto your machine.

## Authentication and environment setup

Create a Platform project API key with the required `api.agents.read`, `api.agents.write`, and `api.responses.write` permissions. Keep `OPENAI_API_KEY` in the calling backend. Current raw HTTP requests require `OpenAI-Beta: agents=v1`; this is a beta integration, so pin and test the SDK version used by your application. [Quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart)

The following example requires Bash, Python 3, curl, and jq on the caller. Export `OPENAI_API_KEY` and a full, existing commit SHA as `REPO_SHA`. It checks out the public `bpstr/agentic-development` repository without a GitHub credential. It creates paid provider work when executed; syntax validation alone does not test the integration.

```bash
set -euo pipefail
umask 077
: "${OPENAI_API_KEY:?Set a Platform project API key}"
: "${REPO_SHA:?Set the full commit SHA to inspect}"
export REPO_SHA
RUN_DIR=$(mktemp -d)
export RUN_DIR
printf 'Local run records: %s\n' "$RUN_DIR"

python3 - <<'PY'
import json
import os
import re
from pathlib import Path

sha = os.environ["REPO_SHA"]
if not re.fullmatch(r"[0-9a-fA-F]{40}", sha):
    raise SystemExit("REPO_SHA must be a full 40-character Git commit SHA")

setup = (
    "git init /workspace/repo && cd /workspace/repo && "
    "git remote add origin https://github.com/bpstr/agentic-development.git && "
    f"git fetch --depth 1 origin {sha} && "
    "git checkout --detach FETCH_HEAD && mkdir -p /workspace/outputs"
)
request = {
    "agent": {
        "model": "gpt-6-astra",
        "instructions": (
            "Audit repository documentation. Read and respect AGENTS.md. "
            "Do not edit repository files, publish changes, or perform web research."
        ),
    },
    "environment": {
        "type": "openai_hosted",
        "network": {
            "access": "restricted",
            "allowed_domains": ["github.com"],
        },
        "setup_commands": [{"command": setup}],
    },
    "input": (
        "Inspect /workspace/repo for cloud coding and managed-agent coverage. "
        "Write /workspace/outputs/cloud-audit.md with the inspected SHA, "
        "exact file references, and proposed gaps. Do not claim unrun checks passed."
    ),
    "stream": False,
}
Path(os.environ["RUN_DIR"], "request.json").write_text(
    json.dumps(request), encoding="utf-8"
)
PY

curl --fail-with-body \
  https://api.openai.com/v1/agents/sessions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Content-Type: application/json" \
  --data-binary @"$RUN_DIR/request.json" \
  --output "$RUN_DIR/session.json"

SESSION_ID=$(jq -er '.id' "$RUN_DIR/session.json")
export SESSION_ID
printf '%s\n' "$SESSION_ID" > "$RUN_DIR/session-id.txt"
printf 'Created session: %s\n' "$SESSION_ID"
```

The SHA validation makes interpolation into the setup shell command bounded; do not substitute arbitrary webhook text into commands. A failed setup command prevents the agent from starting. Add locked dependencies and isolated test services for an application repository rather than assuming the default image matches your workstation. [Hosted sandbox configuration](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)

The example uses an explicit network policy: API-hosted sandboxes otherwise default to enabled networking, unlike Codex Cloud's agent-phase default. Restricted hosts are exact hostnames; redirects, subdomains, registries, and private services may require separate entries. Allowing a host is not authorization to perform every action on it.

For private repositories, configure scoped credentials through the documented [vault integration](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults), or use a trusted backend to prepare and upload an authorized source snapshot. Do not put tokens into clone URLs, prompts, or setup commands. Ordinary `environment.env` values are agent-readable, not a secret store. A reusable environment template supplies configuration; each session still has its own workspace.

## Inspect, continue, and cancel a session

Creation returns a session, not a verified result. Preserve its identity before further operations. These reads inspect the existing run without submitting it again:

```bash
: "${SESSION_ID:?Restore the saved session ID}"
curl --fail-with-body \
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: agents=v1"

curl --fail-with-body \
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID/items?order=asc&limit=100" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: agents=v1"
```

Paginate items when necessary. Inspect turn outcomes and `required_actions`, not just the presence of assistant text. A function call can require your backend to execute an authorized operation and return its result; connecting an execution environment can also require application action. Remote MCP and application function tools have different execution responsibilities. [Manage sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage)

A follow-up uses the same session's events endpoint. When idle it starts another turn; during execution it can steer ongoing work. Submit deliberately rather than retrying blindly after an ambiguous timeout:

```bash
curl --fail-with-body \
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID/events" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Content-Type: application/json" \
  --data-binary @- <<'JSON'
{
  "events": [{
    "type": "agent.session.input.message",
    "input": [{
      "role": "user",
      "content": [{
        "type": "input_text",
        "text": "Revise the audit to distinguish missing concepts from missing examples. Keep the repository unchanged."
      }]
    }]
  }]
}
JSON
```

To request cancellation of an active turn, use this separate operation; do not automatically run it after every submission:

```bash
curl --fail-with-body \
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID/events" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Content-Type: application/json" \
  --data '{"events":[{"type":"agent.session.input.cancel"}]}'
```

Cancellation leaves the session and prior work available; it does not undo an external mutation. [Run control](https://developers.openai.com/api/docs/guides/agents-api/sessions)

For live UI output, create with `stream: true` and consume the documented SSE/SDK events instead of parsing creation as one JSON object. `agent.session.turn.output_text.done` completes a text part; turn outcomes use `agent.session.turn.completed`, `agent.session.turn.failed`, or `agent.session.turn.cancelled`. Correlate root and subagent events with their session, turn, and item identities. Streams do not replay missed events: recover through session state and saved items after disconnection. [Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events)

## Retrieve the deliverable

Hosted output under `/workspace/outputs` is published as an immutable artifact when a turn completes. Install the current `openai` Python SDK, then select an artifact by the saved session ID, **completed turn ID**, and exact path. Do not select an arbitrary first artifact or let an agent-supplied filename choose a local filesystem destination.

```bash
python -m pip install openai
```

```python
import os
from pathlib import Path
from openai import OpenAI

session_id = os.environ["SESSION_ID"]
turn_id = os.environ["COMPLETED_TURN_ID"]
expected = "/workspace/outputs/cloud-audit.md"
destination = Path("cloud-audit.md")
if destination.exists():
    raise SystemExit("Refusing to overwrite an existing local audit")

with OpenAI() as client:
    matches = [
        item for item in client.beta.agents.sessions.artifacts.list(session_id)
        if item.turn_id == turn_id and item.path == expected
    ]
    if len(matches) != 1:
        raise SystemExit(f"Expected one matching artifact, received {len(matches)}")
    with client.beta.agents.sessions.artifacts.with_streaming_response.content(
        matches[0].id, session_id=session_id
    ) as response:
        response.stream_to_file(destination)
print(destination)
```

Published artifacts survive sandbox expiration, but retain your own copy before deleting the session. Self-hosted environment files are retrieved through your infrastructure, not this artifact publication mechanism. A report is still a claim to review; a code-producing workflow additionally needs a patch, independent checks, and separately authorized publication. [Files and artifacts](https://developers.openai.com/api/docs/guides/agents-api/environments/files)

## Costs and production boundaries

Developer API billing is separate from ChatGPT subscriptions: model usage, tools, and applicable execution charges matter. On September 21, 2026, standard short-context `gpt-6-astra` pricing is $10 per million input tokens, $1 cached input, and $50 output; other context, cache-write, or speed tiers differ. A hypothetical run totaling 200,000 uncached input and 20,000 output tokens across all requests costs $3 for those tokens, before execution and tools. This is arithmetic, not a task benchmark. [API pricing](https://developers.openai.com/api/docs/pricing)

The API overview points to standard container billing. The rate card lists, for example, $0.03 for 1 GB or $0.12 for 4 GB per 20-minute container session, with eligible per-minute billing and a five-minute minimum. Verify the applicable environment configuration rather than quoting a universal price per run. [Billing boundary](https://developers.openai.com/api/docs/guides/agents-api/overview)

Bound concurrency, wall time, attempts, and authorized spending in your application; do not invent a provider budget field or assume cancellation prevents all in-flight charges. Keep secrets and production systems outside the sandbox, record denied checks honestly, export outputs, and review current retention/residency restrictions. Test the [cloud failure scenarios](../../../development/coding-agents/cloud-coding-agents.md#failure-scenarios-to-exercise) before allowing unattended writes.
