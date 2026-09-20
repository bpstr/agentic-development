# Agent knowledge

Agent knowledge is information an application makes available for reasoning and action. It includes supplied context, retrieved documents, durable memories, and observations from tools. A model's learned parameters are another source of information, but cannot establish the current state of an external system.

Keep three responsibilities separate:

- **Systems of record** own current business facts, such as a task's status or an invoice's balance.
- **Knowledge indexes** help locate relevant passages, entities, and relationships.
- **Model context** contains the bounded information selected for one inference call.

For example, answering “Why did we postpone release R7?” may require retrieving a decision document. Answering “Is R7 still postponed?” should read the release record. A graph can connect both sources without becoming the authority for either.

A practical evidence record includes a stable source ID, revision, location, owner, access scope, and content. Derived claims should retain their supporting source IDs and extraction method. This permits an answer to distinguish a recorded fact, a historical statement, and an inference.

Retrieval-augmented generation connects selected external evidence to generation; the [original RAG paper](https://arxiv.org/abs/2005.11401) describes this separation. Adding more retrieved text does not automatically improve an answer: relevance, freshness, authorization, and contradictions matter as much as volume.
