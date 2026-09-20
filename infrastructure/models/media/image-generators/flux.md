# FLUX image models

[Official API quickstart](https://docs.bfl.ai/quick_start/generating_images) · [FLUX.2 inference repository](https://github.com/black-forest-labs/flux2) · [FLUX.1 inference repository](https://github.com/black-forest-labs/flux)

FLUX is Black Forest Labs' image-generation family, with hosted APIs and selected downloadable models. Text generation of images, reference-conditioned editing, and structural control depend on the particular model. The FLUX.2 repository documents image generation and editing for its listed open-weight variants.

The hosted API uses a submit-and-poll lifecycle. A documented request shape is:

```http
POST /v1/flux-2-pro HTTP/1.1
Host: api.bfl.ai
Content-Type: application/json
x-key: YOUR_BFL_API_KEY

{
  "prompt": "A blue notebook on a warm white studio surface, no text",
  "width": 1024,
  "height": 1024
}
```

The response supplies a request ID and `polling_url`. Poll that returned URL; when the status is `Ready`, the result supplies the generated sample location. Handle failure states and a bounded waiting period. Persist the completed image rather than treating a temporary result URL as permanent storage.

This shape is illustrative and has not been submitted. In a worker, retain the original request ID across network retries so a lost HTTP response does not automatically trigger another paid generation. The API distinguishes preview endpoints from fixed model snapshots for reproducibility.

Open-weight licensing differs by artifact. For example, the FLUX.2 repository identifies Apache 2.0 terms for its Klein 4B variants and different conditions for other weights. The inference code's license is not a blanket license for all model weights. Evaluate the exact model, sampler, precision, and references used in the intended deployment.
