# Benchmarks and evaluations

A benchmark measures a defined task under a defined harness. It does not automatically predict performance in your application.

Useful public sources include [SWE-bench](https://www.swebench.com/) for software-engineering tasks and the [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) for tool-calling evaluations. Read the harness, model version, tool configuration, and scoring method before comparing numbers.

For application decisions, build a regression set containing ordinary successful cases, ambiguous inputs, missing information, denied actions, tool failures, long-context cases, and cases where plausible-but-wrong output matters.

Record exact model IDs and settings. Keep public benchmark evidence separate from your own application evaluation results.
