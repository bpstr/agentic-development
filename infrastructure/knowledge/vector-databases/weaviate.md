# Weaviate

Official resources: [Local quickstart](https://docs.weaviate.io/weaviate/quickstart/local), [Documentation](https://docs.weaviate.io/weaviate), [Repository](https://github.com/weaviate/weaviate).

Weaviate organizes objects into collections and supports vector, lexical, and hybrid retrieval. It can use configured vectorizers or vectors supplied by the application. The choice determines whether ingestion and querying call an external model service.

Start a local instance using the official Docker setup and install `weaviate-client`. Ensure the ports required by the Python client, including gRPC, are reachable. This example supplies artificial vectors directly:

```python
import weaviate
from weaviate.classes.config import Configure

with weaviate.connect_to_local() as client:
    if not client.collections.exists("RunbookDemo"):
        client.collections.create(
            name="RunbookDemo",
            vector_config=Configure.Vectors.self_provided(),
        )
    runbooks = client.collections.use("RunbookDemo")
    runbooks.data.insert(
        properties={"text": "Pause workers before rollback."},
        vector=[1.0, 0.0, 0.0],
    )
    response = runbooks.query.near_vector(
        near_vector=[0.9, 0.1, 0.0], limit=3
    )
    for item in response.objects:
        print(item.properties)
```

Repeated runs append demo objects. A production ingestion path should use stable object IDs and explicit revision handling.

Configure authorization, collection schema, and tenant behavior before serving multiple users. A shared collection does not automatically enforce an application's document permissions. Keep model dimensions compatible across imports and queries, and evaluate both filtered retrieval quality and source update behavior before selecting index settings.
