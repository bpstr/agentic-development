# Synthetic data

Synthetic data is generated rather than directly collected from real-world observations. For agent development it can include user requests, conversations, labels, tool traces, malformed inputs, or simulated environment events. Generation may use templates, executable simulators, language models, or combinations of them.

Start from a coverage specification: which intents, languages, failure modes, and boundary conditions are missing? Generate candidates, validate their structure and correctness, remove duplicates, and inspect the resulting distribution. [Self-Instruct](https://arxiv.org/abs/2212.10560) demonstrates a pipeline that generates instructions and examples, filters them, and uses the retained data for model adaptation.

For a calendar agent, a simulator can generate conflicting meetings and known free slots. A model paraphrases the user's scheduling request, while deterministic calendar logic supplies the expected availability. This separates varied natural language from an answer that can be checked independently.

Keep generator configuration, source assumptions, and validation results with each dataset revision. Split by underlying scenario before producing paraphrases so variants of one case do not contaminate both training and evaluation.

Synthetic examples can reproduce systematic errors or omit behavior the generator does not know. A second model's agreement is insufficient evidence of correctness. Use authoritative rules or execution checks where possible, and retain a separate set of real cases to measure transfer to the intended workload.
