# LangSmith observability

[Official observability documentation](https://docs.langchain.com/langsmith/observability) · [Integrations](https://docs.langchain.com/langsmith/integrations)

LangSmith provides traces, performance inspection, feedback, and production monitoring for LLM applications. Its supported integrations extend beyond LangChain. It belongs in the observability layer even when LangGraph or another framework controls execution.

Start by choosing a project and deployment, creating credentials, and following the instrumentation guide for the actual framework. Run one small request and inspect whether model calls, tools, and retrieval appear under the intended parent execution. Then propagate the application's run and conversation identifiers so support incidents can be correlated.

A practical use is investigating an assistant that reports a successful edit after a denied tool call. The trace should preserve the tool rejection, subsequent generation, and final response; the application receipt establishes whether anything changed. An evaluator can then flag the mismatch.

Set payload capture, retention, and project access deliberately. A traces dashboard is not an authorization boundary for the application, and SDK export overhead must be measured in the deployed environment. Avoid duplicating the same instrumentation through both framework integration and manual wrappers unless the extra span has a distinct purpose.

Dataset experiments are a separate capability described in [LangSmith evaluation](../../evaluation/frameworks/langsmith-evaluation.md). Sharing a product does not make observability and evaluation interchangeable.
