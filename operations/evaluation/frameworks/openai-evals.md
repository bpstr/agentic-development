# OpenAI Evals

[Canonical framework repository](https://github.com/openai/evals) · [Running evaluations](https://github.com/openai/evals/blob/main/docs/run-evals.md) · [Building evaluations](https://github.com/openai/evals/blob/main/docs/build-eval.md)

OpenAI Evals is an open-source framework and registry for evaluating models and systems built around them. This page concerns the `openai/evals` repository. Hosted evaluation APIs and dashboard workflows are separate integration surfaces with their own lifecycle.

Install the framework in a virtual environment:

```sh
python -m pip install evals
```

The repository documents evaluation definitions, datasets, completion functions, and execution commands. For custom evaluations, clone the canonical repository and install it in editable mode; data distributed through Git LFS requires fetching the relevant objects rather than using pointer files as examples.

A practical case compares generated task identifiers with a reference set, while a system evaluation can wrap a more involved workflow through the framework's completion-function interface. Keep private evaluation data separate from any public contribution.

Configure credentials only for the providers the run actually uses. A local runner can still perform billed API requests, including judge calls. Select the model, dataset revision, grader, and budget explicitly.

Inspect per-case outputs and failures instead of treating a registry score as a product guarantee. Broad benchmark coverage does not establish that an application enforces its own permissions, performs exactly the intended mutation, or recovers correctly after interruption.
