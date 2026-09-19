# Model selection

[Handbook](../../../README.md) · [Chapter](../README.md)

Start from the workload rather than a leaderboard. Define representative tasks, expected outcomes, tool permissions, latency limits, and cost constraints before choosing candidates.

1. Eliminate models that cannot support the required modality, context, tools, region, or deployment mode.
2. Test a capable baseline on real tasks.
3. Add cheaper or faster candidates for bounded workloads.
4. Measure completed-task quality, retries, tool calls, latency, and total cost.
5. Re-run the same cases after model or prompt changes.

Provider marketing and public benchmarks are useful for creating a shortlist, not deciding production behavior. See [benchmarks](benchmarks.md).
