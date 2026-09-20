# Model responses

A model response is a typed result, not necessarily a string. It may contain text, tool requests, media, refusals, usage information, and a terminal status. One response can contain several output items.

This abbreviated synthetic OpenAI Responses result demonstrates the nesting:

```json
{
  "id": "resp_example",
  "status": "completed",
  "output": [
    {
      "id": "msg_example",
      "type": "message",
      "role": "assistant",
      "status": "completed",
      "content": [
        {
          "type": "output_text",
          "text": "Inference applies a trained model to new input.",
          "annotations": []
        }
      ]
    }
  ]
}
```

Real results contain additional fields. SDK text helpers are useful for displaying an answer, but they are projections of the response rather than its complete representation. [Responses migration and item model](https://developers.openai.com/api/docs/guides/migrate-to-responses).

## Interpret completion at the right level

Transport success means the server returned a response. Model completion means generation reached a terminal outcome. Business success means the intended operation actually occurred. These conditions differ: a completed generation might request a tool that has not run, and a fluent answer might describe a failed operation.

Dispatch output by type, retain item and call identifiers, and handle incomplete output before parsing a promised JSON object. Preserve usage and error details separately from user-facing prose. A refusal is an explicit outcome to handle, not malformed application data to repeatedly repair.

For an action such as changing a task status, report success from the executor's stored result. The generated explanation can summarize that result, but should not replace it as evidence.
