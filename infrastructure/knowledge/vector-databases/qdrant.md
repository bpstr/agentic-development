# Qdrant

Official resources: [Local quickstart](https://qdrant.tech/documentation/quickstart/), [Python client](https://github.com/qdrant/qdrant-client), [Server repository](https://github.com/qdrant/qdrant).

Qdrant stores vector points with structured payloads and supports similarity queries with payload filters. Its local Python mode is useful for a small integration experiment before introducing a server.

Install `qdrant-client` in a virtual environment. The following example uses local disk storage and artificial vectors, so it needs no embedding API or running Qdrant server:

```python
from qdrant_client import QdrantClient, models

client = QdrantClient(path="./qdrant-demo")
if not client.collection_exists("runbooks"):
    client.create_collection(
        "runbooks",
        vectors_config=models.VectorParams(size=3, distance=models.Distance.COSINE),
    )
client.upsert(
    "runbooks",
    points=[models.PointStruct(
        id=1,
        vector=[1.0, 0.0, 0.0],
        payload={"workspace_id": "workspace-7", "text": "Pause workers."},
    )],
)
result = client.query_points(
    "runbooks",
    query=[0.9, 0.1, 0.0],
    query_filter=models.Filter(must=[models.FieldCondition(
        key="workspace_id", match=models.MatchValue(value="workspace-7")
    )]),
    with_payload=True,
    limit=3,
)
print(result.points)
client.close()
```

For server deployment, configure persistent volumes, authentication, and network access separately. Payload indexes help selected filter fields; evaluate them with realistic tenant and project constraints.

Local mode illustrates the client lifecycle, not distributed behavior or production concurrency. Stable point IDs make source replacement possible; keep document revisions and lineage in the payload or application database.
