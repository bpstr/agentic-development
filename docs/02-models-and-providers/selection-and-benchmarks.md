# Selection and benchmarks

[Handbook](../../README.md) · [Chapter](README.md)

**Sources reviewed:** 2026-09-19 · **Evidence:** benchmark-owner and provider documentation; no original benchmark results.

## Select for a job

Begin with a quality target and representative tasks. Establish a capable baseline, then try lower-cost or faster configurations while holding the target fixed. This follows the accuracy-first process in [OpenAI's model selection guide](https://developers.openai.com/api/docs/guides/model-selection).

| Workload | Useful acceptance criteria | What to measure |
| --- | --- | --- |
| Extract task fields | Correct values, valid schema, handles missing data | Exact field accuracy and invalid outputs |
| Answer project questions | Correct scope, supported claims, valid references | Answer correctness and citation support |
| Execute an update | Correct entity and change; no duplicate operation | Final application state and unnecessary calls |
| Review code | Finds actionable defects without excessive false alarms | Confirmed findings and review effort |
| Investigate a complex issue | Follows relevant evidence and reaches a supported result | Completion quality, elapsed time, and cost |

These criteria are suggested evaluation design, not provider capability claims. Include ordinary cases, ambiguity, missing permissions, tool errors, and misleading retrieved text. A model that succeeds on happy paths may still mishandle recovery.

## Read the score's conditions

Benchmarks measure a defined task under a defined setup. For software engineering, [SWE-bench](https://www.swebench.com/) evaluates resolving repository issues and publishes several distinct subsets. Its Bash Only view holds the agent environment constant, which helps separate model differences from harness differences.

[Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) evaluates tool use and includes multi-turn and agentic categories. Inspect category scores and methodology when your application depends on selecting tools and supplying correct arguments.

Neither benchmark directly establishes your product's reliability. Compare:

- Exact model ID and snapshot, not only the family name.
- Dataset version, language coverage, and task subset.
- Agent harness, tools, prompts, and available context.
- Reasoning settings, time budget, retries, and number of attempts.
- Whether results were reported by a vendor, independently run, or independently checked.

A result obtained with repeated attempts is not a first-attempt success rate. A tool-enabled result is not directly comparable to a model-only score. Vendor evaluations are useful for shortlist construction; reproduce relevant behavior before relying on it.

## Measure the system users experience

Time to first text and time to completed work answer different questions. A quick acknowledgment can precede a slow tool loop. Measure median and tail latency for the entire turn, then inspect model, tool, queue, and network spans when it is slow.

Record a reproducible configuration alongside each result. Example record layout, with placeholders rather than invented measurements:

```yaml
workload: project_status_summary
dataset_revision: summary_cases_v1
model_id: provider_exact_model_id
prompt_revision: prompt_v3
tool_schema_revision: tools_v2
reasoning_setting: provider_specific
attempts_per_case: 3
metrics:
  accepted_tasks: null
  invalid_references: null
  p50_completed_turn_ms: null
  p95_completed_turn_ms: null
  total_cost_usd: null
```

## Compare cost per useful outcome

Token prices are inputs to the calculation. Request length, cache behavior, generated output, tool fees, retries, and runtime costs determine the bill. Provider schedules distinguish these categories: [OpenAI pricing](https://developers.openai.com/api/docs/pricing), [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing), and [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing).

```text
cost per accepted task = total measured spend / accepted tasks
```

Keep a separate failure-rate measure so this ratio does not conceal unacceptable behavior. A cheap model requiring repeated repair can cost more per completed task; an expensive model is wasteful when a small one reliably meets the same target.

Route only when evaluation supports the split. For example, field extraction and open-ended investigation can use different configurations. Avoid asking the model to rate its own confidence as the sole escalation rule. Prefer observable failures such as invalid schema, unsupported references, exhausted tool budget, or failed application checks.
