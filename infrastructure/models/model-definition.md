# Model definition

A **model** is a parameterized computational system that transforms an input into an output. Training estimates its parameters; inference applies those parameters to new inputs. A language model estimates token sequences, an embedding model produces vector representations, and an image generator produces visual content. The broader term **foundation model** describes a model trained broadly enough to be adapted to many downstream tasks. See the [foundation-model research report](https://arxiv.org/abs/2108.07258).

For a language model, the deployable artifact includes more than weights. Its architecture, tokenizer, input formatting, generation configuration, and sometimes modality-specific encoders determine what a runtime can execute. Transformer models use attention to relate representations across a sequence; the [original Transformer paper](https://arxiv.org/abs/1706.03762) introduces that architecture.

Keep neighboring responsibilities distinct:

- A **provider** serves inference and defines an API contract.
- A **gateway** routes or translates requests between providers.
- An **agent runtime** combines model decisions with tools, state, and execution rules.

For example, a model may emit a request to `lookup_document`. It does not gain database access from knowing that tool's name. The application supplies the tool schema, authorizes access, executes the lookup, and returns a result.

A model identifier alone therefore does not describe an application. Record the serving endpoint, model revision, prompt format, available tools, and runtime behavior when reproducing an outcome. Changing any of these can change the result even when the displayed model name stays the same.
