# OpenAI tool execution

[Official tool guides](https://developers.openai.com/api/docs/guides/tools) · [Web search](https://developers.openai.com/api/docs/guides/tools-web-search) · [Remote MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)

OpenAI exposes tools through Responses, including provider-run capabilities and custom functions. The selected model and tool determine whether OpenAI performs the operation or returns a request for application execution.

## Enable hosted search

With `openai` installed and `OPENAI_API_KEY` configured, this example performs a request using a model with web-search support:

```python
import os
from openai import OpenAI

response = OpenAI().responses.create(
    model=os.environ["OPENAI_MODEL"],
    tools=[{"type": "web_search"}],
    input="Find the official Python release schedule and cite it.",
)
print(response.output_text)
```

Preserve the response's source annotations when rendering citations. The application should not reconstruct citation URLs from the answer text.

## Execution boundaries

Custom functions return structured calls for an application dispatcher. A remote MCP tool makes OpenAI an MCP client of the configured server. Provider-hosted search and code tools have their own service execution and result contracts.

Consequently, process output items by their actual type. A function-call loop should not attempt to execute hosted search events as local functions.

Use allowlisted tools, narrowly scoped MCP credentials, and the integration's approval configuration where applicable. Inspect tool result failures separately from model response status.

Additional capabilities such as [file search](https://developers.openai.com/api/docs/guides/tools-file-search) require data setup; defining the tool does not automatically index application documents. Sandboxed execution also requires an artifact lifecycle if generated files must remain available after the provider environment ends.
