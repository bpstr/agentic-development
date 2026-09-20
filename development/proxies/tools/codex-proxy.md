# Codex Proxy

Canonical repository: [icebear0828/codex-proxy](https://github.com/icebear0828/codex-proxy). Maintainer documentation: [English README](https://github.com/icebear0828/codex-proxy/blob/dev/README_EN.md).

Codex Proxy is a community-maintained local gateway that translates Codex-oriented Responses traffic into endpoint formats used by other AI clients. It is a compatibility layer, not an official OpenAI inference service.

## Client-facing formats

| Interface | Documented endpoint or route family |
| --- | --- |
| OpenAI Chat Completions | `/v1/chat/completions` |
| Anthropic Messages | `/v1/messages` |
| Gemini | Generate-content and streaming routes |
| Responses passthrough | `/v1/responses` |
| Optional Ollama-compatible chat | `/api/chat` |

The endpoint format does not identify the upstream model. A client speaking the Messages format can still be using a Codex-oriented model through translation.

## Basic setup

Use the maintainer's release matching the operating system. The desktop guide describes account configuration through the application and a local dashboard. Configure the intended client's base URL and authentication using that release's client-setup instructions, then verify a small text request before testing tool workflows.

The gateway runs locally; upstream inference may remain remote. Client tools, their permissions, and the execution loop are separate from request translation unless a particular integration explicitly delegates them.

## Compatibility checks

Test streamed tool arguments, call/result identifiers, multiple calls, error responses, cancellation, and usage reporting. Preserve the exact upstream and proxy versions when diagnosing a regression. A successful text response proves little about a multi-step agent's compatibility.

Keep proxy credentials and upstream identity distinct, and use a supported upstream access method. The presence of a compatibility endpoint does not establish vendor support or feature equivalence.

The maintainer's [license statement](https://github.com/icebear0828/codex-proxy/blob/dev/README_EN.md#-license) specifies non-commercial terms and excludes commercial product integration. Check the terms attached to the release before choosing it as an application dependency.
