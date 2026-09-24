# Mistral AI

[Official model catalog](https://docs.mistral.ai/models) · [Release notes](https://docs.mistral.ai/resources/release-notes) · [Canonical repositories](https://github.com/mistralai)

Mistral AI develops and serves general-purpose models alongside specialized capabilities such as document OCR and speech transcription. It publishes both downloadable model artifacts and hosted services. The provider catalog also includes third-party models, so a model being served by Mistral does not by itself identify its publisher or license.

The current featured catalog separates several roles:

- **Mistral Medium 3.5** is the frontier-class multimodal model positioned for agentic and coding workloads.
- **Mistral Small 4** is an Apache 2.0 hybrid model combining instruction following, reasoning, coding, and image input in an efficient mixture-of-experts design.
- **OCR 4.1** is a dedicated hosted document-extraction service with structural blocks, bounding boxes, and confidence information.
- **Voxtral Mini Transcribe 2** and **Voxtral Mini Transcribe Realtime** cover batch and live speech transcription respectively.

These are separate capabilities, not modes of one universal model. A document ingestion pipeline, for example, can use OCR to recover layout and text, an embedding model to index the result, and a language model to answer a later question. Likewise, realtime transcription has different latency and event requirements from batch audio processing.

For deployment, record the exact artifact or hosted model version and its license. The catalog includes Apache 2.0 releases, Mistral-specific terms, commercial hosted models, and third-party artifacts; neither a repository's code license nor one model family's license applies automatically to every model. Hosted usage is also governed by the serving service's contract.

An appropriate selection exercise is to compare extraction accuracy, tool-call validity, multimodal grounding, and end-to-end task completion on the same sources. Regional serving, retention settings, and operational availability are properties of the chosen deployment. A provider's headquarters or a model's downloadable weights do not independently establish where a particular request is processed.
