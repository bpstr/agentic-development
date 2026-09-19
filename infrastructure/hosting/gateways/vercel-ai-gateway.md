# Vercel AI Gateway

Vercel AI Gateway is a model-access gateway that provides a common endpoint for reaching models from multiple providers. Its responsibilities include provider routing and model access rather than defining the agent loop itself.

A gateway can simplify provider switching and centralized usage controls, but compatibility at the request layer does not guarantee identical tool calling, reasoning, streaming, or model behavior across providers.

Official documentation: [AI Gateway](https://vercel.com/docs/ai-gateway).
