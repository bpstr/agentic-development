# Ragas

[Official documentation](https://docs.ragas.io/en/stable/) · [Quickstart](https://docs.ragas.io/en/stable/getstarted/quickstart/) · [Canonical repository](https://github.com/vibrantlabsai/ragas)

Ragas provides evaluation and experimentation tools for AI systems, including retrieval-augmented generation and agent tool use. Its metrics distinguish qualities such as retrieved-context relevance, evidence coverage, and whether an answer is supported by the supplied context.

Start with the current quickstart, install the project dependencies, and configure only the models required by the selected metrics. Assemble cases containing the question, application response, retrieved passages, and reference information where the metric requires it. The required fields vary; do not treat every metric as reference-free.

For a release-policy question, evaluate whether retrieval found the relevant policy section separately from whether generation followed it. A faithful answer based on an obsolete document can still be wrong for the user's current question, so include revision and freshness checks outside the metric.

Inspect failures by stage before combining scores. Context recall, faithfulness, and task completion represent different properties and should not become an unexplained average.

Some evaluations use model or embedding APIs, and generated test data can introduce judge-related bias. Record adapter versions, judge models, datasets, and scoring configuration. Use reviewed real cases to calibrate synthetic coverage. A successful RAG metric does not establish tenant isolation, exact business-rule compliance, or mutation correctness.
