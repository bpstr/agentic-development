# Kimi open-weight models

[Canonical Kimi K3 repository](https://github.com/MoonshotAI/Kimi-K3) · [Kimi K3 technical report](https://github.com/MoonshotAI/Kimi-K3/blob/main/k3_tech_report.pdf) · [Kimi K3 License](https://github.com/MoonshotAI/Kimi-K3/blob/main/LICENSE)

Kimi is Moonshot AI's model family. **Kimi K3** is the current documented open-weight release: a native multimodal, mixture-of-experts model with 2.8 trillion total parameters, 104 billion activated parameters, and a 1,048,576-token context window. The publisher describes Kimi Delta Attention, Attention Residuals, a MoonViT-V2 vision encoder, and long-horizon coding and agentic knowledge-work capabilities. These are model specifications and publisher claims, not measurements performed by this repository.

The K3 repository describes text, image, and video understanding in its feature overview, while its model-summary table lists text and image modality. Verify the exact processor, checkpoint, and serving runtime before assuming that every deployment path accepts the same media types. Tool use likewise requires an application or harness to expose schemas, execute calls, and return results; loading the weights alone does not create a coding agent.

## Deployment boundary

K3's sparse activation does not make the full checkpoint equivalent to a 104B-parameter model for storage or loading. A deployment must still accommodate the released weights, selected precision or quantization, runtime-specific caches, and distributed execution requirements. Pin the artifact revision together with the tokenizer, processor, configuration, prompt/tool template, and inference runtime. Validate support for the exact revision rather than relying only on an OpenAI-compatible HTTP surface.

Hosted Kimi API availability and downloadable weights are separate release inventories. A hosted model name does not prove that identical weights are published, and a local checkpoint does not guarantee parity with the provider's hosted tool parser, serving optimizations, or multimodal path.

## License

Kimi K3 uses the **Kimi K3 License**, not MIT or Apache 2.0. The license grants broad rights but adds commercial conditions. In particular, a licensee or affiliate operating a Model-as-a-Service business above the stated aggregate-revenue threshold must obtain a separate agreement from Moonshot AI before commercial use, and very large commercial products can trigger a visible Kimi K3 attribution requirement. Read the current license for the exact thresholds, definitions, exceptions, and obligations rather than inferring terms from earlier Kimi releases.

For evaluation, preserve the exact checkpoint and runtime configuration and test the intended workload end to end: source understanding, long-context retrieval, tool-call validity, repository edits, and verification. Treat quantized or third-party served derivatives as separate configurations with their own precision, context, processor, and tool behavior.
