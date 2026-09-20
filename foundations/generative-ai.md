# Generative AI

Generative AI produces new content from a learned model and supplied input. Outputs can include prose, code, structured objects, images, audio, or video. Generating a plausible answer is different from retrieving an existing record: the system must establish separately whether a generated claim agrees with its sources.

A text generator typically produces tokens conditioned on earlier input and output. An embedding model instead maps input to vectors, while a classifier selects labels. Applications often combine these operations: embed a question, retrieve documents, then generate an answer from the retrieved passages. The [Transformer paper](https://arxiv.org/abs/1706.03762) describes an architecture underlying many contemporary language models; generative AI also includes other architectures.

For example, an application can supply three release notes and request a short customer announcement. The model decides the wording. Application code still chooses the source records, verifies the output contract, and decides whether to publish the result.

Generation can be probabilistic, and repeated calls need not return the same wording. Low sampling temperature does not establish factual correctness or a portable guarantee of deterministic output. Evaluate meaning, required fields, and factual support rather than exact prose unless exact text is the task.

Generative capability does not imply autonomous execution. A generated SQL statement, purchase request, or tool call remains proposed content until surrounding software validates and executes it.
