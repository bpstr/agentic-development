# JetBrains Junie

Official sources: [documentation](https://junie.jetbrains.com/docs/), [Junie in JetBrains IDEs](https://www.jetbrains.com/help/ai-assistant/junie-agent.html), [CLI quick start](https://junie.jetbrains.com/docs/junie-cli-usage.html), [CLI reference](https://junie.jetbrains.com/docs/parameters.html), and [canonical distribution repository](https://github.com/JetBrains/junie).

Junie is JetBrains' coding agent for multi-step repository work. It can plan changes, edit code, run tests and commands, and use external tools. Its IDE integration is useful when the developer wants delegated work close to JetBrains' project navigation, inspections, and review workflow. The same product also exposes terminal and headless execution paths.

Junie is a specific agent, not a synonym for every feature in JetBrains AI Assistant. Installing an IDE assistant or configuring a model provider does not by itself establish how a Junie session authenticates or which environment it can modify.

## Start in an IDE or terminal

For an IDE session, follow the current Junie installation guide for the supported JetBrains IDE, authenticate, open the project, and choose Junie in the AI interface. Give it one bounded task with clear acceptance criteria, inspect its proposed scope, and review the resulting diff and test results.

For terminal work, install through the official CLI quick start, navigate to the repository, and launch:

```sh
junie
```

The documented onboarding offers JetBrains account access, a Junie API key, or supported provider credentials. Use the [CLI reference](https://junie.jetbrains.com/docs/parameters.html) for the current interactive, planning, task, and session-resumption options before scripting runs. Interactive invocation and headless CI are different operating modes.

## Model access and source licensing

The CLI quick start includes [OpenRouter](../../../infrastructure/hosting/gateways/openrouter-gateway.md) among supported bring-your-own-key providers. Select a supported provider and model deliberately, and keep credentials outside committed project instructions. Direct provider billing and a JetBrains subscription are separate access paths.

Junie is proprietary. Its [repository license statement](https://github.com/JetBrains/junie/blob/main/README.md) reserves rights under JetBrains' product terms. The [ACP release feed](https://github.com/JetBrains/junie-acp-release) explicitly states that it is not Junie's source repository. Public installers and registry metadata do not make the agent open source.

## Verification boundaries

Check the tools, project instructions, and permissions available in the selected surface. IDE context helps locate code but does not prove a change is correct. Run behavior-relevant checks and inspect edits before integration. Use [repository context](../repository-context.md), [coding-agent permissions](../coding-agent-permissions.md), and [verification](../coding-agent-verification.md) to make repeated tasks comparable.
