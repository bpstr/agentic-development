# Model evaluation

Model evaluation measures whether a model configuration performs a defined task adequately. It is narrower than evaluating an entire agent system: hold the surrounding tools and data fixed when the question concerns the model itself. Otherwise a retrieval improvement can be mistaken for a reasoning improvement.

An evaluation case needs an input, allowed evidence, expected outcome, and scoring rule. Use exact checks for machine-verifiable outputs and a written rubric for subjective judgments. For example, a task extractor can be scored on correct title, assignee identity, deadline interpretation, and abstention when a required field is absent. Valid JSON is one criterion, not the entire result.

Separate development cases from a held-out set. Repeatedly rewriting prompts against every available example measures adaptation to those examples rather than generalization. [SWE-bench's evaluation framework](https://www.swebench.com/) illustrates the value of checking concrete outcomes against executable tests in software tasks.

Record model revision, prompt version, decoding or reasoning settings, tool definitions, and relevant input data revisions. Repeat stochastic cases when variation could change the decision. Report counts and failure categories alongside percentages: “18 of 20 cases passed” makes a small sample visible.

When a model judges another model, keep its rubric fixed, hide candidate identity where possible, and manually review disagreements. Judge preference can reward verbosity or familiar style without detecting factual errors. A useful regression gate requires critical cases to pass individually even when the average score improves.
