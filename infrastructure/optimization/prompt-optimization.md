# Prompt optimization

Prompt optimization selects instructions, demonstrations, or prompt structure using explicit evaluation criteria. The result is a versioned candidate for future requests, not evidence that the model has learned new weights. The [DSPy optimizer documentation](https://dspy.ai/learn/optimization/optimizers/) describes this approach and distinguishes optimizers that change prompts from those that adapt model weights.

Use optimization when a repeatable task has representative inputs and an assessable result. First investigate whether the failure actually comes from the prompt: missing source data, a broken tool, or an authorization defect will not be repaired reliably by different wording.

## Separate three feedback loops

| Mechanism | What changes | When the change is used |
| --- | --- | --- |
| Prompt optimization | Instructions or selected demonstrations | Later requests using the approved candidate |
| Evaluator–optimizer workflow | The current generated artifact | Another attempt within one bounded task |
| Fine-tuning | Model parameters | Inference using the adapted model |

A retrieved example can also change a request's context without changing the stored prompt. Keep these mechanisms separate when attributing an improvement. See the [evaluator–optimizer pattern](../../patterns/evaluator-optimizer-pattern.md) and [model adaptation](../model-adaptation/model-adaptation.md).

## Build an experiment around one decision

Consider routing a task request to `read`, `mutate`, or `clarify`. The router selects a workflow; it never grants authorization to execute a mutation. A request with an ambiguous target should become `clarify`, even when it contains an imperative verb.

Create reviewed examples of ordinary reads, valid mutations, negated actions, quoted instructions, and ambiguous identifiers. Split by underlying task or conversation so near-duplicate paraphrases do not appear on both sides of an evaluation boundary.

Use a training/development pool for proposing instructions and demonstrations, a validation set for choosing candidates, and an untouched test set for the final assessment. Inspect validation errors freely, but recognize that doing so tunes the system to that set. Do not repeatedly choose new candidates based on the final test score. Dataset and grader requirements belong in [evaluation datasets](../../operations/evaluation/evaluation-datasets.md).

Start with a fixed baseline and a small change budget. Change the ambiguity instruction, then the demonstration selection, rather than changing model, retrieval, tool schemas, and prompt together. Save the exact candidate, dataset revision, scorer, model configuration, application revision, and raw predictions.

## Choose candidates under constraints

The following is **invented validation data to illustrate a decision**, not a DSPy benchmark. There are 24 cases, including requests that must not enter a mutation workflow.

| Candidate | Correct routes | Forbidden mutation routes | Decision under a zero-violation gate |
| --- | --- | --- | --- |
| Baseline | 18/24 | 0 | Retain as reference |
| More assertive instructions | 21/24 | 1 | Reject despite higher aggregate accuracy |
| Explicit ambiguity handling | 20/24 | 0 | Eligible for further comparison |

The gate protects a product requirement, not a mathematical guarantee of safety. Actual tool authorization remains outside the classifier. Examine per-class precision/recall and confusion cases so a majority of easy reads cannot hide poor mutation handling.

Compare eligible candidates on representative latency, input/output volume, and cost. Optimization may call models many times, and larger demonstration sets may increase serving cost. Record optimization spending separately from the cost of serving each request. A sample-count limit is not a hard currency limit; enforce spending restrictions in the caller or provider account as appropriate.

## Release the result, not the experiment

Evaluate the frozen candidate on held-out cases, then check the existing regression suite. Retain the baseline for rollback and version the prompt artifact with the application configuration that uses it. Inspect early production failures under the same privacy and evaluation rules as other runs.

Treat generated demonstrations as untrusted artifacts requiring review for incorrect labels, secrets, and copied evaluation answers. Optimizing a weak judge can reward its blind spots. Better scores on a repeatedly inspected dataset do not establish generalization, and a longer prompt is not inherently a better one. [DSPy](frameworks/dspy.md) provides one implementation of a small compile–compare–save workflow.
