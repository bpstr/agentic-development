# Chunking

Chunking divides source material into retrieval units. The aim is to preserve enough context for a passage to be understandable while keeping each unit selective and inexpensive to retrieve.

Begin with meaningful structure: headings, paragraphs, functions, or table sections. A fixed token window is easy to implement but can cut a sentence from its qualification or a table row from its column headers. Small chunks improve precision only when the missing surrounding context is recoverable.

For a migration runbook, a useful chunk might contain the “Rollback prerequisites” heading, its full checklist, and a source location. Store the document ID and section path separately so the application can expand to adjacent passages when needed.

Overlap reduces boundary losses but increases duplicate text and storage. Evaluate whether retrieved chunks repeatedly say the same thing while omitting another needed step. Parent-child retrieval can search compact units and then fetch a larger source section for generation.

LlamaIndex's [node parser documentation](https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/) describes splitting strategies and structured retrieval units. The correct size depends on document structure, embedding input limits, expected questions, and available context.

Keep a chunking revision in the index. Changing separators or overlap changes chunk identities and citation locations; publish the new generation coherently instead of leaving old and new fragments intermingled.
