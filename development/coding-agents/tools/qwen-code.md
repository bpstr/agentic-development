# Qwen Code

Official documentation: [overview](https://qwenlm.github.io/qwen-code-docs/en/users/overview), [desktop and web shell](https://qwenlm.github.io/qwen-code-docs/en/blog/quickstart/web-shell-and-desktop/). Canonical repository: [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code). Source license: [Apache-2.0](https://github.com/QwenLM/qwen-code/blob/main/LICENSE).

Qwen Code is an open-source coding-agent runtime with terminal, desktop, browser, and editor interfaces. It is useful when a team wants repository work and automation through an inspectable agent implementation, with account-based access or a configured model provider. The runtime and the Qwen model family are separate components: the source license does not determine the license, availability, or cost of a selected model.

## Start in a repository

The [canonical installation guide](https://github.com/QwenLM/qwen-code/blob/main/README.md) documents standalone installers and package-manager options. For the npm path, use the supported Node.js version listed there:

```bash
npm install -g @qwen-code/qwen-code@latest
cd your-project
qwen
```

Run `/auth` inside the session and choose the applicable Qwen account or API-provider configuration. Start with a bounded request such as identifying a request handler and its tests. Application dependencies and test services still need their own setup.

For a scripted task:

```bash
qwen -p "Explain the webhook retry path and cite the relevant files."
```

Treat the explanation as a claim to check against the repository. A completed agent turn does not establish that a build or test suite passed.

## Desktop, browser, and editor use

Qwen Code Desktop provides a graphical interface; the web shell exposes sessions and project changes in a browser. The repository documents this launch command:

```bash
qwen serve --open
```

The README labels the web/server surfaces experimental. Keep their compatibility and deployment requirements separate from the established terminal entry point. Closing a browser view and stopping its underlying agent service are different lifecycle operations.

Editor integrations provide another client for agent work; they do not change the model into a language server. Check which process owns the working directory, credentials, and running tools before combining clients. For repeatable automation, pin the chosen client version and validate its authentication, permissions, output handling, and cancellation behavior with the actual provider configuration.
