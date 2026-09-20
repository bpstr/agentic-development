# Planner-executor pattern

The planner-executor pattern separates deciding a sequence of work from carrying out the steps. The plan can be inspected, validated, revised, or approved before execution.

Plans are hypotheses rather than authoritative state. Executors should validate each step against current resources and permissions because conditions may change after planning.
