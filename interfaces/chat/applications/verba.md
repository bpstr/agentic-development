# Verba

[Official repository](https://github.com/weaviate/Verba) · [Archived usage guide](https://github.com/weaviate/Verba/blob/main/README.md) · [Technical notes](https://github.com/weaviate/Verba/blob/main/TECHNICAL.md)

Verba, also called the Golden RAGtriever, is a document-question-answering [chat application](../chat-interfaces.md) built around Weaviate. Its interface exposes ingestion configuration, retrieved chunks, and generated responses, making it useful as a reference for how a complete [RAG workflow](../../../infrastructure/knowledge/rag/rag-definition.md) is assembled.

**Maintenance status:** the [upstream notice](https://github.com/weaviate/Verba/blob/70b6cfb8ef59c9f178ffccfaf3aadcf737757a18/README.md) says the project is discontinued and archived, with no further updates, bug fixes, or security patches. Treat this as a historical implementation to inspect or maintain in a fork. Existing examples are not a supported production deployment recipe.

## Components and data flow

Verba imports source content, applies a configured chunker and embedding model, stores searchable data in Weaviate, retrieves matching chunks, and passes them to the selected generator. Its interface can show the retrieved material separately from the answer.

Weaviate is a required architectural dependency, including for local use. The Local deployment runs embedded Weaviate; Docker, managed Weaviate, and custom-instance connections are other documented options. Embedded deployment is experimental and unsupported on Windows in the archived guide.

Generation and embeddings are separate choices. Selecting a local generator does not make remote embedding or ingestion services local. Keep embedding dimensions consistent across indexing and queries, and re-ingest when changing incompatible models.

## Inspect the archived implementation

At [revision `70b6cfb8ef59`](https://github.com/weaviate/Verba/commit/70b6cfb8ef59c9f178ffccfaf3aadcf737757a18), [package metadata](https://github.com/weaviate/Verba/blob/70b6cfb8ef59c9f178ffccfaf3aadcf737757a18/setup.py) declares `goldenverba` 2.1.3 and Python `>=3.10,<3.13`. An isolated source checkout preserves which application code is being evaluated:

```bash
git clone https://github.com/weaviate/Verba.git
cd Verba
git checkout 70b6cfb8ef59c9f178ffccfaf3aadcf737757a18
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -e .
```

Configure a supported embedding provider and generator using the archived README's environment-variable table. For Ollama, this includes a reachable `OLLAMA_URL` and the selected, downloaded generation and embedding models. Other providers require their own credentials.

```bash
verba start --host 127.0.0.1 --port 8000
```

Open `http://localhost:8000`. Choose Local only on a supported system, or connect an appropriate Weaviate instance through the deployment screen. The checkout pins application source, not all remotely downloaded artifacts or future dependency behavior; maintaining compatibility is now the operator's responsibility.

## Ingest and ask

The archived UI workflow is:

1. Select the Weaviate deployment and verify the connection.
2. Open **Import Data → Add Files** and upload a small text document.
3. Review the file's **Overview** and **Configure** settings, select the chunking/embedding path, and complete ingestion.
4. Open **Chat**, choose the retrieval/generation configuration, and ask a question with a known answer in that document.
5. Inspect the retrieved chunks and compare the generated answer with the source.

A file being accepted does not establish that scans, tables, or images were understood. Begin with readable text, then evaluate each additional parser or modality separately. Inspect evidence coverage before changing prompts.

## Deployment and feature boundaries

The archived README explicitly places multi-user collaboration, agentic RAG, and GraphRAG outside scope; it lists reranking and an evaluation interface as planned. Do not describe roadmap entries as delivered capabilities or infer a shared enterprise knowledge service from the presence of a web interface.

The [archived Compose file](https://github.com/weaviate/Verba/blob/70b6cfb8ef59c9f178ffccfaf3aadcf737757a18/docker-compose.yml) enables anonymous Weaviate access and publishes database ports. Network exposure, authentication, dependency updates, and backup/restore need an explicit maintained design before adapting it beyond isolated evaluation.

Verba uses a [BSD 3-Clause license](https://github.com/weaviate/Verba/blob/70b6cfb8ef59c9f178ffccfaf3aadcf737757a18/LICENSE). The license permits reuse under its terms; it does not supply ongoing support or guarantee compatibility with current Weaviate, model APIs, or ingestion services.
