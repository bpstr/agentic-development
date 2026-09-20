# Evaluation datasets

An evaluation dataset is a versioned set of tasks and expected outcomes used to compare system behavior. Each case should contain the input, relevant starting state, acceptable results, and checks that identify failure. A list of questions without criteria cannot establish whether a change improved the product.

Include ordinary requests and operational boundaries: ambiguous entities, no matching evidence, denied access, unavailable tools, stale records, and interrupted execution. Balance cases according to the workload while keeping rare but severe failures visible separately.

An illustrative case can record:

```json
{
  "id": "update-denied-task",
  "input": "Move T-42 to In Progress",
  "actor": "user-a",
  "starting_state": "T-42 belongs to another workspace",
  "checks": ["no mutation", "no private content", "no success claim"]
}
```

Fixture state belongs to the test environment, not automatically in the model's prompt. The agent should encounter only what the real caller could access.

Maintain separate development and held-out cases. Repeatedly tuning against the same examples can improve the dataset score without improving unseen behavior. Retain dataset revision, retrieval snapshot or freshness policy, model identifier, instructions, schemas, and application version. [LangSmith's evaluation concepts](https://docs.langchain.com/langsmith/evaluation) describe datasets and experiments as separate objects.

Production failures are valuable candidates after redaction and review. Preserve the triggering condition while removing private content that is unnecessary to reproduce it. Synthetic cases supplement actual failures; they cannot establish the true frequency of a production problem.
