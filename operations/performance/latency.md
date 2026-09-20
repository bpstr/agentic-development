# Agent latency

Latency is elapsed time between defined events. For an agent, useful boundaries include user submission, acknowledgement, first useful content, committed action, and final delivery. Name the boundary with the metric: a fast HTTP acknowledgement is not a fast completed task.

A run can include queueing, context preparation, several model calls, tools, persistence, and rendering. Parallel work contributes its critical path to elapsed time, while all operations still consume resources. Use traces to identify the stage that actually delays completion.

For example, two independent reads taking 400 ms and 700 ms occupy roughly 700 ms if run concurrently. Running them together saves about 400 ms compared with serial execution, before scheduling overhead. Parallelizing unrelated background logging may have no effect on user-visible completion.

Optimize measured causes: reduce unnecessary serial calls, retrieve focused context, shorten excessive generated output, and reuse eligible work. [OpenAI's latency guide](https://developers.openai.com/api/docs/guides/latency-optimization) discusses these classes of changes. Evaluate quality and failure rate after each optimization.

A provider request span does not expose every internal stage. Unattributed time might include transit, queueing, input processing, inference, or orchestration. Do not label the remainder “reasoning” or “framework overhead” without supporting measurements. Report median and tail latency with sample count, workload, concurrency, and success rate.
