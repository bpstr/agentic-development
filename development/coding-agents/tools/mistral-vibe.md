# Mistral Vibe

Official documentation: [installation and setup](https://docs.mistral.ai/getting-started/quickstarts/vibe-code/install-cli), [CLI operation](https://docs.mistral.ai/vibe/code/cli/work-with-cli). Canonical repository: [mistralai/mistral-vibe](https://github.com/mistralai/mistral-vibe). Source license: [Apache-2.0](https://github.com/mistralai/mistral-vibe/blob/main/LICENSE).

Mistral Vibe is an open-source terminal coding agent. It combines a conversation with repository inspection, file changes, and command execution. Interactive sessions support iterative development; programmatic execution suits bounded repository tasks in scripts or CI. Provider configuration is distinct from the harness: current installation documentation also describes local models and compatible external APIs.

## Install and configure

One documented manual installation path uses `uv`:

```bash
uv tool install mistral-vibe
cd your-project
vibe
```

The first-run wizard configures appearance and authentication. Use a Mistral account or the documented API-key/provider setup; `vibe --setup` reopens the wizard. Consult the installation guide for platform prerequisites and the repository's support caveats. Do not assume a globally installed agent supplies the application's own dependencies.

For interactive work requiring review of every tool call, including file edits:

```bash
vibe --agent ask
```

The selected agent controls approval behavior. Repository instructions, skills, and configuration are loaded subject to Vibe's trusted-folder rules.

## Scripted execution

The CLI documents a bounded programmatic run with structured output:

```bash
vibe --prompt "Explain the request validation path with file references." \
  --max-turns 8 --output json
```

Programmatic mode cannot ask an operator to approve a tool call. Configure the permissions needed for the task explicitly; otherwise approval-dependent operations can be denied. Read the exit status and reported stop reason before classifying a run as complete. A turn limit bounds iteration, not factual correctness or total monetary cost.

## Execution boundaries

The open-source runtime, model service, and Vibe Code Web sandbox are separate layers. A local CLI can use remote inference, while a cloud task runs its development tools elsewhere. Choose the environment deliberately when files, test services, or credentials are machine-specific.

Retain the diff and exact verification results with an automated task. Restrict available tools to the task's needs and use a separate checkout for concurrent edits. A configured compatible endpoint still needs testing for the agent's streaming and tool-call behavior; API resemblance alone does not prove harness compatibility.
