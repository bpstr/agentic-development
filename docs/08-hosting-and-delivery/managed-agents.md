# Managed agents and execution environments

Source-reviewed: 2026-09-19. Hosted services were not provisioned or runtime-tested.

A **managed agent runtime** owns more of the execution loop than a model completion endpoint. It can keep sessions, coordinate model and tool turns, expose progress events, and resume work. A **sandbox** is the environment in which code or commands execute. The runtime and the sandbox are separate responsibilities, even when one provider supplies both.

## OpenAI Platform

The [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) exposes a managed Codex harness with durable sessions, context compaction, and recovery through a currently documented beta API surface. Applications configure agents and send work, then consume events or webhooks. This differs from using the Agents SDK in an application process or implementing a direct Responses API loop.

The [architecture documentation](https://developers.openai.com/api/docs/guides/agents-api/architecture) distinguishes the harness, the environment, and the application server. An agent can run without an execution environment when it only needs appropriate tools. Function tools are handled by application code; remote MCP tools can be called by the harness. A self-hosted environment changes where commands execute, while the harness remains managed.

For file and command work, read [OpenAI-hosted sandbox configuration](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted). Decide which packages, network destinations, files, and credentials the workload needs. A sandbox filesystem should not silently become the sole store for a user's published deliverable.

## Anthropic Platform

[Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) is documented as a beta managed harness for longer tasks and asynchronous work. It separates agent configuration, environment, session, and events, with managed or self-hosted sandbox options. The Messages API remains the direct model-access surface for applications that implement their own loop.

Do not infer feature parity from similarly named concepts. Compare session lifetime, event replay, supported tools, interrupt behavior, execution location, billing, and deployment restrictions in each service's own reference.

## What the application still owns

| Concern | An application responsibility |
| --- | --- |
| Identity | Bind each run to the authenticated user and workspace |
| Authorization | Check current permissions at the tool or business-service boundary |
| Product state | Store domain records, task status, ownership, and user-visible results |
| Action semantics | Define what success means and prevent unintended duplicate writes |
| User experience | Show progress, requests for input, cancellation, and terminal errors |
| Accountability | Relate provider sessions and tool calls to application trace and action IDs |

A hosted session is useful execution state. It does not replace the application's authoritative records. A user-facing task can outlive a session, and one session can perform several operations on that task.

## Decide with a small workload

For a document research task, compare: creating the session, loading sources, invoking one tool, receiving progress, disconnecting the client, retrieving the final artifact, and handling an interrupted run. This exercise exposes more relevant differences than comparing the first generated sentence.

At this review date, the [OpenAI Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview) states US-only data residency and no Zero Data Retention support, including when using a self-hosted sandbox. Review the selected service's current retention, region, access, and sandbox limits before deployment. Self-hosted execution does not by itself mean that model inputs and session data stay local.

See [execution and state](../05-orchestration/execution/agent-loops.md), [framework choices](../05-orchestration/frameworks/README.md), and the [background work recipe](../11-recipes/background-work.md).
