# Prompts and instructions

A prompt is the input assembled for a model call. Instructions are the portions that specify goals, behavior, constraints, and response requirements. The rest may contain examples, conversation, documents, tool results, or other evidence. Treating all these inputs as equally authoritative makes the system difficult to control.

State a task in observable terms. “Be helpful” gives little guidance about what a successful response must contain. A more useful application instruction is:

```text
Explain the release blockers using the supplied records.
For each blocker, cite its task ID and supporting evidence.
Separate confirmed blockers from missing information.
Return a short overview followed by actionable findings.
```

This is an illustrative instruction, not a provider request schema. Place it in the instruction field or role supported by the chosen API. [OpenAI's prompting documentation](https://developers.openai.com/api/docs/guides/prompt-engineering) explains message roles, examples, and instructions for its APIs.

Examples help define ambiguous output conventions, but should cover realistic variation. Include an empty result, conflicting evidence, and incomplete input when those occur in the product. A schema enforces shape more reliably than prose alone; business rules still need application validation.

Version prompts together with tool schemas and evaluation cases. A wording change can affect tool choice, clarification behavior, and answer length. Keep retrieved content distinct from trusted instructions, and never rely on a prompt to enforce access control that the tool implementation should check.
