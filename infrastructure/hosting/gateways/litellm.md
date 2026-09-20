# LiteLLM gateway

Official documentation: [Proxy quickstart](https://docs.litellm.ai/docs/proxy/quick_start), [Configuration](https://docs.litellm.ai/docs/proxy/configs). Source: [BerriAI/litellm](https://github.com/BerriAI/litellm).

LiteLLM provides both a Python model-integration library and a deployable AI gateway. The gateway centralizes provider credentials, model aliases, routing, budgets, and request accounting. When self-hosted, it is an operational service maintained by the application owner.

Install the proxy package in an isolated environment:

```bash
python -m pip install 'litellm[proxy]'
```

Set `LITELLM_MODEL` to a supported provider/model identifier, `OPENAI_API_KEY` for this provider example, and a strong `LITELLM_MASTER_KEY`. Save `config.yaml`:

```yaml
model_list:
  - model_name: document-model
    litellm_params:
      model: os.environ/LITELLM_MODEL
      api_key: os.environ/OPENAI_API_KEY
general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
```

Start `litellm --config config.yaml --host 127.0.0.1 --port 4000`. A compatible client can request `document-model` through the gateway, authenticating with the configured key. Use provider-specific credentials and configuration when selecting another backend.

This is a minimal local setup. Production virtual keys, durable accounting, and multi-instance operation require the relevant database and deployment configuration. Keep configuration in version control while injecting secrets at runtime.

Define timeouts, retry budgets, allowed models, and log redaction. Do not silently drop unsupported parameters if the application relies on them. Test the exact tool-calling and streaming contract for each route, and make actual provider resolution visible in traces. A self-hosted gateway cannot remove upstream model limits or infer user permissions for business tools.
