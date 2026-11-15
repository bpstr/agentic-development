# Amp CLI

Official documentation: [CLI setup and execution locations](https://ampcode.com/docs/cli), [package changes](https://ampcode.com/news/npm-package-changes). Product terms: [Amp license terms](https://ampcode.com/terms).

Amp CLI is a commercial coding-agent client for repository work. It can start a local agent thread or connect work to an Amp orb or a configured runner. It is useful when the same terminal workflow needs a deliberate choice between the developer's checkout and another execution environment. Amp is distributed under proprietary service terms; compiled CLI availability is not an open-source license.

## Install and authenticate

The official macOS/Linux/WSL installation path is:

```bash
curl -fsSL https://ampcode.com/install.sh | bash
cd your-project
amp login
amp
```

Follow any workspace-specific installation instructions supplied by the service. Use `amp --help` for the installed version's commands. The current npm distribution is `@ampcode/cli`, replacing the former `@sourcegraph/amp` name; older package examples should be updated rather than treated as a separate agent.

## Choose the execution location

An ordinary `amp` invocation starts a local thread. The documented explicit choices include:

```bash
amp --executor local
amp --executor orb
```

A connected runner is another possible executor. The CLI documentation describes its identifier and working-directory configuration. An orb uses the project associated with the current Git remote when one is found; local files and uncommitted work must not be assumed to appear in every remote environment.

The CLI can connect to supported editors through its command palette's `ide connect` action. That integration supplies editor context and editing support while the agent retains its own thread and execution lifecycle.

## Accounts and reproducibility

`amp account list` shows saved accounts, and `amp account switch` selects the identity for future commands. An already running process keeps the account it started with. Restart the process after switching when identity matters to repository or service access.

Record both the client version and execution location when diagnosing a failed task. A local terminal interface does not imply local model inference or a self-hosted service. Review changed files and verification evidence before publishing; remote workers also need the appropriate application dependencies, test data, and narrowly scoped credentials.
