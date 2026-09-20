# Graph retrieval

Graph retrieval selects evidence using entities and relationships. A common approach resolves the query to seed entities, explores bounded neighborhoods, ranks candidate paths or facts, and includes the original supporting passages.

Define a traversal budget: permitted edge types, maximum depth, candidate count, and evidence tokens. Unbounded traversal through a highly connected node can return most of the graph without improving relevance.

For “Which incidents involved services blocking R7?”, begin with the release's current blockers, follow task-to-service links, then retrieve incident evidence for those services. Do not infer that every incident involving those services caused the release delay.

Microsoft's [local search](https://microsoft.github.io/graphrag/query/local_search/) combines graph context with source text. This illustrates why the evidence is richer than a list of neighboring node names.

Apply authorization to nodes, edges, and source passages. A visible document must not reveal an inaccessible project's name through an extracted relationship. Generated summaries and cached paths need compatible access boundaries too.

Inspect retrieval output before evaluating the answer. Record seed resolution, selected paths, supporting passages, and dropped candidates. If the wrong entity was chosen first, improving the final language model will not fix the graph traversal. Use source-backed paths to help users understand why a result was considered relevant.
