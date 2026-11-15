# Gemini CLI

Official documentation: [Gemini CLI](https://geminicli.com/docs/), [headless execution](https://geminicli.com/docs/cli/headless/). Canonical repository: [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli). Source license: [Apache-2.0](https://github.com/google-gemini/gemini-cli/blob/main/LICENSE).

Gemini CLI brings a model-driven agent loop into the terminal, with local project context, file and shell operations, and extension mechanisms. It belongs to coding-agent tooling rather than the Gemini inference API itself.

## Current role in Google's tooling

The [canonical README's status notice](https://github.com/google-gemini/gemini-cli#gemini-cli) positions `gemini` for enterprise Gemini Code Assist workflows. It directs individual Google accounts and Google AI subscription users to [Antigravity CLI](https://antigravity.google/docs/cli/tutorial), whose executable is `agy`. These are distinct coding-agent clients, not interchangeable command names. The separately named Gemini API CLI provides API operations rather than the same coding harness.

Check the relevant client's authentication and model support before adopting an old tutorial. Open-source client code does not by itself grant inference access, and an account entitlement for one product is not proof that another client accepts it.

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
gemini -p "Locate the code that retries failed webhooks." \
  --output-format json
```

Inspect errors and the returned execution result before consuming it in automation. A machine-readable response envelope does not make the generated explanation correct.

## Context and execution

Gemini CLI documents `GEMINI.md` project context, MCP servers, skills, extensions, and sandboxing. These support different responsibilities: project context preserves conventions, skills provide procedures, and tools execute operations. [Configuration and feature index](https://geminicli.com/docs/)

Begin with a task whose completion can be assessed through a diff or repository evidence. Verify which directories, commands, network destinations, and credentials the session can access. A local CLI may still use remote inference, so local execution and data locality should be evaluated separately.
