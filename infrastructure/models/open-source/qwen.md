# Qwen open-weight models

[Canonical Qwen3 repository](https://github.com/QwenLM/Qwen3) · [Official Qwen documentation](https://qwen.readthedocs.io/)

Qwen is Alibaba's model family with downloadable releases for different sizes and capabilities. Qwen3 is a documented reference for instruction following, reasoning modes, and model serving. The exact release matters: an instruct-only derivative is not interchangeable with a model that can switch thinking modes.

The repository's Transformers example loads a model and tokenizer, applies the publisher's chat template, then decodes only the newly generated tokens. For a deployment based on `Qwen/Qwen3-30B-A3B-Instruct-2507`, that sequence is:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "Qwen/Qwen3-30B-A3B-Instruct-2507"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, torch_dtype="auto", device_map="auto"
)
text = tokenizer.apply_chat_template(
    [{"role": "user", "content": "Explain a database index in two sentences."}],
    tokenize=False,
    add_generation_prompt=True,
)
inputs = tokenizer([text], return_tensors="pt").to(model.device)
output = model.generate(**inputs, max_new_tokens=128)
print(tokenizer.decode(output[0][inputs.input_ids.shape[1]:], skip_special_tokens=True))
```

Running this documentation example downloads substantial weights and requires suitable hardware and compatible dependencies; it is not a claim of local validation. Pin an artifact revision for repeatable deployment.

The Qwen3 repository describes its listed open-weight releases as Apache 2.0. Verify the individual artifact and derivative lineage. Tool-call behavior additionally depends on the serving runtime's parser and template: a model generating fluent text has not yet demonstrated a correct agent tool loop.
