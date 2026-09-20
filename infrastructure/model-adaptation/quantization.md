# Model quantization

Quantization represents model weights or intermediate values using fewer bits. It reduces storage and memory traffic by approximating a larger numerical range with a smaller set of representable values. Some methods quantize only weights; others also quantize activations or the attention key/value cache.

An eight-billion-parameter model needs roughly sixteen billion bytes for weights stored at sixteen bits each. Four-bit storage reduces that raw weight calculation to roughly four billion bytes. Actual memory is higher because scales, unquantized layers, runtime buffers, and the growing key/value cache also consume space.

Post-training quantization transforms an existing checkpoint, sometimes using representative inputs for calibration. Quantization-aware training exposes training to quantization effects. [QLoRA](https://arxiv.org/abs/2305.14314) uses a frozen quantized base model while training low-rank adapters; it is an adaptation technique as well as a memory-saving approach.

Choose a format supported by the intended hardware and inference engine. A smaller artifact may run slower if the device lacks efficient kernels or repeatedly converts representations. The [Transformers quantization overview](https://huggingface.co/docs/transformers/quantization/overview) describes method and hardware compatibility.

Compare the deployed artifact against its original checkpoint on the same task set and context lengths. For an agent, include argument accuracy and multi-step completion alongside text quality. Lower precision can introduce failures that a short fluency check misses.
