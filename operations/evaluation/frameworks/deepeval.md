# DeepEval

[Official quickstart](https://deepeval.com/docs/getting-started) · [Canonical repository](https://github.com/confident-ai/deepeval)

DeepEval supplies test cases, metrics, and a test runner for LLM applications. It can assess individual responses, conversations, and agent trajectories. Model-based metrics require a configured judge and can incur inference charges.

Install `deepeval` in a virtual environment. This adapted example uses the current quickstart's `SingleTurnParams` API; save it as `test_release.py`:

```python
from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, SingleTurnParams

def test_release_answer():
    case = LLMTestCase(
        input="Which task blocks release?",
        actual_output="T-42 blocks the release.",
        expected_output="T-42 is the release blocker.",
    )
    metric = GEval(
        name="Blocker correctness",
        criteria="The answer identifies the same blocking task as the reference.",
        evaluation_params=[
            SingleTurnParams.ACTUAL_OUTPUT,
            SingleTurnParams.EXPECTED_OUTPUT,
        ],
        threshold=0.8,
    )
    assert_test(case, [metric])
```

After configuring the selected judge's credentials, `deepeval test run test_release.py` executes the evaluation. The answer above is synthetic; replace it with actual application output to test the application.

Pin the installed package and judge configuration. Calibrate thresholds against reviewed examples, and use deterministic checks for exact IDs and permissions. Semantic similarity can help assess wording, but should not excuse an incorrect action or unsupported fact. Cloud reporting through Confident AI is a separate choice from the local test runner.
