# Anthropic inference hosting

Official documentation: [API overview](https://platform.claude.com/docs/en/api/overview), [Messages API](https://platform.claude.com/docs/en/api/messages), [Pricing](https://platform.claude.com/docs/en/about-claude/pricing).

Anthropic's direct API hosts Claude inference and returns typed message content. Its Messages API is the model-access surface for application-owned loops; Claude Managed Agents supplies a different, managed execution lifecycle.

Install `anthropic`, set `ANTHROPIC_API_KEY`, and choose an available `MODEL_ID`:

```python
import os
from anthropic import Anthropic

message = Anthropic().messages.create(
    model=os.environ["MODEL_ID"],
    max_tokens=256,
    messages=[{"role": "user", "content":
               "Explain optimistic locking in one sentence."}],
)
for block in message.content:
    if block.type == "text":
        print(block.text)
```

Treat the result as content blocks rather than assuming every response is one text string. A tool-use block proposes work that may need application execution; hosted tools have their own execution and billing contract.

Record stop reasons, usage, model identity, and provider request IDs. Bounded retry policies should distinguish invalid input, authentication failures, rate limits, and transient service errors. Replaying a model request is separate from repeating a tool mutation.

Claude can also be accessed through cloud platforms with different credentials, endpoint shapes, regions, and available features. Specify the actual serving surface in the deployment design rather than treating every Claude endpoint as operationally identical. Keep application state, user authorization, and artifact storage under explicit product ownership.

## Anthropic-managed Claude on Google Cloud

On October 22, 2026 Anthropic introduced [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed). Unlike the **Google-managed Vertex AI** Claude offering, Anthropic operates this Claude API and Google Cloud IAM governs access while Cloud Marketplace bills usage. Setup activates an Anthropic organization associated with a Google Cloud project; do not assume it shares workspaces, quotas, retention settings, or identity with an existing Anthropic organization.

Enable `claude.googleapis.com` and the Marketplace subscription service, grant `roles/claude.user` (or a suitably limited role) to the service account, and configure project **and** Anthropic workspace IDs. The Python SDK exposes `AnthropicGoogleCloud` via `anthropic[google_cloud]`. Requests use Google access tokens, not an `x-api-key`, and route through a project/location/workspace-scoped base URL. Check available regions and models in the selected offering; the label 'Claude on Google Cloud' alone does not establish which operator, data boundary, API version, or billing contract applies.
