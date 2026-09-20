# Model selection

Model selection chooses the least expensive configuration that meets a workload's quality and operational requirements. The configuration includes the model, reasoning settings, prompt, tools, and serving environment. Selecting only a name hides differences that often dominate real performance.

Start with a representative workload and explicit acceptance criteria. A task router might need a valid label within a short deadline; an architecture review may justify more latency for detecting a costly design error. [OpenAI's selection guide](https://developers.openai.com/api/docs/guides/model-selection) similarly recommends meeting an accuracy target before optimizing cost and latency.

1. Eliminate candidates that lack required modalities, tool behavior, deployment options, or context capacity.
2. Establish a capable baseline on ordinary cases and consequential failures.
3. Evaluate cheaper or faster configurations using the same tasks and permissions.
4. Compare completed-task quality, total tool calls, retries, end-to-end latency, and cost.
5. Recheck the selected configuration after changing prompts, tools, models, or providers.

For example, let a small model categorize a support request into five known queues. Escalate ambiguous cases to a stronger model using a deterministic condition such as conflicting evidence or a failed validation rule. A model's self-reported confidence alone is a weak escalation trigger unless calibrated against outcomes.

Include routing overhead and escalation frequency in the comparison. A two-model cascade that usually escalates can be slower and more expensive than using the stronger model once. Public [benchmarks](model-benchmarks.md) help form a shortlist; application [evaluation](model-evaluation.md) decides whether the configuration is suitable.
