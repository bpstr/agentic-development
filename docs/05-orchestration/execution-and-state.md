# Execution and state

[Handbook](../../README.md) · [Chapter](README.md)

An agent loop repeatedly asks a model for an answer or an action, executes permitted actions, and supplies their results. A workflow fixes more of that order in code. A graph expresses steps as nodes and transitions as edges; it can contain deterministic steps, model decisions, loops, and parallel branches. Graphs are a representation, not evidence of greater intelligence. [LangGraph's workflow guide](https://docs.langchain.com/oss/python/langgraph/workflows-agents) demonstrates these patterns.

## A bounded direct loop

The following is **application pseudocode**, not a provider API or a complete execution engine:

```text
load authorized conversation and pending execution state
repeat while step, time, and spend budgets remain:
    request a model response using the permitted tool catalog
    persist the response and tool-call identifiers
    if the response finishes the turn:
        persist the terminal outcome; return it
    for each requested tool call:
        validate tool name and arguments
        resolve actor and tenant from authenticated application context
        authorize the action against current resource state
        if application policy requires approval:
            persist an approval request and suspend execution
        execute using a stable operation key and record the outcome
        append the matching tool result to the conversation
persist a budget-exhausted outcome
```

A run's terminal outcome can be success, failure, cancellation, or exhausted budget. Waiting for user input or approval is a suspended, resumable state. Treating every non-error model answer as successful work hides failures such as “updated the task” when no mutation occurred. Failed tools need explicit results so the model can explain what remains unresolved.

## Choose the structure the task needs

| Shape | Example | Reason to choose it |
| --- | --- | --- |
| One call | Extract fields from a document | No external action or iterative decision is needed |
| Bounded loop | Find a task, inspect it, change its status | The next action depends on retrieved information |
| Explicit workflow | Retrieve policy, calculate eligibility, draft a response | Required stages and validation are known |
| Graph with branches | Research independent topics, then synthesize | Dependencies and joins need explicit representation |
| Durable job | Investigate an incident across restarts and approvals | Work must outlive the HTTP connection |

A queue does not itself make an agent durable. Record the job, checkpoints, outstanding calls, cancellation state, and results in durable storage. Acknowledge a job only after its next recoverable state is recorded. LangGraph separates thread checkpoints from longer-term stores; its in-memory checkpoint implementations do not survive a process restart. [Persistence documentation](https://docs.langchain.com/oss/python/langgraph/persistence).

For general business workflows, engines such as Temporal provide durable workflow execution beyond AI use cases. Their recovery model still needs correctly implemented external activities. [Temporal execution overview](https://docs.temporal.io/workflow-execution).

## Recovery includes side effects

Suppose a worker creates a task and crashes before saving the tool result. Retrying can create a duplicate. Use a stable operation key across retries, an atomic application transaction when possible, and downstream idempotency support for remote actions. A checkpoint after execution alone does not close the crash window. If the remote outcome is unknown, reconcile it before repeating the write.

Keep conversation history, execution checkpoints, and domain records distinct. A summary may help the next model call; it is not the authoritative record of an approval or a completed payment.

## Delegation and handoffs

Delegation gives a specialist a bounded subtask and returns its result to the coordinator. A handoff transfers responsibility for continuing the interaction. OpenAI's SDK exposes both agents-as-tools and handoffs. [SDK overview](https://openai.github.io/openai-agents-python/) · [Handoff semantics](https://openai.github.io/openai-agents-python/handoffs/).

Pass a concrete objective, necessary context, tool permissions, budget, and expected result. Bound delegation depth. Parallelize independent reads; coordinate writes to shared resources. More agents add calls and coordination work, so require measured benefit in [quality and latency](../09-evaluation-and-operations/README.md).

Run the [offline tool-loop example](../../examples/tool-loop/README.md) to inspect validated calls, denied access, limits, and cancellation.

**Source review:** 2026-09-19. The loop and scenarios are original illustrative designs, not executed vendor integrations.
