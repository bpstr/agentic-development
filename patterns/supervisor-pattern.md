# Supervisor pattern

A supervisor agent coordinates tools or specialist agents. It interprets the objective, selects delegates, supplies context, integrates results, and decides whether additional work is required. Responsibility for the overall outcome remains with the supervisor.

For a release review, it might ask one specialist to inspect migration risk and another to examine unresolved regressions, then combine their evidence into a decision brief. Each subtask needs a bounded question and an expected result; “review everything” creates overlapping work and difficult verification.

[LangChain's subagent documentation](https://docs.langchain.com/oss/python/langchain/multi-agent/subagents) illustrates centralized coordination. A fixed workflow can perform similar dispatch when the steps are already known; model supervision is useful when decomposition or follow-up depends on intermediate findings.

Maintain explicit run state: assigned work, completed results, outstanding questions, budgets, and cancellation. Pass authoritative identifiers and relevant evidence to each specialist instead of assuming shared conversational context. Shared filesystem or credentials also require coordination beyond agent names.

Verify delegated results before integrating them. Conflicting findings should trigger source inspection or a targeted follow-up, not a confident average of incompatible claims.

Supervision adds coordination turns, context transfer, and failure modes. Bound delegation depth and total work. A simple request should not expand into several specialist calls unless those calls provide evidence necessary to complete it.
