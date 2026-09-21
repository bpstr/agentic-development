# DSPy for measured prompt optimization

[Official documentation](https://dspy.ai/current/) · [Optimizer guidance](https://dspy.ai/current/diving-deeper/choosing-an-optimizer/) · [Canonical repository](https://github.com/stanfordnlp/dspy) · [Saving state](https://dspy.ai/current/tutorials/saving/)

DSPy represents language-model tasks as signatures and composable Python modules. Optimizers use examples and a metric to change a program's instructions or demonstrations; other optimizers can adapt weights. Here it implements [prompt optimization](../prompt-optimization.md), not task scheduling, tool authorization, or a durable runtime.

## A small compile–compare–save lifecycle

This example uses the [DSPy 3.3.1 release](https://pypi.org/project/dspy/3.3.1/) and its [BootstrapFewShot implementation](https://github.com/stanfordnlp/dspy/blob/3.3.1/dspy/teleprompt/bootstrap.py). That optimizer selects demonstrations; it does not rewrite this signature's instructions or train model weights. The synthetic examples illustrate the lifecycle and are far too small to establish useful routing accuracy.

Use Python 3.10 or newer within the release's supported range and a virtual environment. Install `dspy[litellm]==3.3.1`, save the following as `optimize_router.py` outside this documentation repository, and configure provider credentials through the environment. `DSPY_MODEL` must identify an accessible provider/model supported by the installed adapter. Choose a chat model supporting a 256-token output limit; reasoning-model adapters may impose different requirements.

```python
import argparse
import json
import os
from importlib.metadata import version
from pathlib import Path
from typing import Literal

# Tiny, synthetic examples demonstrate the lifecycle, not real accuracy.
TRAIN = [
    ("Show task T-42", "read"),
    ("List the release blockers", "read"),
    ("Set T-42 to Done", "mutate"),
    ("Assign T-19 to user-7", "mutate"),
    ("Change that task", "clarify"),
    ("Assign T-42 to Mila; two people are named Mila", "clarify"),
]
VALIDATION = [
    ("Read document D-8 without changing it", "read"),
    ("Rename project P-17 to Launch", "mutate"),
    ("Delete the project; I have not specified which one", "clarify"),
]
TEST = [
    ("Who owns T-80?", "read"),
    ("Set T-80 priority to high", "mutate"),
    ("Move it to another project", "clarify"),
]


def check_data() -> None:
    requests = [text for rows in (TRAIN, VALIDATION, TEST) for text, _ in rows]
    if len(requests) != len(set(requests)):
        raise ValueError("Duplicate request across toy data splits")
    for rows in (TRAIN, VALIDATION, TEST):
        if not rows or any(label not in {"read", "mutate", "clarify"} for _, label in rows):
            raise ValueError("Empty split or invalid label")


def run() -> None:
    model = os.environ.get("DSPY_MODEL")
    if not model:
        raise SystemExit("Set DSPY_MODEL to an accessible provider/model ID")
    import dspy

    class Route(dspy.Signature):
        """Classify intent only. Use clarify for ambiguous targets or changes.
        A mutate label is not permission to execute anything.
        """
        request: str = dspy.InputField()
        action: Literal["read", "mutate", "clarify"] = dspy.OutputField()

    def metric(example, prediction, trace=None) -> bool:
        return example.action == prediction.action

    def examples(rows):
        return [dspy.Example(request=text, action=label).with_inputs("request")
                for text, label in rows]

    def correct(program, rows) -> int:
        return sum(metric(ex, program(**ex.inputs())) for ex in examples(rows))

    # Choose a chat model supporting this small output limit.
    # num_retries=0 does not disable every possible adapter fallback.
    dspy.configure(lm=dspy.LM(model, max_tokens=256, timeout=20,
                              num_retries=0, cache=False))
    baseline = dspy.Predict(Route)
    baseline_correct = correct(baseline, VALIDATION)
    candidate = dspy.BootstrapFewShot(
        metric=metric, max_bootstrapped_demos=2,
        max_labeled_demos=2, max_rounds=1, max_errors=1,
    ).compile(baseline, trainset=examples(TRAIN))
    candidate_correct = correct(candidate, VALIDATION)
    chosen = candidate if candidate_correct > baseline_correct else baseline
    # Freeze selection before inspecting the test set. Ties retain baseline.
    test_correct = correct(chosen, TEST)
    chosen.save("router.json")  # State only, not model weights or deployment.
    report = {
        "dspy_version": version("dspy"), "model": model,
        "dataset": "synthetic-router-v1", "validation_count": len(VALIDATION),
        "baseline_correct": baseline_correct, "candidate_correct": candidate_correct,
        "selected": "candidate" if chosen is candidate else "baseline",
        "test_correct": test_correct, "test_count": len(TEST),
    }
    Path("router-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--run", action="store_true", help="Allow billable model calls")
    args = parser.parse_args()
    check_data()
    if args.run:
        run()
    else:
        print("Toy data checks passed. No DSPy import or model calls performed.")
```

`python optimize_router.py` checks the toy splits without importing DSPy or calling a model. `python optimize_router.py --run` opts into potentially billable calls. Labels are excluded from model inputs by `with_inputs("request")`. API or parse errors fail the experiment rather than becoming silently successful examples. No improvement is guaranteed, and saving the selected artifact does not approve production deployment.

To use a saved state, instantiate the same `Route` signature with `dspy.Predict(Route)`, load `router.json`, and configure the serving model explicitly. JSON state contains demonstrations and other program state, not a complete Python application. Review it before distribution; never load untrusted pickle-based programs. Record the script revision, dependency lock, provider configuration, dataset revision, and raw per-case predictions for a real experiment.

## Production boundaries and verification

Compilation and evaluation consume calls separately from serving. Demonstrations increase prompt size; disabled response caching exposes variability but increases repeated-run cost. Output limits and optimizer rounds are not hard currency budgets. Enforce a separate budget and overall deadline before using paid providers.

The code's exact-label score demonstrates mechanics only. A real router needs grouped train/validation/test splits, mutation-risk gates, per-class errors, repeated trials, and executor authorization. Inspect generated demonstrations before serving them, and retain a baseline artifact for rollback.

The snippet's Python syntax and default no-model data checks were validated. DSPy API shapes were checked against the linked release source, but dependency installation was blocked by network resolution in the validation environment. Compilation, save/load execution through DSPy, and provider calls were not run; no live integration or quality result is claimed.
