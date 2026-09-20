# Agent cost

Agent cost is the sum of resources consumed to attempt a task. Include every model call, tool or search charge, retrieval operation, managed runtime, sandbox, and relevant storage. Retries and failed attempts belong in the total.

Useful accounting distinguishes:

```text
serving cost = model + tools + retrieval + runtime + storage
evaluation cost = test execution + judges + evaluation infrastructure
cost per successful task = total serving spend / successful tasks
```

These are application accounting categories, not a provider's pricing formula. A cheap individual call can lead to an expensive task if it needs many retries or follow-up calls. Keep evaluation expenses separate when measuring ordinary serving cost.

Preserve raw provider usage and the rate revision used for calculation. Input, cached input, reasoning, image, audio, and tool units have different relationships across APIs. Check whether a counter is already included in another total before adding charges. [OpenAI pricing](https://developers.openai.com/api/docs/pricing) is an example of the source to consult rather than freezing rates in an architecture document.

Bound spend by run and accountable workspace, allowing for concurrent in-flight operations. A post-run report cannot prevent overspend already incurred. Compare model routes on task success, total cost, and latency together; lower token price alone does not determine the more economical system.
