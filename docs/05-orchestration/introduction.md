# Orchestration: introduction

[Handbook](../../README.md) · [Chapter](README.md)

A model can propose an action; orchestration determines what happens around that proposal. Keep three questions separate:

- **Who chooses the next step?** A direct loop, deterministic workflow, graph, or managed harness.
- **Where does execution happen?** Application process, worker, sandbox, remote tool, or managed environment.
- **What survives interruption?** Conversation state, checkpoints, pending approvals, operation IDs, and domain records.

A graph answers a control-flow question. A worker answers an execution question. A checkpoint answers a persistence question. One framework may provide several of these, but the responsibilities remain distinct.

Read [agent loops](execution/agent-loops.md) before choosing a framework. Then use the [framework directory](frameworks/README.md) to inspect one implementation at a time.
