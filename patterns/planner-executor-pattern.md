# Planner-executor pattern

The planner-executor pattern separates deciding a sequence of work from carrying out its steps. The planner proposes actions and dependencies; the executor performs permitted operations, records outcomes, and reports evidence that may require revising the plan.

A useful plan identifies each step's goal, required inputs, completion condition, and dependencies. Keep it at the level needed for coordination rather than generating a long command sequence before inspecting the environment.

For a data migration, the plan might verify prerequisites, prepare a reversible change, run it in a test environment, inspect results, and request any required release decision. The executor must still validate current revisions, credentials, and state at each step. Planning does not confer authority to execute.

[LangGraph's workflow guidance](https://docs.langchain.com/oss/python/langgraph/workflows-agents) illustrates structured decomposition and worker execution. The broader [workflow-versus-agent distinction](https://www.anthropic.com/engineering/building-effective-agents) helps decide whether the sequence should be fixed or adaptive.

Store completion receipts separately from the proposed plan. A checked box should represent observed completion, not the planner's expectation. After a failure, revise only affected steps and avoid repeating already committed side effects.

This pattern helps inspect complex work but adds planning latency and stale assumptions. For a single known read or update, a direct operation is usually easier to verify.
