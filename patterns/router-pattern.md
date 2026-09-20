# Router pattern

A router classifies an input and sends it to an appropriate model, workflow, agent, tool set, or knowledge source. Routing can use deterministic rules, model judgment, or both. Its result selects a destination; it does not establish that the destination will answer correctly.

Use deterministic routing when the necessary signal is explicit. A request containing a validated task ID can go directly to task retrieval. A broad question about an unfamiliar incident may need classification before choosing a knowledge source or investigation workflow.

[LangChain's router pattern](https://docs.langchain.com/oss/python/langchain/multi-agent/router) describes classification and dispatch, including routing to more than one destination. Parallel dispatch is useful only when the branches supply complementary evidence and their combined cost is justified.

Give routes clear boundaries and a fallback for ambiguous or unsupported inputs. Preserve the original request and resolved identities when forwarding; repeated rewriting can lose qualifications or change the task.

Evaluate routing separately from downstream generation. Include greetings, exact lookups, multi-topic requests, and cases near category boundaries. Measure wrong destinations, unnecessary expensive routes, and fallback frequency.

Reconsider routing when new information changes the task, but avoid sending every tool result through another classifier. Excessive routing adds latency and makes a simple workflow difficult to trace.
