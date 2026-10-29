# Gemini CLI

Official documentation: [Gemini CLI](https://geminicli.com/docs/), [headless execution](https://geminicli.com/docs/cli/headless/). Canonical repository: [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli).

Gemini CLI brings a model-driven agent loop into the terminal, with local project context, file and shell operations, and extension mechanisms. It belongs to coding-agent tooling rather than the Gemini inference API itself.

## Basic setup

Use a Node.js version supported by the current installation guide, then install and start the CLI:

```bash
npm install -g @google/gemini-cli
cd your-project
gemini
```

Choose the documented authentication method for the account or deployment. Supply the repository's build prerequisites separately; installing the CLI does not install application dependencies or start its services.

A headless prompt can request structured output:

```bash
gemini -p "Locate the code that retries failed webhooks."   --output-format json
```

Inspect errors and the returned execution result before consuming it in automation. A machine-readable response envelope does not make the generated explanation correct.

## Context and execution

Gemini CLI documents `GEMINI.md` project context, MCP servers, skills, extensions, and sandboxing. These support different responsibilities: project context preserves conventions, skills provide procedures, and tools execute operations. [Configuration and feature index](https://geminicli.com/docs/)

Begin with a task whose completion can be assessed through a diff or repository evidence. Verify which directories, commands, network destinations, and credentials the session can access. A local CLI may still use remote inference, so local execution and data locality should be evaluated separately.

## Gemini API CLI is not Gemini CLI

Google released a separate [Gemini API CLI (`gemini-api`)](https://ai.google.dev/gemini-api/docs/cli) in beta on October 27, 2026. **`gemini`** is the interactive, model-driven coding agent described above, with local tools and project instructions; **`gemini-api`** is a *stateless API shell client* for Gemini Interactions, media analysis/generation, and cloud managed agents. Neither is the other's executable or configuration surface.

In a separate automation or coding-agent process, `gemini-api --usage` prints offline command definitions, `--schema` exposes request JSON schemas, and `--dry-run` previews a request without contacting the API. For example, `gemini-api generate "Summarize the release notes" --stream=false -o json` sends one metered API request and returns a machine-readable result. Media commands write files to disk and emit paths rather than embedding raw base64 in agent context.

Use `gemini-api agent run ... --background --stream=false` to start a managed-agent job, then fetch status by its interaction ID. Preserve those IDs explicitly: the CLI does not maintain a hidden conversational session. It supports HTTP, SSE and polling, **not bidirectional Live WebSockets**. Treat the beta CLI as an external integration, pin versions for CI, and secure `GEMINI_API_KEY`; it does not add tools or permission to the host agent by itself.
