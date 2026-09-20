# Retrieval

Retrieval selects information relevant to a request from a larger collection. Its output may be documents, passages, database rows, graph paths, or source identifiers. Retrieval does not necessarily generate an answer and does not require a language model.

A useful request has three parts: an information need, an authorized search scope, and an output budget. “Find the rollback procedure for Billing” is the need; accessible workspace documents are the scope; five passages and their source locations are the budget.

Separate candidate generation from evidence selection. A fast search can produce fifty candidates, a reranker can reorder them, and a final selector can remove duplicates and enforce the context budget. If the supporting document never enters the candidate set, a later reranker cannot recover it.

Evaluate retrieval with questions and expected evidence. **Recall at k** asks whether relevant evidence appears among the first k results; ranking metrics also consider its position. Include exact identifiers, paraphrases, unanswerable questions, and denied documents.

The [Sentence Transformers retrieval examples](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html) explain embedding-based search. Choose it alongside exact and lexical lookup according to the question; semantic similarity is a relevance signal, not proof that a passage supports a claim.
