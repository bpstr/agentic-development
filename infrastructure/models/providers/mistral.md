# Mistral AI

[Official model catalog](https://docs.mistral.ai/models) · [Inference documentation](https://docs.mistral.ai) · [Canonical repositories](https://github.com/mistralai)

Mistral AI develops and serves general-purpose models alongside specialized capabilities such as document OCR and speech transcription. It publishes both downloadable model artifacts and hosted services. The provider catalog also includes some third-party models, so a model being served by Mistral does not by itself identify its publisher.

The catalog distinguishes generalist, coding, embedding, OCR, and audio workloads. A document ingestion pipeline, for example, can use OCR to extract layout and text, an embedding model to index the result, and a language model to answer a later question. These are different model responsibilities and should have separate evaluation criteria.

For deployment, record the exact artifact or hosted model version and its license. The catalog includes Apache 2.0 releases as well as releases with different terms; neither a repository's code license nor one model family's license applies automatically to every model. Hosted usage is also governed by the serving service's contract.

An appropriate selection exercise is to compare extraction accuracy, tool-call validity, and end-to-end task completion on the same documents. Regional serving, retention settings, and operational availability are properties of the chosen deployment. A provider's headquarters or a model's downloadable weights do not independently establish where a particular request is processed.
