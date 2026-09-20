# Context windows

A context window is the bounded sequence capacity a model can process during inference. It is usually expressed in tokens, but providers also specify how images, audio, reasoning, and generated output count toward request limits. A model can have a large overall window and a smaller maximum output length.

Instructions, conversation history, tool definitions, retrieved text, and tool results all compete for that capacity. A stored conversation identifier does not mean the model can attend to unlimited history: the serving system still has to select, truncate, or compact the material used for each inference.

For example, adding a hundred files to a debugging request may fit the advertised limit but bury the failing function among unrelated code. Loading the relevant dependency path and targeted test output can produce a more useful request with fewer tokens.

Capacity does not guarantee uniform retrieval quality. [Lost in the Middle](https://arxiv.org/abs/2307.03172) found that the position of relevant information affected results in the models it studied. Treat that as motivation to evaluate the chosen model and workload, not a fixed performance rule for every newer model.

Distinguish the maximum accepted request from the amount that is useful, affordable, and fast enough. Measure task accuracy across realistic lengths, evidence positions, and distractors. Reserve output capacity and handle limit errors before starting another tool round.
