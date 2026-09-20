# pgvector

Official resources: [Documentation and repository](https://github.com/pgvector/pgvector), [PostgreSQL full-text search](https://www.postgresql.org/docs/current/textsearch.html).

pgvector adds vector types, distance operators, and nearest-neighbor indexes to PostgreSQL. It is useful when retrieval should share database operations, joins, and backups with an existing relational application.

Install the extension on the PostgreSQL server using a supported package, container image, or source build, then enable it in the target database. This example stores and retrieves artificial three-dimensional vectors; it demonstrates SQL operations, not semantic quality.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE runbook_vectors (
    id text PRIMARY KEY,
    workspace_id text NOT NULL,
    body text NOT NULL,
    embedding vector(3) NOT NULL
);

INSERT INTO runbook_vectors VALUES
    ('rollback-1', 'workspace-7', 'Pause workers before rollback.', '[1,0,0]'),
    ('deploy-1', 'workspace-7', 'Deploy after review.', '[0,1,0]');

SELECT id, body
FROM runbook_vectors
WHERE workspace_id = 'workspace-7'
ORDER BY embedding <=> '[0.9,0.1,0]'
LIMIT 2;
```

The cosine-distance operator orders lower distances first. Exact search is a useful baseline. HNSW or IVFFlat indexes improve search speed with a recall tradeoff; select the operator class matching the query metric.

With approximate indexes, filtering can reduce returned candidates because filtering follows the index scan. Evaluate filtered recall and use supported iterative scans or suitable partitioning when needed. A `WHERE` clause supplied by the application is not a substitute for correctly enforced authorization.

Generate real vectors with one compatible embedding model, record source revisions, and use parameterized SQL. The example was checked against the documented SQL interface; no PostgreSQL instance was executed for this guide.
