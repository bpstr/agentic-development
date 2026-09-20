# Local model feasibility

A **local model** runs on hardware controlled by the application operator, including a workstation or an isolated server. Local execution can reduce network dependence and provide direct control over deployment. It does not imply that the model is small, that the runtime has no telemetry, or that all tools remain offline.

A rough lower bound for weight storage is:

```text
weight bytes ≈ parameter count × bits per stored parameter / 8
```

An 8-billion-parameter model at 4 bits needs roughly 4 billion bytes for raw parameter values alone. Quantization metadata, unquantized components, runtime buffers, and the attention KV cache add memory. [Transformers' quantization overview](https://huggingface.co/docs/transformers/main/quantization/overview) explains the tradeoff between numeric precision and resource use.

Context length and concurrency can dominate the remaining memory budget. A configuration that loads successfully may still fail when several long requests arrive. For mixture-of-experts models, active parameters per token describe computation more directly than total storage: all required expert weights still need to be accessible.

For example, evaluate a local task-labeling model using the expected input length and several simultaneous requests. Record peak memory, first-token time, sustained output rate, and classification errors. Test the exact quantized artifact, since a full-precision benchmark is not a measurement of that deployment.

Pin the model revision, tokenizer, chat template, and runtime configuration. If private processing is the goal, inspect external tools, logs, update downloads, and network access as part of the actual system boundary.
