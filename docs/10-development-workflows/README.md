# Development workflows

[Handbook](../../README.md)

This chapter explains how developers use agents on real repositories and how they extend those agents. The useful unit is a repeatable workflow: find the relevant code, make a bounded change, verify the result, and preserve enough evidence for the next person or agent.

The surrounding capabilities solve different problems. A coding agent runs the work. Instructions describe project expectations. Skills package procedures. Plugins distribute capabilities. MCP connects tools. Code intelligence retrieves evidence. A proxy adapts or controls traffic between components.

| Question | Read |
| --- | --- |
| What does a coding agent provide beyond a model call? | [Coding agents and persistent bots](coding-agents.md) |
| When should I use instructions, a skill, a hook, or an MCP tool? | [Skills, plugins, and instructions](skills-and-plugins.md) |
| How do I package and test an extension across hosts? | [Plugin development](plugin-development.md) |
| How do I discover tools, inspect a server, or understand a proxy? | [Discovery and proxies](discovery-and-proxies.md) |
| How do agents navigate code without reading every file? | [Code intelligence](code-intelligence.md) |

## A practical starting point

Start with a working repository, documented setup commands, and one representative task. For example, ask an agent to trace a webhook handler and explain how duplicate deliveries are handled. Require file references and distinguish confirmed behavior from assumptions. That exposes missing setup instructions, unclear architecture, and retrieval gaps before the agent begins editing.

Turn a procedure into a skill once its inputs, steps, and expected output are clear. Package a plugin when the capability needs distribution. Add an index or gateway when a repeated limitation justifies the additional component. These are handbook recommendations, rather than claims that one extension stack wins every workload.

Compare tools using the same repository revision and task. Record the final diff, verification performed, elapsed time, usage, interventions, and unresolved concerns. A compelling demonstration and a useful daily workflow answer different evaluation questions.

## Evidence and boundaries

**Source review: 2026-09-19.** Product descriptions in this chapter are source-reviewed. Commands and manifests are illustrative; this handbook has not executed or benchmarked the external products. Community utilities are identified by their maintainers and repositories. Their inclusion explains a category and does not establish production suitability.

For agent execution inside an application, continue with [orchestration](../05-orchestration/README.md). For deployment boundaries, see [hosting and delivery](../08-hosting-and-delivery/README.md). For measurement, see [evaluation and operations](../09-evaluation-and-operations/README.md).
