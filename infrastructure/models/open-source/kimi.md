# Kimi open-weight models

[Canonical Kimi K2.5 repository](https://github.com/MoonshotAI/Kimi-K2.5) · [Publisher model card](https://huggingface.co/moonshotai/Kimi-K2.5)

Kimi is Moonshot AI's model family. Kimi K2.5 is a documented open-weight multimodal release combining text and visual input with instant and thinking modes. Its publisher repository and model card provide architecture details, evaluation results, and serving guidance. Newer hosted Kimi offerings belong to a separate availability decision.

The relevant capability here is running a downloadable model under a selected inference runtime. Tool use still requires the application to expose schemas, execute calls, and return results. Agent-swarm demonstrations include orchestration beyond merely loading model weights.

For a visual coding assistant, evaluate whether the chosen deployment interprets a screenshot correctly, proposes valid edits, and uses repository tools consistently. Use the publisher's supported processor and prompt template; replacing them with a generic text-only template can break multimodal inputs or reasoning continuation.

K2.5 uses a mixture-of-experts architecture. Fewer active parameters per token do not make total weights or long-context caches disappear, so follow the model card's deployment guidance before planning workstation inference. Verify runtime support for the exact model revision rather than relying only on a familiar HTTP interface.

The publisher identifies the code and weights as **Modified MIT**. Read that license directly; it is not interchangeable with plain MIT. Evaluate a quantized or third-party served derivative as its own configuration, including its precision, context limit, and tool parser.
