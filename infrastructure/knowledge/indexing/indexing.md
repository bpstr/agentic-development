# Knowledge indexing

Indexing prepares source information for efficient retrieval. It can create inverted indexes, embeddings, graph structures, summaries, or several representations of the same material. The source remains authoritative; an index is a maintained derivative.

A reliable indexing record includes source ID, revision or hash, parser version, chunking version, embedding model, and completion state. Keep the source's update time separate from the time the index processed it.

For a runbook revision, parse the content, build retrieval units, attach access metadata, generate the required representations, and publish the completed generation. Queries should not observe a partially replaced document with some old chunks and some new ones.

LlamaIndex's [ingestion pipeline](https://developers.llamaindex.ai/python/framework/module_guides/loading/ingestion_pipeline/) demonstrates transformations, caching, and document management. These components support an ingestion system but do not define the complete synchronization policy for an external application.

Make failures inspectable. An accepted queue job is not proof that a document is searchable. Distinguish queued, processing, complete, and failed states, and retain the source revision associated with each attempt.

Index only representations needed by real queries. Graph extraction and summaries add cost and maintenance obligations beyond passage embeddings. Establish a baseline and measure whether each additional representation improves useful retrieval enough to justify its processing and storage.
