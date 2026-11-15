# Continue CLI

Canonical repository: [continuedev/continue](https://github.com/continuedev/continue), [CLI implementation and usage](https://github.com/continuedev/continue/tree/main/extensions/cli). Documentation: [CLI quickstart](https://docs.continue.dev/cli/quickstart). Source license: [Apache-2.0](https://github.com/continuedev/continue/blob/main/LICENSE).

Continue CLI, invoked as `cn`, is an open-source terminal coding agent from the same project as the Continue VS Code and JetBrains integrations. It provides an inspectable example of configurable repository tooling, interactive sessions, and headless automation.

## Maintenance status

The [canonical README](https://github.com/continuedev/continue/blob/main/README.md) states that the project is no longer actively maintained, is read-only for users, and received a final 2.0.0 release. Treat it as a legacy implementation or a basis for a separately maintained fork. A published documentation site and accessible source code do not establish continuing product support.

The final-release notice also says authentication was removed. Older quickstart material still describes Continue account login; do not use that surviving page as proof that the final release requires or supports the same account workflow. Verify the installed release's configuration and provider requirements.

## Inspect or operate an existing installation

The upstream CLI usage guide documents the package and executable:

```bash
npm install -g @continuedev/cli
cd your-project
cn
```

Use the guide's supported Node.js version and select a known release for reproducible evaluation. Configure model access and tools according to that release or maintained fork, rather than assuming an old hosted account service remains available.

The documented basic automation and session operations are:

```bash
cn -p "Explain the current changes with file references."
cn --resume
cn ls
```

`--config` selects an agent configuration. These operations are described in the [CLI README inspected at revision 5522c6f](https://github.com/continuedev/continue/blob/5522c6f44ca0ac3528b37244818fbfa39b5af470/extensions/cli/README.md); a fork may change them.

## Evaluation boundaries

Assess maintenance separately from capability and licensing. For production adoption, identify who will provide security updates, dependency fixes, and model-protocol compatibility. Keep account integration assumptions out of portable workflows, inspect tool permissions, and verify patches with the application's own checks. The open-source license permits reuse but does not supply an operational maintenance commitment.
