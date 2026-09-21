# Claude Managed Agents

Official documentation: [overview](https://platform.claude.com/docs/en/managed-agents/overview), [quickstart](https://platform.claude.com/docs/en/managed-agents/quickstart), [sessions](https://platform.claude.com/docs/en/managed-agents/sessions), [GitHub integration](https://platform.claude.com/docs/en/managed-agents/github).

Claude Managed Agents is Anthropic's hosted harness for stateful, asynchronous work. An agent supplies behavior and tools, an environment supplies execution configuration, and a session records an instance of work. It is distinct from Messages inference, the [Claude Code cloud product and routines](../../../development/coding-agents/tools/claude-code.md), and an Agent SDK process that you host yourself.

A self-hosted sandbox changes where commands execute while the harness remains managed. Neither that choice nor a consumer subscription automatically establishes the developer API's repository permissions, billing, or data-retention contract.

## Create the agent and environment

Configure a Claude Platform API key as `ANTHROPIC_API_KEY`. The managed endpoints use the `managed-agents-2026-04-01` beta; their SDK methods add the header. Pin the SDK/CLI versions used in production and test schema changes before upgrading. These examples create provider resources and paid work when executed, not offline agents.

Install the CLI and SDK. Create the sample configuration files in a scratch directory, not inside the repository being audited:

```bash
brew install anthropics/tap/ant
python -m pip install anthropic
```

Save `audit-agent.md` with this frontmatter and instruction body:

```markdown
---
name: Repository audit
model: claude-opus-5
tools:
  - type: agent_toolset_20260401
    default_config:
      enabled: false
    configs:
      - name: bash
        enabled: true
      - name: read
        enabled: true
      - name: write
        enabled: true
---
Read the supplied repository and its instructions.
Report documentation gaps with exact file references.
Do not edit repository files, perform web research, push, open PRs, or merge.
Write the requested report outside the repository.
```

Only the named tools are enabled. This is not an enforced read-only filesystem: Bash can write even without a dedicated write tool. Apply [permission policies](https://platform.claude.com/docs/en/managed-agents/permission-policies) and execution boundaries for stricter tasks. Hosted web search/fetch are not constrained by sandbox networking; disabling them here closes a different boundary from the network allowlist. [Tool configuration](https://platform.claude.com/docs/en/managed-agents/tools)

Save `audit-environment.yaml`:

```yaml
name: repository-audit
config:
  type: cloud
  networking:
    type: limited
    allowed_hosts:
      - github.com
    allow_mcp_servers: false
    allow_package_managers: false
```

This example needs no application packages. For an application, configure its locked dependencies and test services deliberately. Limited networking with package installation requires the corresponding package-manager setting; do not make networking unrestricted merely to hide setup errors. Reusing an environment creates separate per-session sandboxes, not a shared working directory. [Environments](https://platform.claude.com/docs/en/managed-agents/environments)

Apply the configurations and save the resulting IDs as `CLAUDE_AGENT_ID` and `CLAUDE_ENVIRONMENT_ID`:

```bash
: "${ANTHROPIC_API_KEY:?Set a Claude Platform API key}"
ant apply audit-agent.md
ant apply audit-environment.yaml
```

The `ant apply` workflow keeps local resource mappings in `claude-lock.json`; preserve them with your integration configuration outside the audited repository. [Configuration workflow](https://platform.claude.com/docs/en/managed-agents/quickstart)

## Mount a repository and start a bounded run

Export `GITHUB_READ_TOKEN` with read access to the selected repository and `REPO_SHA` as the full existing commit to inspect. The repository resource requires an authorization token and a URL without a `.git` suffix. Use a narrowly scoped GitHub App installation token or fine-grained token; the API key does not supply GitHub authorization. [Repository resources](https://platform.claude.com/docs/en/managed-agents/github)

```python
import os
import re
import tempfile
from pathlib import Path
from anthropic import Anthropic

required = (
    "ANTHROPIC_API_KEY", "CLAUDE_AGENT_ID", "CLAUDE_ENVIRONMENT_ID",
    "GITHUB_READ_TOKEN", "REPO_SHA",
)
missing = [name for name in required if not os.environ.get(name)]
if missing:
    raise SystemExit(f"Missing variables: {', '.join(missing)}")
if not re.fullmatch(r"[0-9a-fA-F]{40}", os.environ["REPO_SHA"]):
    raise SystemExit("REPO_SHA must be a full 40-character commit SHA")

client = Anthropic(max_retries=0)
session = client.beta.sessions.create(
    agent=os.environ["CLAUDE_AGENT_ID"],
    environment_id=os.environ["CLAUDE_ENVIRONMENT_ID"],
    title="Cloud documentation audit",
    resources=[{
        "type": "github_repository",
        "url": "https://github.com/bpstr/agentic-development",
        "mount_path": "/workspace/repo",
        "authorization_token": os.environ["GITHUB_READ_TOKEN"],
        "checkout": {"type": "commit", "sha": os.environ["REPO_SHA"]},
    }],
    budget={
        "type": "limit",
        "max_list_cost": {"amount": "500", "currency": "USD"},
    },
)
run_dir = Path(tempfile.mkdtemp(prefix="claude-audit-"))
(run_dir / "session-id.txt").write_text(session.id + "\n", encoding="utf-8")
print(f"Session {session.id}; recovery record: {run_dir}", flush=True)

interrupted = False
observed_idle = False
with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(session.id, events=[{
        "type": "user.message",
        "content": [{"type": "text", "text": (
            "Audit /workspace/repo for cloud coding and managed-agent coverage. "
            "Read AGENTS.md. Write /mnt/session/outputs/cloud-audit.md with the "
            "inspected SHA, file references, and proposed gaps. "
            "Do not edit repository files or perform external research."
        )}],
    }])
    for event in stream:
        print(event, flush=True)
        if event.type == "user.interrupt":
            interrupted = True
        if event.type == "session.status_idle":
            observed_idle = True
            reason = event.stop_reason.type if event.stop_reason else "unknown"
            if reason != "end_turn" or interrupted:
                raise SystemExit(f"Run needs inspection: {reason}; interrupted={interrupted}")
            break
if not observed_idle:
    raise SystemExit("Stream ended without idle; recover the saved session")
print("Turn ended. Retrieve and verify the report before accepting the result.")
```

Persist the session ID in your application database before submitting work. The snippet disables SDK retries so an ambiguous create/send failure is not blindly repeated. Recover the existing session and event history before retrying a mutation; HTTP acceptance is not task completion. [Python SDK](https://github.com/anthropics/anthropic-sdk-python), [session operations](https://platform.claude.com/docs/en/managed-agents/session-operations)

## Pauses, approvals, and interruption

At session-level idle, inspect `stop_reason.type`. `requires_action` needs a custom-tool result or tool confirmation; `budget_reached` is a spending pause. `end_turn` is also used after interruption, so track interrupt events and verify outputs rather than using it as a universal success flag. A disconnected client must resume observation, not submit the task again. [Event stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming)

For a pending confirmation, resolve its tool-use event ID, validate the user/session/action, and send `user.tool_confirmation` with `tool_use_id` and `result: "allow"` or `"deny"`. Never approve every pending call automatically. The tool-policy decision and the task's business authorization are separate checks. [Permission policies](https://platform.claude.com/docs/en/managed-agents/permission-policies)

A deliberate interrupt uses an existing session ID:

```python
import os
from anthropic import Anthropic

client = Anthropic(max_retries=0)
client.beta.sessions.events.send(
    os.environ["CLAUDE_SESSION_ID"],
    events=[{"type": "user.interrupt"}],
)
```

An interrupt is not rollback or proof that every in-flight effect stopped. To continue an ordinary idle session, send a new `user.message` on the same session. Budget exhaustion follows different rules: changing its budget can resume paused work automatically, so increasing a limit is itself a spending authorization. [Run control](https://platform.claude.com/docs/en/managed-agents/events-and-streaming)

## Download the report

Claude's managed output directory is `/mnt/session/outputs/`, not OpenAI's `/workspace/outputs`. Files can appear shortly after idle; use bounded polling in production. Filtering Files API results by session requires the explicit managed-agents beta header even though session SDK methods add it automatically. [Session files](https://platform.claude.com/docs/en/managed-agents/files)

Restore the saved ID as `CLAUDE_SESSION_ID`. This example refuses ambiguous matches and writes to a fixed local destination:

```python
import os
from pathlib import Path
from anthropic import Anthropic

client = Anthropic()
files = client.beta.files.list(
    scope_id=os.environ["CLAUDE_SESSION_ID"],
    betas=["managed-agents-2026-04-01"],
)
matches = [file for file in files if file.filename == "cloud-audit.md"]
if len(matches) != 1:
    raise SystemExit("Expected one report; inspect the file list or retry its listing")
destination = Path("cloud-audit.md")
if destination.exists():
    raise SystemExit("Refusing to overwrite a local report")
client.files.download(matches[0].id).write_to_file(destination)
print(destination)
```

For repeated revisions, use unique output names and record the selected file ID. Export deliverables before relying on sandbox persistence: session history and sandbox state have different lifetimes. The current sandbox checkpoint window is 30 days from creation, not a sliding window extended by activity. [Session persistence](https://platform.claude.com/docs/en/managed-agents/events-and-streaming)

## Budgets and billing

The creation example's `"500"` is a whole-number string in **US cents**, so the limit is $5, not $500. Set a budget at creation; it cannot be attached later to an unbudgeted session. Enforcement stops new model requests rather than cutting an admitted request short, allowing an in-flight overshoot per thread. Use the session-level usage and stop reason, including when other threads await approval. Do not automatically remove or increase limits. [Budget semantics](https://platform.claude.com/docs/en/managed-agents/budgets)

On September 21, 2026, Managed Agents bills model tokens plus $0.08 per active session-hour, excluding idle time. This replaces rather than adds a separate code-execution container-hour charge. Standard `claude-opus-5` rates are $5 per million input tokens, $0.50 cached input, and $25 output, with separate cache-write and other modifiers. An illustrative 200,000 uncached input tokens, 20,000 output tokens, and 30 active minutes total $1.54 before additional tools/modifiers. These are accumulated run tokens, not just the original prompt, and this is not a measured task price. [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

Repository mounting is not permission to publish. Use read-scoped checkout credentials and a separately controlled publisher for branches/PRs. Plan token renewal for long runs, keep API keys out of sandbox environment variables, preserve evidence outside transient sandboxes, and apply the [cloud lifecycle and failure tests](../../../development/coding-agents/cloud-coding-agents.md).
