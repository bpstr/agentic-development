# Hosted tools

A hosted tool executes through a service that operates the tool environment. Examples include provider-run web search, retrieval over uploaded files, and sandboxed code execution. The application configures the capability and receives its results without implementing that tool's execution loop itself.

The execution owner matters:

| Arrangement | Where execution happens | Application responsibility |
| --- | --- | --- |
| Custom function | Application dispatcher | Validation, authorization, implementation, result |
| Provider-hosted search | Provider service | Configuration, attribution, result handling |
| Provider MCP connector | Remote MCP server called by provider | Server security, credentials, access policy |
| Client-operated sandbox | Environment controlled by application | Isolation, lifecycle, execution limits |

A provider-specific tool name does not by itself establish that execution is hosted. Some computer-use or shell interfaces return actions for an application-controlled environment. Read the capability's execution contract. [Claude client and server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), [OpenAI tools overview](https://developers.openai.com/api/docs/guides/tools).

## Example: search during generation

A request can enable web search and ask for a current release date. The service may search, read results, and generate a cited answer inside that request. An application should retain source annotations and distinguish the search operation from the generated prose.

Hosted tools can simplify infrastructure while introducing service-specific limits, costs, retention rules, and failure behavior. A code sandbox may disappear after inactivity; its files are not automatically durable application storage.

Evaluate the complete workflow, including tool execution and result delivery. A single HTTP request can contain substantial orchestration and several remote operations, so fewer application calls do not necessarily mean lower latency.
