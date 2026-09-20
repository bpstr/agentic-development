# DeepSeek open-weight models

[Canonical DeepSeek-R1 repository](https://github.com/deepseek-ai/DeepSeek-R1) · [DeepSeek-R1 paper](https://arxiv.org/abs/2501.12948)

DeepSeek-R1 is a reasoning-model release accompanied by smaller distilled models. Distillation trains another model from generated examples or other teacher signals; a distilled checkpoint is a different deployment artifact with its own architecture and capabilities. It should not inherit the full model's benchmark results by association.

The publisher documents inference settings and separately reports results for the full and distilled releases. Its evaluation setup uses explicit generation budgets and sampling settings. Reproduce the relevant conditions before comparing a local deployment with a published score.

For example, a small distilled model may be a feasible candidate for mathematical classification or constrained reasoning on local hardware. Test it on missing premises, contradictory statements, and output-budget exhaustion as well as ordinary problems. Long reasoning output can consume time and tokens without producing a usable final answer.

The repository licenses its code and weights under MIT and identifies the upstream Qwen or Llama bases of distilled variants. Preserve that provenance and inspect applicable upstream terms for the actual artifact. The tokenizer and configuration can also differ from the base release; use the distilled release's documented settings.

A hosted endpoint called “DeepSeek” may serve a different family member or revision. Record the complete model identifier, runtime, quantization, and prompt template when reporting results. Open weights make independent deployment possible; they do not make all implementations behaviorally equivalent.
