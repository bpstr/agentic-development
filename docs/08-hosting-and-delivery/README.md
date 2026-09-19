# 08 · Hosting and delivery

[Handbook](../../README.md)

“Where is the agent hosted?” has several answers: where the model runs, where the execution loop runs, where tools execute, and where durable data lives. Those locations can be different. A laptop can run a coding agent whose model is remote; a hosted agent can call tools in your application.

| Read | What it explains |
| --- | --- |
| [Providers and gateways](providers-and-gateways.md) | Direct inference, OpenRouter, Hugging Face, routing, and compatibility |
| [Managed agents and sandboxes](managed-agents.md) | OpenAI and Anthropic hosted runtimes, execution environments, and application ownership |
| [Deployment choices](deployment.md) | A practical application deployment, durable workers, local serving, and scaling decisions |

Model selection belongs in [Models and providers](../02-models-and-providers/README.md). This chapter describes the services and execution responsibilities around a chosen model.
