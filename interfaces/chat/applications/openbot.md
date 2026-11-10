# OpenBot

[Product](https://open.bot/) · [Repository](https://github.com/CopilotKit/OpenBot) · [Documentation](https://github.com/CopilotKit/OpenBot/tree/main/docs) · [Architecture](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/architecture.md)

OpenBot is CopilotKit's self-hostable [chat application](../chat-interfaces.md) for AI coworkers: persistent Bot profiles with roles, conversations, tools, and access to a browser and files. It can run built-in Bots or connect external [AG-UI agents](../../../infrastructure/protocols/agent-ui/ag-ui.md). It is useful when a team needs a configurable coworker workspace, or wants to study how conversation UI, delegated authority, tool execution, and computer control fit together.

The implementation details below refer to [revision `658b8aa`](https://github.com/CopilotKit/OpenBot/tree/658b8aa8aaf094c8e804a42ce04bea5092bbc38e), whose package declares version 1.0.0. This is a documentation and source review; the application and integrations have not been run here.

## Application and runtime ownership

The [architecture guide](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/architecture.md) separates several responsibilities:

| Component | Responsibility |
| --- | --- |
| React/Vite frontend | Conversations, Bot roster, live computer view, interactive components, and approval controls. |
| Hono/Bun backend and PostgreSQL | Workspace records, identity, Bot profiles, memberships, grants, action policies, credentials, and audit events. |
| CopilotKit Intelligence | Durable threads and runtime services, with separately configured memory and Automatic Learning capabilities. |
| Built-in or external agent | Model calls and agent behavior, connected to the workspace through AG-UI. |
| Computer service and optional supervisor | Chromium, files, shell operations, and computer lifecycle. |

A durable Bot profile is separate from its runtime endpoint and a person's roster preferences. A standing role is sent with each run, but it grants no tool permissions. Channels have their own membership and thread mapping. Hiding a Bot is personal presentation state; deleting one disables it while leaving existing channels readable as tombstones. These distinctions are documented in [Coworkers](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/coworkers.md).

AG-UI provides an interaction contract. It does not make an external agent's private tools subject to OpenBot's gateway. Keep the external runtime's credentials, authorization, cancellation, and recovery responsibilities explicit.

## Licensing and deployment choice

The application template uses the [MIT license](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/LICENSE). CopilotKit Intelligence is a required, separately licensed runtime dependency in the documented stack. The [upstream README](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/README.md#open-source-local-operation-and-licensing) distinguishes a free local license for personal experimentation, a trial license for Kubernetes evaluation, and a production Intelligence license beyond evaluation. Self-hosting the application does not remove that dependency or its terms.

The [local Intelligence evaluation guide](https://docs.copilotkit.ai/intelligence/self-hosting-local) supports macOS with Docker Desktop. It explicitly rejects Colima, OrbStack, and Rancher Desktop on macOS; Linux with rootful Docker is accepted by the CLI but remains outside the supported preview. Its preflight requires at least 4 CPUs, 12 GiB RAM, and 40 GiB free storage per Intelligence stack after other containers. This is additional infrastructure, not the OpenBot image's own size. Installation and license renewal need internet access, and the preview is not a production deployment.

Choose a managed Intelligence project, local evaluation, or a production self-hosted deployment deliberately. The single OpenBot image's documented resource figures do not size the full local Intelligence stack.

## Run the source application

The [source quick start](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/README.md#run-from-source) requires Bun 1.4+, Docker, a CopilotKit Intelligence project, and model access. The shown setup also uses `npx` and an installed Chrome or Edge for browser sign-in. The documented fresh-clone path uses managed Intelligence:

```bash
git clone https://github.com/CopilotKit/OpenBot.git
cd OpenBot
git checkout 658b8aa8aaf094c8e804a42ce04bea5092bbc38e
cp .env.example .env
bun install

npx --yes copilotkit@latest login
npx --yes copilotkit@latest project select
bun scripts/setup-learning.ts
```

The helper provisions the selected project's runtime key and Learning container and writes configuration to `.env`. Supply `OPENAI_API_KEY` for the documented sample. Keep secrets outside source control. The CLI commands above follow upstream setup; resolve compatible versions before maintaining a deployment.

```bash
bash scripts/start.sh
```

Open `http://localhost:3010`; the API runs on port 3001. The start script launches supporting services, migrations, the routines worker, and the frontend. `bash scripts/stop.sh` stops them while preserving persistent data. The sample's `OPENBOT_SINGLE_USER=true` treats reachable requests as one administrator: keep evaluation private and configure authentication before team access.

For local Intelligence, follow its dedicated setup guide and connect its API, gateway, and runtime key instead of retaining the managed URLs. An OpenAI-compatible model endpoint is a provider option; it does not replace Intelligence.

## Connect a coworker and complete a run

An external agent must implement AG-UI and be reachable from the OpenBot server. The [documented package declaration](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/coworkers.md#register-an-external-ag-ui-agent) is:

```yaml
agents:
  - id: risk
    name: Risk
    title: Risk & Compliance
    role_description: Investigate policies and controls.
    type: remote-ag-ui
    endpoint: http://risk.internal/ag-ui
```

The endpoint is illustrative and must be replaced with a real service. The product's `/bots` setup supports an endpoint and optional authorization header; `POST /api/agents/test-connection` tests connectivity. A successful connection does not establish that tools, permissions, or recovery work.

A useful first lifecycle is:

1. Create a Bot with a narrow standing role and explicit visibility.
2. Grant only the required MCP tools, computer access, and components.
3. Start a channel and request a bounded read or a disposable test-file operation.
4. Inspect the result, the affected resource, and the server audit record.
5. Revoke a grant or add a deny rule, repeat the operation, and verify refusal before the effect.
6. Reload the client and verify persisted conversation and approval state independently of transient UI activity.

Calls routed through the computer gateway resolve the target, evaluate policy, record the decision, and forward permitted operations. The live Activity pane is transient; the server audit trail is the durable record.

## Approval and isolation boundaries

The [approval guide](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/approvals.md) distinguishes one-time, conversation-scoped, and persistent grants. Administrators can require repeated approval or human execution for specified action kinds. The mechanism recognizes actions using tool names, browser labels, and destructive annotations; it documents blind spots such as unlabeled controls or a tool that deletes by modifying labels. A remote Bot's own tools bypass this approval policy.

The computer action policy is separate from the approval interface. In enforcement mode, missing policy and broken deny rules fail closed, but the shipped startup policy explicitly allows all actions unless replaced. Dry-run records boundary-rule refusals without blocking those actions; enterprise capability controls remain enforced. Inspect the [policy implementation](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/server/src/computer/policy.ts) and deployed configuration before treating a refusal rule as enforced.

Computer isolation also depends on deployment. With the supervisor, the documented default is a container per person, with a folder and browser profile per Bot; an **Isolated** Bot gets a separate container. Without the supervisor, Bots share the configured computer. Distinct profiles are not a tenant isolation boundary. The outbound filter proxy does not stop a process that ignores proxy settings and uses raw sockets; network-layer enforcement is a separate control.

## Routines and deployment completeness

[Routines](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/routines.md) carry a standing instruction, schedule, owner, and destination channel. They run with their owner's grants. Audit records distinguish whose authority a run carries from whether a person, routine, or handoff initiated it.

A separate worker or scheduled sweep dispatches due routines. The [single-container deployment](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/deployment.md) excludes that worker, the supervisor, and the staged-attachment cleanup schedule. The Helm chart installs the documented scheduled jobs; the source start script starts the routines worker. A one-container deployment needs explicit scheduling for routines and attachment cleanup. A visible next-run time is not execution evidence.

Monitor worker check-ins and completion separately. The documented routine behavior skips sufficiently stale occurrences and can disable repeatedly failing routines; it does not replay every missed occurrence after downtime. Applications that require catch-up or guaranteed business processing need their own execution contract.

## Patterns to reuse and verify

For an existing agent application, the most useful references are the boundaries between roles and grants, runtime agents and durable profiles, transient activity and audit, and a schedule record and an operating worker. OpenBot's [tool discovery implementation](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/server/src/agents/tool-search.ts) narrows the tools sent to the model while preserving separate authorization. This is a concrete context-efficiency pattern rather than a reason to grant more tools.

[Automatic Learning](https://github.com/CopilotKit/OpenBot/blob/658b8aa8aaf094c8e804a42ce04bea5092bbc38e/docs/automatic-learning.md) collects eligible conversations or recordings, proposes skills, and delivers published guidance. Treat that as a separate evidence, review, and release lifecycle; it is not proof of model training, retrieval quality, or correct reuse. Team review and personal automatic-approval defaults differ.

Before adopting the workspace, verify cross-user isolation, revoked grants during a pending action, remote-agent tool ownership, worker outages, reconnect behavior, and recovery of PostgreSQL, Intelligence state, and computer volumes. Model, connector, learning, browser, and runtime costs belong in the same deployment assessment. The application is a useful reference even when a product only adopts selected patterns or exposes an optional AG-UI integration.
