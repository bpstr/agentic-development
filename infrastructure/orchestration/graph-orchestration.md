# Graph orchestration

Graph orchestration represents executable steps as nodes and transitions as edges. Nodes consume state and return updates; edges specify which node runs next. Conditional edges select a route, and joins combine results from parallel branches.

A graph can contain cycles, such as a model/tool loop, or remain acyclic, such as extract → validate → publish. A knowledge graph stores relationships about a domain; an execution graph describes how work proceeds. They solve different problems.

For a document review, separate checks for citations and formatting can run concurrently. A join should record both results before selecting revision or approval. Define whether one failed branch stops the whole run, is retried, or produces a partial result.

State merging is part of correctness. If two nodes append findings, use an explicit merge rule. If two nodes edit the same document version, detect a conflict rather than allowing whichever finishes last to overwrite the other.

Choose a graph when branches, joins, loops, and resumable checkpoints make the process easier to inspect. A graph drawing does not establish durability or improve model reasoning by itself. [LangGraph's graph API](https://docs.langchain.com/oss/python/langgraph/graph-api) documents nodes, edges, reducers, and control flow as concrete primitives.
