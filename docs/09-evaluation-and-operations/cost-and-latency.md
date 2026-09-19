# Cost and latency

[Handbook](../../README.md) · [Chapter](README.md)

Measure the **cost of a successfully completed task**, alongside its completion time. A cheaper model may need extra calls or produce more failures; a stronger model may finish in fewer steps. Neither relationship is guaranteed. Compare the same representative tasks and quality requirements.

## Account for the entire run

For a run containing several model and tool calls, an accounting model is:

```text
run cost = sum of model usage charges
         + tool and search charges
         + runtime, sandbox, and storage charges
         + retrieval and observability charges

cost per successful task = total evaluated spend / successful tasks
```

This is an accounting structure, not a provider pricing formula. Providers differ in their input, output, cached-token, reasoning, image, audio, tool, and runtime billing. Use their current pricing documentation and recorded usage fields; avoid counting a token category twice when it is a subset of another category. The Agents API, for example, separately points to model, tool, and hosted-container rates. [Current billing references](https://developers.openai.com/api/docs/guides/agents-api/overview#pricing).

Include failed attempts, retries, routing calls, and graders in the applicable budget. For a user-facing operation, distinguish the cost of serving the task from the additional cost of evaluating it.

## Measure time at meaningful boundaries

Capture acknowledgement time, first useful answer time, completed action time, and final rendering time. Report distributions such as median and p95 alongside success rate and sample size. A quick HTTP acknowledgement does not mean the requested work is complete.

Use a [trace](tracing.md) to distinguish queue wait, context retrieval, provider calls, tool execution, and delivery. For parallel work, latency follows the critical path; total resource consumption can still grow. Reducing an operation outside that path may save money without reducing completion time.

## Optimize the measured bottleneck

| Observation | Candidate improvement | What to verify |
| --- | --- | --- |
| Too many serial model calls | Combine compatible steps or use deterministic code | Task correctness and retained validation |
| Large repeated context | Bound history, retrieve focused content, use supported prompt caching | Cache hits, freshness, and recall quality |
| Slow independent reads | Run them concurrently within limits | Provider rate limits and total cost |
| Long generated output | Request the amount of detail the interface needs | Completeness and first useful text |
| Worker queue dominates | Adjust capacity and concurrency | Downstream saturation and retry rates |
| Provider calls dominate | Compare model/provider settings on the same cases | Quality, p95 latency, error rate, and cost |

OpenAI documents reducing requests, parallelizing independent operations, and limiting unnecessary output among latency techniques. [Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization). Streaming can improve perceived responsiveness while generation continues; it does not by itself remove execution work. [Anthropic's latency guide](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency).

## Distinguish two kinds of caching

**Prompt caching** reuses provider-side processing of matching input prefixes, subject to the provider's rules. It does not mean reusing a previous final answer. Cache eligibility, lifetime, and billing differ. [OpenAI prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) · [Anthropic prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching).

**Application answer caching** returns a stored result. Its key and invalidation rules must account for tenant, permissions, relevant data versions, and freshness. Semantic similarity alone cannot establish that two requests have the same authorized answer. Never replay a mutation because its request resembles an earlier one.

Set per-run time, step, spend, and delegation limits, plus account or workspace budgets. Stop cleanly with a recorded outcome when a limit is reached. Evaluate routing and fallback policies with the same discipline as the primary agent: extra classifiers and judges also consume time and money.

**Source review:** 2026-09-19. No prices, throughput claims, or provider rankings are frozen here; no paid evaluation was run.
