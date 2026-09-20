# Model inference

Inference is the computation that applies a trained model to input and produces output. In a language model, input is encoded as tokens and the model generates further tokens. An inference service adds request validation, scheduling, model execution, and response delivery around that computation.

Inference differs from training: a normal request does not update the model's learned weights. Adding a document to the prompt changes the context available for that request; it does not permanently teach the model its contents.

## Where inference fits

Consider a support assistant that checks a delivery:

1. One inference receives the question and available tool definitions.
2. The output requests a delivery lookup.
3. Application code performs that lookup.
4. Another inference receives the result and explains it.

The complete sequence is an agent run. Only the model computations are inference. A managed service may perform several such computations inside one application API call, so HTTP request count is not a reliable model-call count.

## Prefill and generation

For autoregressive language models, processing the input context is often called *prefill*; generating output incrementally is *decoding*. A large prompt, a long generated answer, and a slow external tool affect different stages. The distinction helps explain why shortening output may improve latency even when the input stays unchanged. [Hugging Face inference optimization](https://huggingface.co/docs/transformers/llm_tutorial_optimization).

A useful measurement records request start, first useful output, model completion, and application completion separately. A model can finish asking for a tool while the user's task still has substantial work remaining.
