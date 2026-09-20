# Embeddings

An embedding maps an input to a numerical representation used for comparison or downstream computation. Text retrieval commonly uses dense vectors, while sparse representations contain mostly zero-valued features. Images, audio, and code can also have embeddings.

A vector's coordinates have meaning only within the model and preprocessing scheme that produced them. Two 768-dimensional models do not necessarily share a usable vector space. A query must use a compatible encoder and the same intended task configuration as the stored documents.

```json
{
  "source_id": "runbook-billing",
  "revision": "12",
  "embedding_model": "example-encoder-v2",
  "dimensions": 384,
  "preprocessing_revision": "sections-v3"
}
```

This metadata example identifies an embedding generation; it does not contain the vector itself.

Similarity metrics include cosine similarity, inner product, and Euclidean distance. Choose the metric expected by the model and index. Normalization can change how those metrics relate. The [Sentence Transformers documentation](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html) describes supported similarity functions.

Plan model changes as index migrations: build compatible new representations, compare retrieval quality, and switch queries coherently. Do not silently mix old and new vectors. Evaluate multilingual text, domain terminology, and long documents separately. Embeddings compress information; similarity alone cannot establish exact equivalence, current truth, or permission to expose a source.
