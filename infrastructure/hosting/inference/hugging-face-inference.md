# Hugging Face inference services

Official documentation: [Inference Providers](https://huggingface.co/docs/inference-providers/index), [Inference Endpoints](https://huggingface.co/docs/inference-endpoints/index). Source: [huggingface/huggingface_hub](https://github.com/huggingface/huggingface_hub).

Hugging Face offers two distinct inference arrangements. Inference Providers routes supported tasks to partner providers through a shared interface. Inference Endpoints deploys a selected model onto dedicated managed infrastructure. A model's presence on the Hub does not guarantee availability through either arrangement.

For a supported chat model, install `huggingface_hub` and set `HF_TOKEN` and `MODEL_ID`:

```python
import os
from huggingface_hub import InferenceClient

client = InferenceClient(api_key=os.environ["HF_TOKEN"])
result = client.chat.completions.create(
    model=os.environ["MODEL_ID"],
    messages=[{"role": "user", "content":
               "Explain semantic search in one sentence."}],
)
print(result.choices[0].message.content)
```

Provider selection affects task support, serving behavior, and the data path. Record which provider actually executes a routed request. Choose dedicated Endpoints when the workload requires control over a particular deployment, hardware configuration, or scaling policy.

For dedicated hosting, select the model and serving container, configure access and compute, deploy, then query its endpoint. Include cold starts and scale-to-zero behavior in latency measurements. Check model licensing and required custom code before deployment.

The Hub stores models and datasets; Spaces hosts applications and demonstrations. Neither is synonymous with a production inference endpoint. Keep these hosting responsibilities separate when evaluating an agent system, and validate function tools and structured output on the specific serving combination.
