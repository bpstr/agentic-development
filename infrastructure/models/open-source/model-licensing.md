# Model licensing

Model licensing determines the conditions attached to a model artifact. Treat model weights, inference code, training code, datasets, and adapters as separate components: they may carry different licenses. A familiar license on a repository's source code does not automatically describe the downloaded weights.

Distinguish permissive software-style licenses from model-specific agreements and additional acceptable-use policies. The [Open Source Initiative AI definition](https://opensource.org/ai/open-source-ai-definition) helps explain why “open source,” “open weights,” and “source available” should not be used interchangeably.

For example, a quantized derivative may include an Apache-licensed conversion script while retaining conditions from the original weights. A distilled model may depend on a different base-model license. The [DeepSeek-R1 repository](https://github.com/deepseek-ai/DeepSeek-R1) explicitly identifies the Qwen and Llama origins of its distilled releases; that provenance belongs in the deployment inventory.

Record the exact artifact revision, publisher's license URL, license text, upstream bases, and modifications. Examine the provisions relevant to the intended activity: running inference, redistribution, commercial hosting, fine-tuning, and distribution of derivatives. Do not infer an interpretation from a marketplace tag alone.

A useful release check is to compare the intended action with the attached terms before replacing one model with another. Retain required notices alongside redistributed artifacts. For model-specific agreements, consult the actual version—such as Meta's [Llama 4 license](https://github.com/meta-llama/llama-models/blob/main/models/llama4/LICENSE)—instead of transferring assumptions from an older family release.
