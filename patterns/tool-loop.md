# A bounded tool loop

A bounded tool loop lets a model request an operation, receive its result, and continue until it answers or reaches a stopping condition. The application supplies identity, validates arguments, executes tools, and controls the budget.

For “What is T-42's status?”, expose a task-reading tool scoped to the authenticated caller. The model requests the task, the executor returns its current status, and the next model call uses that result to answer. A tool declaration alone does not perform the read.

Illustrative application pseudocode:

```text
state = initial_request_and_instructions()
deadline = configured_run_deadline()

for step in bounded_model_steps:
    require_not_cancelled()
    require_before(deadline)
    output = model.generate(state)
    preserve_required_continuation_items(output, state)

    if output.is_final:
        persist_final_output(output)
        finish_run()
        stop

    for call in output.tool_calls:
        tool = resolve_allowed_tool(call.name)
        arguments = validate(call.arguments, tool.schema)
        result = tool.execute(authenticated_actor, arguments, deadline)
        state.append(tool_result(call.id, result))

otherwise:
    finish_run_with_budget_exhausted()
```

The pseudocode omits provider syntax deliberately. Use the chosen API's exact output items and continuation contract; some require retaining reasoning or signature-bearing items alongside tool results. Match each result to its call identity and distinguish a final answer from empty or incomplete output.

Run independent reads concurrently only when their dependencies and consistency requirements allow it. Keep mutations tied to stable operation keys and receipts so interruption cannot cause duplicate effects. Validation of JSON shape is separate from authorization of the operation.

Bound tool count, result size, time, attempts, and delegated work in addition to model steps. Record errors and cancellation explicitly. For long-lived execution, persist state and events independently of the client connection, as described in [background work](background-work.md).
