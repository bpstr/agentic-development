# Multi-agent systems

A multi-agent system coordinates multiple agents that have separate instructions, state, tools, or objectives. Several model calls inside one workflow do not necessarily form multiple agents; separate decision-making roles are the useful distinction.

Common structures include a coordinator with specialists, peer agents exchanging results, a sequence of role-specific stages, and independent reviewers whose findings are reconciled. Choose a structure because a task benefits from specialization, context isolation, or parallel work.

For a technical report, one agent can inspect source material while another checks a numerical appendix. A coordinator joins their evidence and resolves disagreements. The benefit comes from separable work and validation, not from assigning human job titles to prompts.

Communication introduces overhead: extra inference calls, repeated context, routing, synchronization, and conflicting writes. Bound the total budget and give shared resources a clear owner. Agents should return structured findings, evidence, and uncertainties instead of treating each other's prose as verified fact.

Compare against a competent single-agent baseline. Measure task completion, latency, cost, and error recovery on the same workload. [AutoGen AgentChat](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/index.html) and [ADK multi-agent systems](https://adk.dev/agents/multi-agents/) illustrate coordination patterns; neither removes application responsibility for authorization or business correctness.
