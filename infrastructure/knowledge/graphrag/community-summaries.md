# Community summaries

A graph community is a group of nodes identified as more closely connected under a chosen clustering method. A community summary describes evidence associated with that group. It is a derived artifact, not an independent source or a guaranteed real-world organizational unit.

Microsoft GraphRAG's [global search](https://microsoft.github.io/graphrag/query/global_search/) uses community reports to address questions spanning a collection. This can help with “What recurring operational problems appear across these incident reports?” where retrieving a handful of similar passages may omit broader themes.

Reports compress evidence. Preserve the member source IDs, graph revision, summarization configuration, and the report's own revision. Otherwise, users cannot determine whether a conclusion came from current documents or an old generated summary.

For example, a report describing repeated migration failures might combine incidents from several services. It should distinguish a recurring observation from an inferred shared cause. Small or unusual incidents can disappear during compression even when they matter to a particular question.

Rebuild affected reports when their membership or supporting sources change. Deletion and permission changes must also propagate: removing original passages does not remove information already copied into a summary.

Evaluate coverage and source support separately. A readable corpus overview can omit important minority cases, overstate frequency, or repeat extraction errors. Use direct source retrieval when the question requires exact wording or a current operational fact.
