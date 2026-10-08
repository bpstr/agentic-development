# Router pattern

A router classifies an input and sends it to an appropriate model, workflow, agent, tool set, or knowledge source. Routing can use deterministic rules, model judgment, or both. Its result selects a destination; it does not establish that the destination will answer correctly.

Use deterministic routing when the necessary signal is explicit. A request containing a validated task ID can go directly to task retrieval. A broad question about an unfamiliar incident may need classification before choosing a knowledge source or investigation workflow.

[LangChain's router pattern](https://docs.langchain.com/oss/python/langchain/multi-agent/router) describes classification and dispatch, including routing to more than one destination. Parallel dispatch is useful only when the branches supply complementary evidence and their combined cost is justified.

Give routes clear boundaries and a fallback for ambiguous or unsupported inputs. Preserve the original request and resolved identities when forwarding; repeated rewriting can lose qualifications or change the task.

Evaluate routing separately from downstream generation. Include greetings, exact lookups, multi-topic requests, and cases near category boundaries. Measure wrong destinations, unnecessary expensive routes, and fallback frequency.

Reconsider routing when new information changes the task, but avoid sending every tool result through another classifier. Excessive routing adds latency and makes a simple workflow difficult to trace.

## Confidence-gated decision routing

[Typed decision inference](../infrastructure/models/model-capabilities.md#typed-decision-inference) can implement the judgment step without generating an explanation on every request. TypeSafe's [intent-routing pattern](https://docs.typesafe.ai/patterns/intent-routing) and the [OpenAI Decisions contract](../infrastructure/inference/apis/openai-responses-api.md#decisions-api-for-bounded-judgments) illustrate this separation. The surrounding application still owns dispatch.

An illustrative flow is:

```text
Authoritative request and state snapshot
  -> deterministic lookup when the route is already known
  -> otherwise evaluate a finite, eligible route set
  -> inspect refusal/error, chosen-route probability, and calibrated thresholds
  -> clarify, review, or select an eligible handler
  -> recheck authorization and state freshness, execute, persist the outcome
```

For example, route a support message to a technical handler, a billing handler, or review. Within research, a separate judgment can score candidate passages before generation. Do not make a single broad score decide relevance, urgency, permissions, and factual truth simultaneously. A later decision that needs an earlier result belongs in a later step, not an independent parallel question.

Include an explicit ambiguous/unsupported outcome. Tune the action threshold per route and model version; a provider's `confidence` field is not necessarily its top-choice probability. Revalidate after a model, rubric, candidate set, or data-distribution change. Measure wrong-route cost, fallback rate, latency, and downstream success together.

Filter disallowed actions before classification and repeat permission checks at execution. Treat retrieved text and event payloads as untrusted evidence. Neither a high score nor a model-selected handler can grant spending authority, bypass an approval, or prove a mutation committed. For consequential actions, retain the state version, decision configuration, approval, and execution receipt.
