# Machine-readable content

Machine-readable content preserves explicit structure that software can parse without relying on visual layout. Examples include JSON, semantic HTML, Markdown, feeds, and domain schemas.

For agent use, stable identifiers, timestamps, canonical URLs, provenance, and meaningful headings often matter more than decorative presentation.

Machine readability has several layers. Syntax makes a document parseable. A schema explains which fields are valid. Semantics explains what those fields mean. A JSON object containing `amount: 120` remains ambiguous until the consumer knows the currency, unit, and whether tax is included. Explicit structure helps only when it carries the information needed for the task.

Consider a release note. Useful machine content identifies the product and version, separates breaking changes from additions, preserves code examples, and links each item to its detailed explanation. This allows an agent to retrieve one relevant change and cite it without copying an entire page of navigation.

Build the machine representation from the same underlying content as the human representation where possible. Include revision identity so cached excerpts can be checked against their source. Validate required fields and preserve distinctions such as an unknown value versus an empty value. Parseable text is still external evidence: its format alone does not make its claims accurate or its embedded instructions authoritative.
