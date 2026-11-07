# Retrieval

Retrieval selects information relevant to a request from a larger collection. Its output may be documents, passages, database rows, graph paths, or source identifiers. Retrieval does not necessarily generate an answer and does not require a language model.

A useful request has three parts: an information need, an authorized search scope, and an output budget. “Find the rollback procedure for Billing” is the need; accessible workspace documents are the scope; five passages and their source locations are the budget.

Separate candidate generation from evidence selection. A fast search can produce fifty candidates, a reranker can reorder them, and a final selector can remove duplicates and enforce the context budget. If the supporting document never enters the candidate set, a later reranker cannot recover it.

Evaluate retrieval with questions and expected evidence. **Recall at k** asks whether relevant evidence appears among the first k results; ranking metrics also consider its position. Include exact identifiers, paraphrases, unanswerable questions, and denied documents.

The [Sentence Transformers retrieval examples](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html) explain embedding-based search. Choose it alongside exact and lexical lookup according to the question; semantic similarity is a relevance signal, not proof that a passage supports a claim.

## Document structure as a retrieval index

A structured document can be indexed as a hierarchy of sections with titles, summaries, and source-page references. Retrieval selects branches or sections that appear relevant, then reads their supporting content. Selection can use explicit rules, lexical signals, or model reasoning; a vector index is one possible component rather than a prerequisite.

[PageIndex](frameworks/pageindex.md) illustrates document-structure navigation. Preserving a tree does not itself recover unreadable scanned text, guarantee correct section boundaries, or prove that a selected section supports an answer. Parsing and OCR remain separate responsibilities. Record the source revision and page range behind each node, bound navigation work, and evaluate questions whose evidence spans multiple sections.

Compare this route with passage retrieval on the same evidence requirements. A whole section can preserve dependencies that a small fragment loses, but it can also add irrelevant context. For a corpus of documents, selecting the relevant document and selecting a section within it are separate retrieval decisions even when one framework implements both.
