# Multi-agent systems

A **multi-agent system (MAS)** coordinates agents with separate decision-making roles, instructions, state, tools, or objectives. A model supplies learned capabilities; an agent is an executing software role. Several model calls in a fixed workflow are not necessarily several agents. Multiple logical agents can share one model-serving pool rather than require separate model replicas.

MAS is an application architecture, not a replacement for transformer inference. It can use centralized coordination, peer interaction, or a hybrid. A larger population, decentralized topology, or human-sounding persona does not by itself establish better reasoning.

## When additional agents are useful

Specialization, isolated contexts, parallel investigation, and independent review can justify additional agents. For a technical report, one agent might inspect source material while another checks a numerical appendix. Their outputs are useful because they address separable uncertainties and carry inspectable evidence.

Prefer a single agent or deterministic workflow when the task has a short dependency chain, little independent work, or a clear direct operation. Distinguish additional agents from **independent sampling**: [self-consistency](https://arxiv.org/abs/2203.11171) aggregates multiple reasoning paths from a model without requiring inter-agent negotiation. A communicating system should be compared against that simpler alternative, not only against a single inexpensive attempt.

Different prompts may broaden exploration but do not guarantee statistically independent errors. Vary questions, evidence sources, tools, and verification methods where useful; merely renaming an identical role does not establish diversity.

## Topology, communication, and authority

| Structure | Mechanism | Main trade-off |
| --- | --- | --- |
| Coordinator and specialists | A coordinator delegates bounded questions and integrates findings. | Clear ownership, but routing and synthesis can become bottlenecks. |
| Independent investigators | Agents work without seeing peers' initial conclusions; results meet at a verification or synthesis stage. | Preserves independent discovery but can duplicate work. |
| Peer network | Agents exchange selected findings with relevant neighbors. | Enables local coordination but needs routing, termination, and conflict rules. |
| Shared workspace | Agents publish versioned findings and subscribe to relevant changes. | Reduces direct coupling; stale state, delivery fan-out, and shared-store authority still matter. |
| Hybrid | Local peer exchange operates within centrally enforced resource and permission limits. | Separates exploration from control, at the cost of explicitly designing both. |

A shared store does not make a system decentralized, and a final aggregator does not imply that every intermediate decision is centralized. Specify communication topology, scheduling authority, and write ownership separately. Use deterministic code for admission, permission checks, budgets, and state transitions when model judgment adds no value.

Generic [agent-to-agent communication](../protocols/agent-communication/agent-to-agent.md) is broader than the [Agent2Agent protocol](../protocols/agent-communication/a2a.md). The [A2A specification](https://a2a-protocol.org/latest/specification/) defines interoperable tasks, messages, artifacts, and multiple transport bindings, including JSON-RPC, gRPC, and HTTP+JSON. It does not prescribe a reasoning topology or establish the truth of an agent's output. In-process workers need not expose network endpoints merely to qualify as agents.

## Evidence-driven coordination

A practical design separates **exploration, challenge, verification, and synthesis**. This is a proposed engineering pattern, not a guarantee of a quality improvement.

Start from a versioned task, acceptance criteria, evidence snapshot, deadline, and resource ceiling. Give each investigator a bounded question and tool scope. Preserve its initial findings before exposing it to peer conclusions. Route a finding when it resolves a dependency, contradicts a claim, or supplies reusable evidence; do not broadcast every intermediate thought.

Workers return concise conclusions, evidence references, uncertainties, and requested checks. For example, the following is an **illustrative application record, not an A2A object or a standard schema**:

```json
{
  "finding_id": "finding-17",
  "task_id": "navigation-race",
  "task_revision": 3,
  "worker_id": "state-investigator",
  "kind": "hypothesis",
  "claim": "A response from an earlier navigation can overwrite current state.",
  "evidence_refs": ["artifact:trace-12", "artifact:code-snapshot-7"],
  "contradicts": [],
  "requested_check": "Replay two navigations with reversed response completion.",
  "verification_status": "pending"
}
```

Artifact references should resolve to immutable, access-controlled content with source provenance. The runtime authenticates the sender; a self-declared `worker_id` is not proof of identity. Only an authorized verifier should record a successful check, referencing the test, result, and exact candidate revision. Keep hypotheses distinct from observations and accepted decisions. A graph database is optional; records and an event log can be sufficient.

For an illustrative navigation bug, a state investigator reconstructs transitions, a contract investigator checks response-order guarantees, a counterexample investigator attacks the proposed explanation, and a test author constructs a regression test. An integration owner applies only a verified candidate. This illustrates work decomposition, not a measured advantage over a single developer agent.

## Debate and synthesis

Debate should target a disputed claim with a bounded challenge, rebuttal, and check. A useful challenge introduces evidence or a discriminating test; repeated agreement is not new evidence. Stop when the relevant check resolves the dispute, the budget is exhausted, or further rounds add no useful information. Preserve unresolved uncertainty rather than manufacturing consensus.

[Multi-agent debate experiments](https://arxiv.org/abs/2305.14325) report gains on evaluated reasoning and factuality tasks. Conversely, [Debate or Vote?](https://arxiv.org/abs/2508.17536) finds majority voting explains most gains in its seven-benchmark evaluation. These results motivate task-specific comparisons, not a universal instruction to debate or never debate.

Aggregation can select a candidate, reconcile complementary findings, or explicitly retain alternatives. Majority votes and model-judge scores are decision rules, not correctness proofs. Prefer executable tests, checkable calculations, source inspection, or acceptance criteria where available. Each is limited: passing tests can miss regressions, and multiple judges can share an error. Do not count several restatements of one source as independent support.

## Asynchronous execution and shared state

Asynchronous messaging does not mean an inference request can accept arbitrary mid-generation changes. Apply incoming findings at a supported interruption boundary or the next decision step; cancel or restart work only when the runtime supports those operations. Binary serialization does not make hidden-state vectors interoperable between unrelated models.

Use bounded queues and explicit delivery semantics. Associate each message with a task revision, message identifier, sender, and relevant deadline. Reject stale results; deduplicate repeated deliveries and side effects. Define cancellation propagation and behavior when a worker fails, times out, or finishes after its task has been superseded. Limit pending findings as well as active inference calls.

A shared workspace needs conflict and provenance rules. Avoid several workers overwriting one mutable answer. Append candidate findings and designate who may accept, supersede, or merge them. For code changes, isolated branches or worktrees separate candidates; one authorized integration path reconciles them. [Durable execution](durable-execution.md) and [state management](state-management.md) address recovery and persisted progress.

Treat peer content as untrusted input, not higher-priority instructions. A claim embedded in an artifact cannot expand tool permissions, authorize a deployment, or spend beyond the originating task's limits. Enforce these boundaries outside the model and carry tenant and authorization scope through artifact retrieval.

## Cost, messages, and latency

Let `N` be the fixed agent population, `R` the number of rounds, and `d` a bounded number of outgoing recipients. Under one worker call per agent per round and one message per directed edge per round:

| Quantity | Accounting under those assumptions |
| --- | --- |
| Worker inference calls | `N × R`, excluding routing, verification, retries, and synthesis. |
| Fully connected peer deliveries | `N × (N - 1) × R`. |
| Bounded-degree peer deliveries | At most `N × d × R`, excluding control and aggregation traffic. |
| Token consumption | Sum the actual input and output tokens of every call; a call count alone is insufficient. |
| Elapsed time | Dependency-path time plus queueing, contention, tools, and orchestration overhead; not the sum of all parallel worker durations. |

For 200 agents in one round, full directed fan-out yields 39,800 deliveries; at most three recipients per worker yields at most 600 peer deliveries. These are illustrative counts, not latency or cost measurements. Sparse topologies may require more propagation rounds. A broker with one publish operation still performs delivery work for subscribers.

Fixed-population, bounded-context execution is not inherently exponential. Replaying growing transcripts increases per-call work; recursive spawning can cause exponential growth with depth when each worker creates multiple successors. State the execution policy rather than assigning one complexity class to every MAS.

Track active-call limits, total tokens, tool attempts, delivered bytes, cumulative deliveries, elapsed time, and cost independently. Cached tokens and different model sizes make equal token counts an imperfect cost comparison. Sharing model weights also leaves per-request state: [PagedAttention](https://arxiv.org/abs/2309.06180) explains the importance of inference-time key-value cache management. Small, distilled, or quantized models are implementation candidates to evaluate, not architectural prerequisites.

## Evaluation and scaling

Measure against a competent single agent, independent candidates with verification, a small specialist team, and the same team with targeted communication. Hold task information, tools, acceptance criteria, and resource ceilings comparable. Run both budget-matched and quality-matched comparisons; otherwise extra compute can be mistaken for superior coordination.

Ablate role specialization, peer messages, memory sharing, and the verifier separately. Use held-out tasks and repeated trials. Track accepted task completion, regressions, unsupported claims, time to a verified result, total resource cost including failed runs, and recovery from stale or duplicate messages. Report uncertainty and actual token and tool usage, not only nominal agent count. State whether improvements come from new evidence, extra candidates, or better selection.

[MacNet](https://arxiv.org/abs/2406.07155) studies collaboration graphs extending beyond a thousand agents using directed acyclic structures. That is prior art for large populations, not proof that a thousand simultaneously active asynchronous workers are optimal. [Agent-scaling research](https://arxiv.org/abs/2512.08296) reports task- and topology-dependent gains and failures. Its results should not become universal thresholds for agent counts.

Expand only when additional agents improve verified outcomes enough to justify coordination and failure handling. Reject a proposed topology when its advantage vanishes against a simpler baseline given comparable resources.

## Biological analogies and implementation boundaries

Specialized workers and selective broadcasting can be inspired by a [global neuronal workspace model](https://pubmed.ncbi.nlm.nih.gov/9826734/). This does not establish equivalence to cortical columns, biological neurogenesis, synaptic plasticity, or consciousness. A [2025 adversarial test of consciousness theories](https://pmc.ncbi.nlm.nih.gov/articles/PMC12137136/) supports some predictions while challenging important predictions of both tested theories. Such analogies are design inspiration, not evidence that the software implements the brain.

Nor is the alternative a model generating an entire answer in one static forward pass: [autoregressive transformer decoding](https://arxiv.org/html/1706.03762v7) conditions subsequent tokens on earlier output. MAS changes the surrounding organization of work. Internal mixture-of-experts routing, such as [Switch Transformers](https://arxiv.org/abs/2101.03961), is a different architectural layer from independently managed software agents.

[AutoGen Core](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/index.html) illustrates actor-style asynchronous communication; [CrewAI Flows](https://docs.crewai.com/en/concepts/flows) illustrates stateful event-driven control; [LangChain's multi-agent documentation](https://docs.langchain.com/oss/python/langchain/multi-agent) illustrates context isolation and custom LangGraph workflows. None removes application responsibility for budgets, authorization, verification, or business correctness.
