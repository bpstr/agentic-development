# Structured output

Structured output constrains an answer to a machine-readable shape. It is useful for classification, extraction, routing, and generating typed UI data. JSON validity only establishes syntax; schema conformance additionally constrains fields and values. Neither establishes factual correctness.

For example, an issue classifier might require this JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["authentication", "billing", "other"]
    },
    "needs_review": {"type": "boolean"}
  },
  "required": ["category", "needs_review"],
  "additionalProperties": false
}
```

The schema is a data contract; it is not a complete provider request. Configure it through the selected API's output-format field. Supported JSON Schema subsets and refusal behavior differ. [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Claude structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output).

## Validate meaning after shape

The object `{"category":"billing","needs_review":false}` can satisfy the schema while misclassifying an authentication issue. Evaluate labels against examples from the real domain. Validate extracted dates, identifiers, and amounts against business rules before writing them to the database.

Design a representation for missing evidence, such as a nullable value or explicit uncertainty field. Requiring every field without an “unknown” representation encourages unsupported guesses.

Use structured output for an answer that software consumes. Use tool calling when the model requests an operation. A schema that contains `"send_email": true` does not authorize or execute an email; the application must still decide whether that operation is permitted.
