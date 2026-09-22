# Azure AI Search for knowledge retrieval

Official resources: [RAG overview](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Full-text quick start](https://learn.microsoft.com/en-us/azure/search/search-get-started-text), [Vector queries](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-query), [Agentic retrieval](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview), [Role-based access](https://learn.microsoft.com/en-us/azure/search/search-security-rbac).

Azure AI Search supplies managed lexical, vector, hybrid, and semantic-ranking capabilities. It can provide passage candidates or store derived artifacts in a GraphRAG application. Those search capabilities do not automatically construct a knowledge graph or execute graph traversal.

## A source-preserving REST baseline

Create a disposable Search service with role-based data access enabled. The setup principal needs object-management and document-write permissions; the query-only application should instead use narrowly scoped read access. The [roles guide](https://learn.microsoft.com/en-us/azure/search/search-security-rbac) distinguishes Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader.

After authenticating Azure CLI, acquire a data-plane token and set `SEARCH_ENDPOINT` to the service origin without a trailing slash:

```bash
export SEARCH_TOKEN="$(az account get-access-token \
  --scope https://search.azure.com/.default --query accessToken --output tsv)"
```

This Python standard-library example follows the generally available `2026-04-01` REST API. It creates a fresh named index, uploads a synthetic runbook, verifies per-document acceptance, and performs a filtered lexical query. It deliberately does not delete an existing index at startup.

```python
import json
import os
from urllib.error import HTTPError
from urllib.request import Request, urlopen

endpoint = os.environ["SEARCH_ENDPOINT"].rstrip("/")
token = os.environ["SEARCH_TOKEN"]
index_name = "r7-evidence-demo"
api_version = "2026-04-01"

def request(path: str, payload: dict) -> dict:
    req = Request(
        f"{endpoint}/{path}?api-version={api_version}",
        data=json.dumps(payload).encode(), method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urlopen(req, timeout=30) as response:
            return json.load(response)
    except HTTPError as error:
        raise RuntimeError(f"Search request failed with HTTP {error.code}") from error

request("indexes", {
    "name": index_name,
    "fields": [
        {"name": "id", "type": "Edm.String", "key": True},
        {"name": "text", "type": "Edm.String", "searchable": True},
        {"name": "source_id", "type": "Edm.String", "filterable": True},
        {"name": "revision", "type": "Edm.String"},
        {"name": "locator", "type": "Edm.String"},
        {"name": "project_id", "type": "Edm.String", "filterable": True},
    ],
})
receipt = request(f"indexes/{index_name}/docs/index", {"value": [{
    "@search.action": "upload", "id": "DOC-7-r2-rollback",
    "text": "Verify the snapshot before rolling back billing-eu.",
    "source_id": "DOC-7", "revision": "2", "locator": "rollback", "project_id": "A",
}]})
if not receipt.get("value") or not all(item.get("status") for item in receipt["value"]):
    raise RuntimeError("One or more source records were not accepted")
result = request(f"indexes/{index_name}/docs/search", {
    "search": "rollback snapshot", "filter": "project_id eq 'A'",
    "select": "source_id,revision,locator,text", "top": 5,
})
print(json.dumps(result, indent=2))
```

Indexing acceptance is not a guarantee that an immediate query observes the new source. Check for the expected ID/locator with bounded polling in a real ingestion smoke test. An empty early result is different from a permanently missing document. Preserve source revisions when replacing or deleting chunks; changing IDs on every update without retiring old entries can leave obsolete evidence searchable.

The constant project filter illustrates a server-selected authorized scope. It is not a complete ACL system. Never let a browser remove or arbitrarily widen the filter under a service identity. The [security-filter pattern](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search) explains application-managed filtering; native document-permission features and delegated remote-source retrieval have their own requirements.

## Add hybrid retrieval without changing authority

Add a vector field with its embedding dimensions, algorithm/profile configuration, and a compatible embedding pipeline before sending vector queries. The documented REST query uses `vectorQueries`; a text query can run alongside it to form a hybrid request. Keep the same authorization boundary for both branches and check the filter mode's effect on candidate recall.

Semantic reranking operates on candidates rather than repairing sources that were never indexed. Hybrid rank-fusion scores and reranker scores are different quantities. They should not be displayed as factual confidence. Use source locators and reviewed relevance labels to decide whether a result is useful.

To add GraphRAG, feed these candidates into a bounded graph retriever or use graph-derived authorized source IDs to constrain a subsequent passage search. Store the original supporting text separately from generated entity descriptions or community reports. The [application integration guide](../../graphrag/integrations/graphrag-application-integration.md) defines the evidence boundary.

## Agentic retrieval and Foundry IQ

Azure AI Search underpins Foundry IQ and supplies knowledge bases that orchestrate retrieval from knowledge sources. The documentation reviewed on September 22, 2026 separates generally available minimal extractive retrieval from Preview capabilities such as LLM-based query planning, non-minimal effort, multi-turn messages, and answer synthesis.

Use REST `2026-04-01` for the supported GA surface and `2026-08-01-preview` only when adopting the required preview capabilities. Portal-created objects can use preview schemas; do not assume they are portable unchanged to the GA API. A knowledge base and at least one source are required; indexed and remote sources have different ingestion and identity behavior.

Query planning, parallel searches, grounding content, references, and activity logs are retrieval orchestration. None alone proves that a knowledge graph was constructed. Choose minimal retrieval when the product needs evidence-only suggestions, and evaluate additional planning or synthesis against latency and cost requirements rather than enabling it by default.

The [agentic-retrieval guide](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview) documents region, quota, and billing boundaries. Search retrieval/ranking usage and model planning/generation are separate costs. Measure actual request activity and token usage rather than copying a sample's illustrative bill.

## Operational checks

Verify per-document indexing failures, source replacement, deletion, warm-cache revocation, and no-answer behavior. A deleted source must also be removed from any graph descriptions, reports, and application answer caches that were built from it. Test restricted titles and metadata as well as full text.

Use a stable source manifest, explicit model/index revisions, bounded retries, and a query-only principal. For the test cleanup, remove only the named demonstration index after confirming it is not shared. Managed search removes search-engine operations from the application; it does not remove responsibility for source truth, product permissions, or graph maintenance.
