# xAI and Grok

[Official Grok model catalog and pricing](https://docs.x.ai/developers/models) · [Developer documentation](https://docs.x.ai/overview)

xAI provides the Grok model family through hosted APIs. General-purpose Grok models handle conversational and coding workloads, while image, video, and voice capabilities have dedicated models or interfaces. The current catalog recommends Grok 4.6 for general text and code use; the model's page remains the authority for its request parameters and limits.

A model's training knowledge is different from access to current information. Web Search and X Search are provider-hosted tools that retrieve external material during a request. A Grok response without such retrieval should not be treated as automatically connected to current events or a user's private data.

For example, evaluating an assistant that summarizes recent developer announcements requires separate checks for source retrieval, correct attribution, and answer quality. Compare configurations with equivalent search access; a search-enabled run and a model-only run are testing different systems.

Compatibility with a familiar API format does not establish full feature equivalence. The catalog documents model-specific differences, including unsupported parameters and tool capabilities. Validate structured output, continuation, and streamed tool calls using the exact model and endpoint.

Grok Bot and Grok Build are agent products with surrounding execution behavior. Their ability to manage files or run tools should not be attributed to the inference model as an independent capability.
