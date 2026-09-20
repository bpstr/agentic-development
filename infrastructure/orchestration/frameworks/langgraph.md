# LangGraph

Official documentation: [Overview](https://docs.langchain.com/oss/python/langgraph/overview), [Workflows and agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents), [Persistence](https://docs.langchain.com/oss/python/langgraph/persistence). Source: [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph).

LangGraph coordinates stateful work using explicit nodes, edges, and state updates. It supports branches, loops, interrupts, and checkpoints. Use it when the execution graph or recovery behavior needs to be visible in application code.

Install `langgraph`, `langchain`, and `langchain-openai`. Set `OPENAI_API_KEY` and a tool-capable `MODEL_ID`. This standalone Python example defines the model/tool cycle explicitly:

```python
import os
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage, ToolMessage
from langchain.tools import tool
from langgraph.graph import StateGraph, MessagesState, START, END

@tool
def word_count(text: str) -> int:
    """Count whitespace-separated words in supplied text."""
    return len(text.split())

model = init_chat_model("openai:" + os.environ["MODEL_ID"])
model = model.bind_tools([word_count])

def decide(state: MessagesState):
    return {"messages": [model.invoke(state["messages"])]}

def execute(state: MessagesState):
    outputs = []
    for call in state["messages"][-1].tool_calls:
        if call["name"] != word_count.name:
            raise ValueError("Unknown tool")
        value = word_count.invoke(call["args"])
        outputs.append(ToolMessage(
            content=str(value), tool_call_id=call["id"]
        ))
    return {"messages": outputs}

def route(state: MessagesState):
    return "execute" if state["messages"][-1].tool_calls else END

graph = StateGraph(MessagesState)
graph.add_node("decide", decide)
graph.add_node("execute", execute)
graph.add_edge(START, "decide")
graph.add_conditional_edges("decide", route)
graph.add_edge("execute", "decide")
agent = graph.compile()
result = agent.invoke(
    {"messages": [HumanMessage(content="Use word_count on: red blue green")]},
    config={"recursion_limit": 10},
)
print(result["messages"][-1].content)
```

`MessagesState` merges message updates rather than replacing the complete history. The tool-call ID connects each observation to the model's request. The recursion limit bounds graph steps; it is not a cost ceiling.

This compiled graph has no durable checkpoint store. Add a persistent checkpointer and stable thread identity when resumption matters. Keep external side effects idempotent because a recovered node may repeat work. A graph defines execution structure; it does not validate business outcomes by itself.
