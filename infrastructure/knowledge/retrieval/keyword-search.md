# Keyword search

Keyword or lexical search finds documents through their terms. Full-text engines usually tokenize input, normalize words, maintain an inverted index, and rank matching documents. BM25 is a common relevance function; exact identifier lookup is a separate operation that may need no full-text engine.

Lexical search works well for exception names, ticket IDs, product names, and quoted phrases. Tokenization determines what survives: treating `APP-42` as one identifier can produce different results from splitting it into `APP` and `42`.

[PostgreSQL full-text search](https://www.postgresql.org/docs/current/textsearch-intro.html) provides `tsvector`, `tsquery`, and the `@@` matching operator. This SQL example demonstrates normalized term matching:

```sql
SELECT to_tsvector('english', 'Pause billing jobs before rollback')
       @@ plainto_tsquery('english', 'billing rollback') AS matches;
```

Use the same language configuration for indexing and querying. Apply stemming carefully to source code and identifiers; a natural-language tokenizer is not a symbol index. Keep exact fields available where punctuation and case carry meaning.

Lexical relevance is limited by wording. A query for “revert migration” can miss a passage that only says “restore the snapshot.” Synonym rules, query expansion, or hybrid search can bridge that gap. Evaluate expansions against false matches, especially when one ambiguous term has several meanings in the corpus.
