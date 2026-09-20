# Tool context

Tool context describes the capabilities a model may call: names, purposes, argument schemas, constraints, and expected results. Clear descriptions help the model distinguish actions with similar names and identify the information required before proposing a call.

For example, `search_orders` should explain which fields it searches and that it returns summaries. `get_order` should specify that it requires a stable order identifier and returns details. The distinction prevents the model from inventing an identifier or treating a search result as a complete record. State side effects and required confirmation separately from argument formatting.

Large catalogs consume context and introduce overlapping choices. Discovery can first expose a compact search capability, then load complete schemas for relevant tools. [Anthropic's tool search documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) illustrates deferred loading. Discovery still needs sufficiently informative names and descriptions to find the right capability.

Tool results become context too. Return bounded records with identifiers and pagination rather than dumping an entire dataset. Preserve errors as errors so the agent does not interpret a failed operation as success. The [MCP tool specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) defines structured tool descriptions and result forms.

Exposing a tool is not authorization to execute every valid argument. The runtime must validate input, caller permissions, and applicable approval requirements independently.
