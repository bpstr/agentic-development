# 09 · Evaluation and operations

[Handbook](../../README.md)

An agent that produces a convincing answer can still select the wrong resource, repeat a mutation, leak context, or take too long. Operating agents means measuring both their answers and their effects on the application.

| Read | Question it answers |
| --- | --- |
| [Tracing](tracing.md) | What happened, where did the time go, and what is still unmeasured? |
| [Evaluations](evaluations.md) | Did the system complete the intended task correctly? |
| [Security and permissions](security.md) | What stops an instruction or tool call from crossing a trust boundary? |
| [Cost and latency](cost-and-latency.md) | What does a successful task cost, and how quickly does the user get it? |

Use one loop of improvement: capture a failure, turn it into a reproducible case, change the smallest relevant part, and compare the outcome. Track the model, prompt, tool schema, retrieval configuration, and application revision together so the comparison is meaningful.

For a first implementation, collect a run ID, actual tool outcomes, total latency, usage, and a small set of representative task cases. Expand measurement when it answers a concrete reliability question. [Execution and state](../05-orchestration/execution/agent-loops.md) explains the recovery mechanisms these checks should exercise.

**Source review:** 2026-09-19. Product references describe published capabilities; this chapter contains no measured vendor rankings.
