# Kimi

[Handbook](../../../README.md) · [Open-weight models](README.md)

**Sources reviewed:** 2026-09-19 · **Evidence:** publisher model card; no local inference test.

Moonshot AI's [Kimi K2.5 model card](https://huggingface.co/moonshotai/Kimi-K2.5) documents multimodal input, thinking and instant modes, tool use, deployment guidance, and published evaluations.

The card documents a **Modified MIT** license rather than plain MIT. Read the exact license and deployment notes for the artifact you intend to use.

Mixture-of-experts architecture can reduce active parameters per token, but total stored weights, runtime overhead, KV cache, context length, concurrency, and quantization still determine practical deployment requirements.
