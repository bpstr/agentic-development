# Agent delegation

Delegation gives another agent a bounded subtask while the delegating agent retains responsibility for the larger objective. The child returns findings or artifacts that the parent can inspect and integrate.

A useful delegation contract includes the objective, relevant context, permitted tools, writable resources, time and token budget, and expected result. For a repository audit, a child might inspect authentication modules and return evidence with file references. It does not need unrelated product discussions or permission to modify billing code.

Parallelize independent work. Shared writes require explicit ownership, transactions, or conflict handling. Giving two agents the same objective does not guarantee independent reasoning, and it can multiply cost without improving coverage.

The parent must distinguish a child claiming completion from evidence of completion. Validate required artifacts and unresolved limitations. Propagate cancellation, bound delegation depth, and include child usage in the parent budget.

Delegation can be implemented as an agent exposed as a tool, a background job, or a protocol request to a remote agent. It differs from a handoff, which transfers control of the ongoing interaction. [OpenAI's orchestration guide](https://developers.openai.com/api/docs/guides/agents/orchestration) describes agent-as-tool and handoff patterns within an SDK.
