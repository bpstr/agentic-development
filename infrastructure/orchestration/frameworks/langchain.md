# LangChain

Official documentation: [Overview](https://docs.langchain.com/oss/python/langchain/overview), [Quickstart](https://docs.langchain.com/oss/python/langchain/quickstart). Source: [langchain-ai/langchain](https://github.com/langchain-ai/langchain).

LangChain provides model integrations, tool abstractions, and a higher-level agent API. Its current agents build on LangGraph, making it useful when an application needs a conventional tool loop plus integrations without defining every graph node itself.

Install the framework and the chosen provider adapter in an isolated Python environment:

```bash
python -m pip install langchain langchain-openai
```

Set `OPENAI_API_KEY` and `MODEL_ID` to a model supporting function tools. Save the following as `example.py` and run `python example.py`. The lookup uses fixed sample data; the model call uses the configured provider.

```python
import os
from langchain.agents import create_agent

def document_status(document_id: str) -> str:
    """Look up the publication state of a sample document."""
    return {"doc-17": "approved"}.get(document_id, "unknown")

agent = create_agent(
    model="openai:" + os.environ["MODEL_ID"],
    tools=[document_status],
    system_prompt="Use the status tool before answering document questions.",
)
result = agent.invoke({
    "messages": [{"role": "user", "content": "What is doc-17's status?"}]
})
print(result["messages"][-1].content)
```

The framework converts the function signature into a tool schema, runs requested tools, and continues generation with their results. A real lookup should derive user and workspace scope from trusted application context.

Configure persistent checkpoints for conversations that must resume, and set execution limits at the runner or worker boundary. Installing LangChain does not deploy the application or make in-memory state durable. Keep business writes in application services so authorization and idempotency work consistently outside the agent too. Use LangSmith only when its tracing or evaluation capabilities are desired; it is a separate integration.

## Decision-model integration and Python 1.5 upgrade

[LangChain 1.5.0](https://docs.langchain.com/oss/python/releases/changelog), published **November 11, 2026**, introduces the `langchain_core.decisions.BaseDecisionModel` interface with typed `Noul`, `Choice`, `Score`, and `Box` questions. The [TypeSafe integration](https://docs.langchain.com/oss/python/integrations/providers/typesafe) implements this using `TypeSafeClassifier`; it supports images and box answers. Decision models answer bounded questions, while a coding agent's tool loop and state remain distinct.

The release adds **beta** `ModelRouterMiddleware` for selecting among explicitly configured model choices and `AutoModeMiddleware` for classifying tool calls. Previously experimental middleware in `langchain-typesafe` is deprecated; configure the built-in `langchain.agents.middleware` classes with an explicit `classifier=` decision model. A classifier label or probability does not authorize tool execution: enforce allowlists, permissions and consequential-action approvals in application services. Test false positive/negative blocks before enabling automatic policy decisions.

**Compatibility:** `langchain` 1.5 and `langchain-core` 1.8 require **Python 3.11 or newer**, dropping 3.10 support. Check project interpreter constraints, client/server stream compatibility, and supported provider integrations before upgrading; see the official [release notes](https://docs.langchain.com/oss/python/releases/changelog).
