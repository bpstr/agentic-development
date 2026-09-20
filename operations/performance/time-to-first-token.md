# Time to first token

Time to first token measures the delay before the first generated token reaches a chosen boundary. Applications often need a stricter metric: time to first useful answer content. The first stream event may contain metadata, a heartbeat, or a tool request rather than visible text.

Record separate timestamps for connection acknowledgement, first event, first answer text, and completion. Start measurements from a consistent origin, such as browser submission or provider dispatch. Comparing a browser measurement with a server-only provider metric gives a misleading result.

For example, an assistant can emit “Working…” after 100 ms, request a database tool at one second, and begin its supported answer at four seconds. Its progress feedback is responsive, but the useful-answer delay is four seconds.

Input processing, queueing, model settings, and output scheduling can affect first-token delay. Streaming enables early delivery of generated output; it does not guarantee that the model will produce useful text before finishing required tool work. [Streaming responses](https://developers.openai.com/api/docs/guides/streaming-responses) describes the event-based interaction for OpenAI.

Track interrupted and failed streams separately. Excluding them can make an unreliable system appear fast. For action requests, also measure when the action commits: an early explanatory sentence should not conceal a slow or failed operation.
