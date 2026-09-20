# Semantic search

Semantic search retrieves information by meaning, so a query can match a passage without sharing its exact wording. A common implementation embeds queries and documents into a compatible vector space and ranks candidates by a distance or similarity function.

For example, “undo a failed schema change” may retrieve a document titled “Database migration rollback.” This is useful when users and authors describe the same concept differently. It may perform poorly on exact error codes, unfamiliar product identifiers, or distinctions dominated by a single negation.

Query and document representations must follow the embedding model's instructions. Some models use different prefixes or encoders for queries and passages. Equal vector dimensions alone do not make two models compatible. [Sentence Transformers' semantic search guide](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html) distinguishes symmetric search from asymmetric question-to-passage retrieval.

Store model identity and preprocessing revision with the index. Rebuild or version the index when these change. Apply the authorized scope to the actual retrieval path, then inspect whether filtering reduces the number of useful candidates.

Compare semantic search with a lexical baseline on your corpus. Measure retrieved evidence, not just fluent answers. Combining both methods often handles paraphrases and precise identifiers better, but the benefit must exceed the additional latency and operating complexity.
