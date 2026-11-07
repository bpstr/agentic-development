# Flowise

[Official documentation](https://docs.flowiseai.com/) · [Repository](https://github.com/FlowiseAI/Flowise) · [Maintainer retirement announcement](https://github.com/FlowiseAI/Flowise/discussions/6727)

Flowise is a visual platform for assembling Chatflows and Agentflows from models, retrieval components, tools, and control nodes. It illustrates how an application graph can become an executable API. Its relevance here is [workflow orchestration](../workflow-orchestration.md), including retrieval-backed agent workflows.

The canonical project is **archived**. Its maintainers announced repository archival on August 13, 2026 and end of life on August 31, 2026, including deprecation of the official npm and Docker distributions. The following workflow is useful for understanding or maintaining an existing installation. A new deployment needs an explicitly maintained fork or an owner for dependencies and security fixes; surviving documentation is not evidence of continuing upstream support. See the [official announcement](https://github.com/FlowiseAI/Flowise/discussions/6727).

## Reproduce the source setup

The [source manifest at revision `9291856`](https://github.com/FlowiseAI/Flowise/blob/9291856d1ea4a4ceea9f8fef8ce14f4f6c81e8eb/package.json) specifies Node.js 24 and pnpm 10.26 or later within 10.x. Use those requirements for this revision, rather than the older Node versions shown in some installation pages. With those prerequisites installed, the [repository setup](https://github.com/FlowiseAI/Flowise/blob/9291856d1ea4a4ceea9f8fef8ce14f4f6c81e8eb/README.md) is:

```bash
git clone https://github.com/FlowiseAI/Flowise.git
cd Flowise
git checkout 9291856d1ea4a4ceea9f8fef8ce14f4f6c81e8eb
pnpm install
pnpm build
pnpm start
```

Open `http://localhost:3000`. Configure credentials for the chosen chat model, embedding model, and vector store. A source checkout does not supply these external services or credentials. Keep the application local while configuring access controls.

## Prepare knowledge separately from execution

Use [Document Stores](https://docs.flowiseai.com/using-flowise/document-stores) to create the indexing pipeline:

1. Add a named store and select the loader appropriate to a small test document.
2. Upload the document, select a text splitter, and preview the chunks. A loader's accepted file type alone does not establish that figures, tables, or page geometry survive extraction.
3. Configure the embedding model and vector-store destination, then upsert the processed documents. Configure a record manager when using the documented duplicate-detection and update workflow.
4. Confirm indexing succeeded before connecting the store to an agent. Document preparation and vector-store upsertion are separate steps.

For retrieval, follow the [RAG agent example](https://docs.flowiseai.com/tutorials/rag): configure an Agent node's model, add **Knowledge (Document Store)**, select the indexed store, and describe its contents so the agent knows when to retrieve. Only upserted stores are available. Add instructions to answer from retrieved evidence and report missing information, then save and run the flow. A pre-existing vector index can instead be connected with its matching embedding model.

Verify a question whose answer appears in the document, then an absent-answer question. Inspect the retrieval inputs and results when diagnosing an incorrect response. Replacing an embedding model requires an index compatible with that model; changing a node alone does not transform previously stored vectors.

## Invoke a protected flow

Flowise's [flow-level authorization](https://docs.flowiseai.com/configuration/authorization/chatflow-level) documentation says flows are public by default to callers who know their ID. Create an API key and assign it to the flow before exposing its prediction endpoint. Editor access and execution access require separate attention.

For a saved question-based flow, use the [Prediction API](https://docs.flowiseai.com/using-flowise/prediction). Set the three environment variables to the server URL, flow ID, and assigned secret:

```bash
curl --fail-with-body "${FLOWISE_URL}/api/v1/prediction/${FLOW_ID}" \
  -H "Authorization: Bearer ${FLOWISE_API_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"question":"What is the documented rollback procedure?","streaming":false}'
```

The endpoint executes the saved graph. Other flow input types and streaming responses have different request or consumption requirements; use the generated integration example for that flow. Avoid exposing arbitrary configuration overrides to untrusted callers.

## Edition and maintenance boundaries

The [license at the inspected revision](https://github.com/FlowiseAI/Flowise/blob/9291856d1ea4a4ceea9f8fef8ce14f4f6c81e8eb/LICENSE.md) applies Apache 2.0 to the general codebase, with commercial licensing for the enterprise directory and other explicitly marked files. Archival does not remove those exceptions. [Workspaces and their role-based controls](https://docs.flowiseai.com/using-flowise/workspaces) are documented for Cloud and Enterprise plans; they should not be assumed available in a community installation.

For continued operation, preserve the flow definitions, credential-encryption configuration, application storage, and external indexes together. Test export, restore, and a representative prediction before upgrading a fork or changing providers.

