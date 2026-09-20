# Context windows

A context window is the bounded input/output token capacity available to an inference process. A large window increases available capacity but does not guarantee that all supplied information will be used equally well.

Applications should distinguish the provider's maximum context from the amount that is useful, affordable, and latency-efficient for a particular task.
