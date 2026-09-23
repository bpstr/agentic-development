# Muse Code

Official documentation: [Muse Code](https://dev.meta.ai/docs/muse-code), [configuration](https://dev.meta.ai/docs/muse-code/configuration), [permissions](https://dev.meta.ai/docs/muse-code/permissions), [interactive sessions](https://dev.meta.ai/docs/muse-code/interactive), [extensions](https://dev.meta.ai/docs/muse-code/extending), and [workflows](https://dev.meta.ai/docs/muse-code/workflows).

Muse Code is Meta's coding-agent harness for terminal use and headless automation. It connects model decisions to repository tools, approval policy, session state, and verification. It differs from both the [Muse personal desktop agent](../../../interfaces/desktop/apps/muse-desktop.md) and direct [Meta Model API inference](../../../infrastructure/inference/apis/meta-model-api.md).

## Setup and first task

Use the installer linked by the official documentation. On macOS or Linux, downloading and inspecting the installer before execution is preferable to blindly piping a remote script into a shell:

```bash
curl -fsSL https://dev.meta.ai/install.sh -o /tmp/muse-install.sh
less /tmp/muse-install.sh
sh /tmp/muse-install.sh
muse --version
```

Run from an existing repository and complete the documented login flow. Inspect repository instructions, hooks, and skills before granting project trust.

```bash
muse init --dry-run
muse --model muse-spark-1.3 --approval-judge off
```

`init --dry-run` previews initialization; do not overwrite an existing `AGENTS.md`. Meta's current API quickstart recommends Spark 1.3 while the Code documentation still describes a 1.2 default, so pin the chosen model explicitly rather than assuming they match. The [configuration guide](https://dev.meta.ai/docs/muse-code/configuration) describes `AGENTS.md` discovery, compatibility instruction locations, settings, and model selection.

A useful first prompt is: “Inspect this repository's test command and explain the change needed for this issue. Do not edit until the plan identifies acceptance checks.” After approving a bounded edit, inspect the diff and run the repository's real checks; a plausible explanation is not verification.

## Distinctive capabilities

**Continuity.** Sessions retain an event history; `/resume`, `/fork`, and `/compact` serve different purposes. `/rewind` changes conversation continuity, not repository file contents. `/goal` tracks a longer objective, while task and subagent views expose delegated work. See [interactive sessions](https://dev.meta.ai/docs/muse-code/interactive).

**Parallel work and background assistance.** Subagents can divide investigation or implementation. Children share the checkout unless worktree isolation is requested for that child. Background observers can contribute memory, skill, goal, or verification advice. Treat advice as evidence to inspect, not a successful test run. See [extensions](https://dev.meta.ai/docs/muse-code/extending).

**Reusable workflows.** The workflow surface supports staged and parallel work with final synthesis and inspection controls. Availability can depend on build or rollout; verify installed support before writing automation around it. Saved workflows are executable project content and deserve code review. See [workflow documentation](https://dev.meta.ai/docs/muse-code/workflows).

These features make Muse Code a candidate for sustained repository work and repeatable engineering procedures. They do not establish better task accuracy or lower total cost than another harness; compare identical fixtures, tools, budgets, and acceptance criteria.

## Permissions are not one switch

Approval policy and OS sandboxing are separate. The documented default includes automated approval review; it does not mean a person approves every operation. `--approval-judge off` requests human review where approvals are required. Project trust determines whether project-supplied instructions and extensions participate.

Keep the sandbox enabled, authorize only necessary network destinations, and avoid broad permission bypasses as a CI convenience. Child agents must not be assumed to have broader authority than their parent. The [permission guide](https://dev.meta.ai/docs/muse-code/permissions) is the source for platform-specific enforcement and policy details.

For untrusted repositories, begin with read-only inspection in an isolated checkout without production credentials. A repository instruction file is input to the agent, not permission to alter the surrounding host.

## Skills, hooks, MCP, and embedding

Project skills can live under `.agents/skills/<name>/SKILL.md`. Inspect discovery and validation before installation:

```bash
muse skills list
```

Hooks, MCP server configuration, and imported skills extend execution authority, not just vocabulary. Review project hooks, pin dependencies, and connect the smallest useful tool set. A required MCP connection failing should not silently produce an apparently successful run missing essential tools. Exact formats and discovery behavior are in [extensions](https://dev.meta.ai/docs/muse-code/extending).

For programmatic harness integration, Meta documents `muse serve`, `muse schema`, and the TypeScript package `@muse-code/sdk`. Follow the [SDK reference](https://meta-models.github.io/muse-code-sdk/) for the installed protocol version rather than inventing session methods. This is a coding-harness integration surface, not an API for the consumer Muse personal agent.

## Headless execution and recovery

Provision `META_API_KEY` through the CI secret store; note that Meta's direct inference examples instead name their environment variable `MODEL_API_KEY`. Configure noninteractive approvals and sandbox policy before running.

```bash
muse exec --json --model muse-spark-1.3 --max-model-steps 20 \
  "Implement the supplied issue in this checkout; run its acceptance tests and report failures."
```

Persist the returned session identity and protected logs when recovery is required. The [headless guide](https://dev.meta.ai/docs/muse-code/extending) documents continuation with `--session-id` and exporting sessions. Retention settings affect whether a later resume is possible. A zero exit code means the agent turn finished, not that the requested tests passed.

Event replay restores conversation/execution context; it does not prove that external side effects occurred exactly once. After interruption, compare the actual checkout and recorded tool outcomes before repeating operations. Cancellation is cooperative, and worktree isolation does not make external APIs transactional.

A practical acceptance fixture should interrupt a run before and after a tool effect, resume it, inspect duplicate work, and verify the final diff and test artifacts. Test shared-checkout and explicitly isolated children separately. Record CLI version, model ID, policy, extensions, and fixture revision so results are reproducible.
