# Protocol translation

Protocol translation maps requests, responses, and lifecycle events between two interfaces. For model APIs, this can include message roles, content blocks, tool definitions, tool results, streaming events, stop reasons, and usage fields.

Syntactic compatibility is weaker than semantic compatibility. A bridge can return valid JSON while losing information needed for the next agent step. One format may represent a tool call as a typed content block, while another uses a separate output item and correlation identifier.

## Preserve the conversation contract

A useful translation test sends a request that produces a tool call, returns its result, and continues generation. Verify that the bridge preserves:

- the intended tool name and complete arguments;
- a stable identifier connecting call and result;
- multiple or concurrent calls where supported;
- streamed partial arguments without executing them prematurely;
- terminal state, errors, and cancellation;
- available usage information without inventing missing values.

For example, converting a tool result into ordinary user text may appear to work once while discarding the provider's tool-result semantics. Similarly, translating a reasoning control into temperature because both are numeric is not a meaningful mapping.

Document unsupported features explicitly and reject incompatible requests when silent degradation would change behavior. A compatibility endpoint cannot supply tools, modalities, or execution guarantees the upstream service lacks.

Use each provider's actual schema as the source of truth: [Anthropic Messages](https://platform.claude.com/docs/en/api/messages) and [OpenAI Responses](https://developers.openai.com/api/reference/resources/responses/) illustrate distinct object models.
