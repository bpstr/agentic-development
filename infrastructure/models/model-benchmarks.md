# Model benchmarks

A benchmark is a standardized task set, execution harness, and scoring procedure. Its score describes performance under those conditions. The model alone is often only one component: prompts, tools, sampling, retry budgets, retrieval, and test-time computation can materially affect the result.

Two useful reference families illustrate different capabilities:

- [SWE-bench](https://www.swebench.com/) evaluates software issue resolution against repository tests. Its variants and harness choices matter when comparing coding systems.
- [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) evaluates function-calling behavior across structured tasks, including increasingly agentic settings. Read the specific benchmark version and evaluation method.

For every comparison, record the dataset version, model revision, permitted tools, number of attempts, and metric. **Pass@1** concerns success on one sampled attempt; allowing multiple attempts and selecting a successful result measures a different operating budget. A result from a full coding harness should not be compared as though it were a bare model's answer to a single prompt.

For example, a high issue-resolution score may justify testing a model for repository maintenance. It does not establish low-latency task classification, accurate Hungarian extraction, or safe authorization decisions. Build those checks from the application's actual workload.

Beware narrow score gaps without uncertainty estimates, private evaluation sets that cannot be reproduced, and contamination from public tasks entering training data. Prefer reproducible methodology and failure analysis over a single ranking. Benchmarks support selection; they do not replace application acceptance criteria.
