# Reasoning controls

Reasoning controls influence how much computation a model applies before producing its answer. Providers expose different abstractions: qualitative effort levels, thinking budgets, or model-specific modes. These settings are not interchangeable across providers.

For example, this is an OpenAI Responses configuration fragment:

```json
{
  "reasoning": {"effort": "low"}
}
```

It belongs inside a complete request. Allowed values and defaults depend on the selected model; an unsupported value can be rejected. The [OpenAI reasoning guide](https://developers.openai.com/api/docs/guides/reasoning) defines the current contract. Claude has separate [thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) and [effort](https://platform.claude.com/docs/en/build-with-claude/effort) controls; Gemini documents its own [thinking configuration](https://ai.google.dev/gemini-api/docs/thinking).

## Allocate effort to the task

A narrow classification and a multi-step migration review need different levels of deliberation. Evaluate settings against representative tasks rather than increasing effort globally. Compare correctness, tool choices, output length, cost, and completion time. More computation is useful only when its measured benefit justifies the delay.

Reasoning effort differs from answer verbosity. A short answer may require substantial reasoning; a long explanation can be generated with little. Output-token limits can also interact with internal reasoning usage, depending on the API.

Provider-returned reasoning summaries are not a complete trace of internal computation. Use actual tool events and operation receipts for operational evidence. Preserve opaque reasoning or signature fields when the API requires them for continuation; treating them as ordinary editable prose can break the next request.

## Separate the ways to spend additional compute

| Strategy | What changes | Essential limitation |
| --- | --- | --- |
| More internal reasoning | Computation inside a model response | Does not by itself add external evidence |
| Sequential revision | A later call conditions on a previous answer and feedback | Can repair errors or overwrite correct work |
| Independent candidates | Several attempts start from the same authoritative task | Useful diversity still requires a reliable selector |
| Tool-grounded verification | Execution, retrieval, or another external check supplies evidence | Evidence can be incomplete, stale, or about the wrong property |
| Correction training | Training changes the model's correction behavior | Not equivalent to repeating a prompt during ordinary inference |

[Test-time compute research](https://arxiv.org/abs/2408.03314) studies how revision, sampling, and verification interact with task difficulty and budget. It does not establish that repeatedly asking for an improved answer is always the best compute allocation. Compare a longer first attempt, bounded revisions, and independent candidates on the same tasks under both comparable budgets and explicit resource limits.

[Reflexion](https://arxiv.org/abs/2303.11366) uses feedback stored in textual memory without updating weights. [SCoRe](https://arxiv.org/abs/2409.12917) instead trains multiround self-correction with reinforcement learning. Both differ from assuming an ordinary conversation automatically teaches the underlying model new parameters.

## Capability is not a stopping rule

A model's ability to generate an answer, detect an error, preserve constraints, and apply a minimal repair should be evaluated separately. Hosted product labels and reasoning settings are not interchangeable measures of model size or correction competence. A smaller model on a narrow, executable repair can be a different proposition from the same model repeatedly redesigning a system without an external verifier.

The [harmful-overthinking preprint](https://arxiv.org/abs/2606.02835) distinguishes unnecessary reasoning from a correct intermediate answer that later becomes wrong. Its oracle knowledge of a correct prefix is a diagnostic upper bound, not an available production stopping signal. Do not infer that shorter reasoning is universally safer either.

Select models and budgets using held-out task outcomes, not self-reported confidence, explanation length, or the best answer retrospectively found in a trace. For multi-call workflows, use the [evaluator–optimizer pattern](../../patterns/evaluator-optimizer-pattern.md) to preserve verified progress and the [output evaluation guidance](../../operations/evaluation/model-output-evaluation.md#evaluate-revision-trajectories) to measure repairs and regressions.


## Multi-turn review is a separate compute strategy

A sequence such as “review the implementation,” “now check security,” and “now check edge cases” allocates additional inference calls to **different review lenses over one evolving artifact**. It is not equivalent to regenerating the original answer from scratch. Evaluate it separately from a single high-effort response and from blind generic requests to “improve again.”

Session continuity is another experimental variable. A continuous session carries discoveries and also carries generated assumptions, explanations, and anchoring. A fresh session removes that conversational trajectory but can lose useful knowledge. A third strategy externalizes accepted state—brief, current artifact, decisions, evidence, tests, and unresolved risks—and gives that packet to a fresh session. This preserves durable knowledge while treating conversation as working memory rather than project memory.

Do not call fresh-session passes independent merely because the context was reset. The same model can reproduce the same blind spot, and different models can share one. Measure whether context reset changes repairs, regressions, rediscovery cost, latency, and resource use.
