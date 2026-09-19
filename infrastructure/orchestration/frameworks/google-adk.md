# Google Agent Development Kit

Google Agent Development Kit (ADK) is an open-source framework for building and orchestrating agent systems. It provides abstractions for agents, tools, workflows, sessions, state, callbacks, evaluation, and deployment while remaining separate from the underlying model provider.

ADK can use Gemini but is designed around model-agnostic agent construction. Its workflow agents support deterministic sequential, parallel, and loop structures alongside model-driven agents. Tools can be ordinary functions, built-in integrations, MCP tools, or other agents.

Use ADK when an application benefits from an explicit agent framework and Google's surrounding agent tooling rather than treating it as a model API. Google documents deployment paths including Vertex AI Agent Engine and other runtime targets.

Official resources: [ADK documentation](https://google.github.io/adk-docs/) · [ADK repository](https://github.com/google/adk-python).
