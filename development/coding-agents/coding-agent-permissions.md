# Coding-agent permissions

Coding-agent permissions define which resources and actions an agent host permits: reading files, writing within a workspace, running processes, accessing the network, using credentials, and changing external systems. They are enforced by the execution environment and connected services, rather than by the model's intention.

Separate three questions:

- **Capability:** is a shell, browser, or integration available?
- **Authority:** may this task use it for this action and resource?
- **Isolation:** what technical boundary prevents access elsewhere?

An instruction saying "only edit this repository" is useful guidance. A filesystem boundary makes that restriction enforceable. A Git worktree isolates tracked changes but does not isolate shared databases, network services, or credentials.

## Match permissions to the task

For source analysis, provide reading and narrowly scoped execution for relevant checks. A repair task also needs writes. Publishing, production migrations, messages, and purchases require authority beyond editing local code; grant it through a clear user request or controlled workflow.

For example, permission to fix invoice deduplication does not inherently authorize replaying production payments. A local fixture using synthetic events can establish behavior without touching live accounts.

Record denied operations accurately. An unavailable dependency or blocked command is a verification limitation, not a passing check. Avoid making a permission failure disappear by silently choosing an unrestricted execution mode.

Host-specific controls are documented in [Claude Code permissions](https://code.claude.com/docs/en/permissions) and [Codex non-interactive execution](https://learn.chatgpt.com/docs/non-interactive-mode). Their labels should not be assumed to mean identical isolation guarantees.

## A cloud permission policy

The following is a recommended starting policy, not a claim about every provider's defaults:

| Boundary | Analysis job | Repair job | Publishing service |
| --- | --- | --- | --- |
| Repository access | Selected repository, read | Selected repository, read | Selected repository, scoped write |
| Workspace | Read source; scratch space for reports | Isolated writable checkout | Validate and apply accepted patch |
| Network | Required source/test hosts only | Required dependency/test hosts only | Required GitHub API endpoints |
| Credentials | No production secrets | Synthetic test credentials | Short-lived repository credential outside agent shell |
| Remote changes | None | Return patch rather than push | Task branch and PR under explicit policy |
| Merge/deploy | None | None | Separate authorization and protected workflow |

An unrestricted shell can modify files even when a dedicated edit tool is disabled. Read-only source inspection therefore needs an actual filesystem boundary or no general shell. Likewise, allowing `github.com` is host reachability, not permission to access only one repository or to use only safe HTTP methods.

Sandbox egress rules do not necessarily constrain provider-hosted search, fetch, or MCP calls. Configure these separately. Claude Managed Agents explicitly runs web search/fetch outside sandbox networking; Codex Cloud separately configures setup and agent-phase networking. [Claude networking](https://platform.claude.com/docs/en/managed-agents/environments), [Codex internet access](https://learn.chatgpt.com/docs/cloud/internet-access)

## GitHub authorization and publication

For an application, prefer a GitHub App installation limited to selected repositories. Request only needed permissions and narrow installation tokens further where possible. GitHub installation access tokens expire after one hour; a long run needs a deliberate refresh/broker strategy, not a permanently broad token. [Installation token lifecycle](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

Do not conflate classic personal-token scopes such as `repo` with fine-grained token or GitHub App permission names. Read-only checkout typically needs repository Contents read; publishing requires the relevant Contents/Pull requests writes. Verify each endpoint against the credential type actually used.

Creating a PR requires Pull requests write, while the merge endpoint accepts Contents write. Consequently, a branch-writing token is not inherently a "cannot merge" token. Enforce restrictions through repository rules, protected branches, no bypass privileges, and/or a publishing service that exposes only the intended operations. [GitHub pull-request endpoint permissions](https://docs.github.com/en/rest/pulls/pulls)

Store the published branch, commit, PR identity, and authorizing principal as a receipt. Independent CI should validate the change before merge. Do not grant an agent workflow-administration or production-deployment permissions merely to create a patch.

## Secret and approval lifetimes

Keep provider API keys in the calling backend. Use vault/proxy credentials when the platform can inject them without exposing raw values to generated commands. Setup-only secrets must not be copied into cached files. Ordinary environment variables are readable by processes and are not secret isolation. [OpenAI sandbox configuration](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted), [Claude Code API credentials](https://code.claude.com/docs/en/cloud-environments)

Review setup scripts, package installation hooks, project instructions, and imported skills before granting capabilities. Source content may be untrusted even when the repository is accessible. Use synthetic canaries to test disclosure boundaries rather than live credentials.

Bind approval to the requesting user, session, exact operation, resource, and relevant revision. Expire stale approvals and recheck authority immediately before execution. An approval UI does not enforce policy by itself; the backend must reject unapproved or altered operations. Exercise the recovery and denial cases in [cloud coding agents](cloud-coding-agents.md#failure-scenarios-to-exercise).
