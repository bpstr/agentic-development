# Models and providers: introduction

A **model** performs inference. A **provider** exposes a service that runs a model. A **gateway** can route requests to one or more providers. An **agent runtime** can add state, tools, retries, sandboxes, or durable execution around inference.

These layers are often sold together, but keep them separate in architecture diagrams. “We use model X” does not tell you which API serves it, who stores conversation state, where tools execute, or which service owns retries.

Before choosing a model, record required modalities, tool behavior, structured output needs, context size, latency target, cost ceiling, data restrictions, and deployment constraints. Then use [model selection](selection/model-selection.md).
