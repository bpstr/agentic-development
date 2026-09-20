# LangSmith evaluation

[Official evaluation documentation](https://docs.langchain.com/langsmith/evaluation)

LangSmith evaluation runs experiments over datasets and evaluates production interactions. It can apply deterministic evaluators, model judges, and human feedback to application outputs and execution traces.

Create a dataset with inputs and any required reference outputs. Define the target application function and evaluators, then run an experiment that records configuration and results. Keep the dataset revision stable while comparing two implementations; changing cases and prompts simultaneously makes score differences difficult to interpret.

For a task assistant, use deterministic checks for valid task IDs and saved status, and semantic assessment for whether the explanation accurately describes the change. A trace can supply intermediate evidence, but the authoritative application state should establish the side effect.

Production evaluation and dataset experiments answer different questions. Dataset experiments compare controlled cases; production sampling detects failures in the current workload. Both require an explicit policy for private inputs and external judge requests.

An experiment may call the application model and an evaluator model. Account for both, plus retries, before enabling large datasets or continuous evaluation. Store human calibration examples for judge rubrics and inspect disagreement cases.

Use [LangSmith observability](../../observability/platforms/langsmith.md) to investigate individual executions. An evaluation score labels an outcome; a trace explains the recorded path that produced it.
