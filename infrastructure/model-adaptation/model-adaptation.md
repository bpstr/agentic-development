# Model adaptation

Model adaptation changes a pretrained model or its reusable configuration for a particular domain or workload. Weight adaptation includes supervised fine-tuning, preference optimization, and reinforcement learning. Parameter-efficient methods train a smaller set of additional parameters. Prompt optimization instead changes the instructions or examples supplied at inference time; it does not update the model's weights.

Choose the intervention from observed failures. Missing current facts usually calls for retrieval. Missing actions calls for tools. Repeated misclassification, inconsistent output conventions, or failure to follow a stable domain procedure may justify training. A smaller model that cannot reliably solve the task may need a stronger baseline before adaptation becomes useful.

For example, an incident router can first combine a prompted model with current team ownership data. If routing errors consistently concern domain-specific ticket language, collect representative tickets and accepted labels, then compare a tuned model against that baseline on untouched incidents.

Keep the base checkpoint, tokenizer, dataset revision, training configuration, and serving configuration together as one reproducible release. An adapter remains dependent on its compatible base model. [LoRA](https://arxiv.org/abs/2106.09685) illustrates how small trainable matrices can adapt a frozen model.

Adaptation can improve the target task while weakening unrelated behavior. Evaluate both the intended gain and regressions, including tool selection and refusal behavior when those affect the application.
