# MacNet: artifact-passing collaboration graphs

[Official repository and README](https://github.com/OpenBMB/ChatDev/tree/macnet) · [Research paper](https://arxiv.org/abs/2406.07155) · [Inspected source revision](https://github.com/OpenBMB/ChatDev/tree/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63)

MacNet is a research implementation of [multi-agent collaboration](../multi-agent-systems.md) organized around directed acyclic graphs. It is useful for examining how topology, artifact refinement, and aggregation affect a task. It should not be confused with a general-purpose asynchronous thousand-worker service.

The source observations here apply to `OpenBMB/ChatDev` revision `e7a35824fd683ffe8fc237e28ecc47d7b1a5da63` on the inspected `macnet` branch. The paper and this later checkout are different evidence objects. This page reports source inspection, not a reproduced inference experiment.

## Mechanism and public runner boundaries

The paper assigns actors to nodes and critics to edges, with a conceptual agent count of `|V| + |E|`. Its reported thousand-agent scale is not a concurrency guarantee. In the public code, the meaningful operational quantities are graph nodes and edges, transient model calls, aggregation attempts, and resulting artifacts.

[`Graph.execute`](https://github.com/OpenBMB/ChatDev/blob/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63/graph.py) processes available layers and calls `Node.optimize` through synchronous nested loops. It passes predecessor solutions to successors and aggregates converging candidates. Executed edges and nodes are removed from the in-memory graph. Local logs document activity, but are not a complete durable-resume contract.

The inspected [`README`](https://github.com/OpenBMB/ChatDev/blob/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63/README.md) identifies Croto aggregation in `chatdev.waiting` and `graph.py`. That implementation works with program artifacts. It does not supply a provenance-aware shared knowledge graph or resolve factual disagreements by itself.

## Inspecting and generating a topology

Use an isolated checkout and inspect dependencies before running the research code. The following commands pin the source and generate configuration; they do not perform model inference:

```bash
git clone --branch macnet --single-branch https://github.com/OpenBMB/ChatDev.git macnet-study
cd macnet-study
git checkout --detach e7a35824fd683ffe8fc237e28ecc47d7b1a5da63
cp config.yaml config.before-study.yaml
python generate_graph.py --node_num 4 --topology tree
```

The command syntax is verified against [`generate_graph.py`](https://github.com/OpenBMB/ChatDev/blob/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63/generate_graph.py), not by running an installed MacNet environment. The script needs the Python Graphviz package and external visualization tooling: it renders through Graphviz and calls `imgcat`. It rewrites the `graph:` field in `config.yaml` before visualization. A visualization failure can therefore leave the configuration changed.

Supported topology names in this revision are `chain`, `star`, `tree`, `net`, `mlp`, and `random`; `--reverse` reverses edges. Preserve the generated edge list rather than assuming a topology name fully identifies an experiment. A seed/concurrency/dry-run flag is not exposed by this generator.

A larger configuration uses the same verified interface:

```bash
# Configuration generation only; do not mistake this for 1,000 active model calls.
python generate_graph.py --node_num 1000 --topology tree
```

For this generated tree, there are 1,000 original nodes and 999 original edges. `Graph.build_graph` adds two boundary nodes, one edge to the original root, and 500 edges from leaves to the output boundary. Thus the built graph has 1,002 `Node` objects and 1,500 edges. These are arithmetic consequences of this source, not measured execution results. Before boundary additions, the actor-plus-critic convention would count 1,999 roles.

The `net` generator only creates edges where `u < v`, so its edge count is `N × (N - 1) / 2`. At 1,000 nodes that is 499,500 edges. Do not substitute the bidirectional all-to-all formula or describe this dense configuration as cheap because it has only 1,000 nodes.

Model selection is also an implementation boundary: [`config.yaml`](https://github.com/OpenBMB/ChatDev/blob/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63/config.yaml) selects a value mapped by `Node.__init__` to the bundled backend's model enumeration. This page does not endorse those historical identifiers as currently available models. Verify or update the backend and credentials in a sandbox before inference, and establish a spending limit outside prompts.

## Replacement example: why is the sky blue?

The example in this reference is an explanatory question, not a game-generation task:

```text
Question: Why is the sky blue?
Working scope: Earth's clear daytime sky, explained to a general reader.
Output: answer.md plus a structured evidence record; no executable code.
Checks: explain molecular scattering, avoid ocean-reflection explanations,
        do not claim blue is the shortest visible wavelength, and keep
        unsupported qualifications separate from verified claims.
```

The scope is an explicit interpretation of the question. It must not silently replace the original request.

**Changing only `run.py --task` is insufficient.** The stock runner would still instruct agents to produce Python software. The complete text-task adaptation requires:

| Source surface | Required change |
| --- | --- |
| `run.py` defaults and argument help | Use the explanatory question and an answer-oriented run name. |
| `Graph.agent_deployment` | Replace the default hardcoded programmer persona and prevent software profiles from overriding explanation roles. Editing YAML `System_prompt` alone does not fix this path. |
| `Agent.instructor_prompt` | Check one consequential factual defect, omission, or unsupported assertion in the current explanation. |
| `Agent.assistant_prompt` | Produce a revised explanation with source references, not `.py` files or mandatory `main.py`. |
| `Agent.cc_prompt` and `Node.aggregate` | Reconcile supported claims and preserve disputed ones; replace the codebook/`Pool` assumptions rather than changing only the wording. |
| `Codes`, `_get_codes`, and codebook serialization | Use text or typed claim artifacts throughout predecessor storage, aggregation, and output. |
| Compiler feedback path | Disable or remove generated-code execution structurally; do not execute an explanation as a Python program. |
| Code diff and final hardware writer | Emit explanation/evidence artifacts and text revisions, not software projects. |

These locations are visible in [`run.py`](https://github.com/OpenBMB/ChatDev/blob/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63/run.py), [`config.yaml`](https://github.com/OpenBMB/ChatDev/blob/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63/config.yaml), and [`graph.py`](https://github.com/OpenBMB/ChatDev/blob/e7a35824fd683ffe8fc237e28ecc47d7b1a5da63/graph.py). No upstream text adapter is claimed to have been implemented by this documentation change.

A replacement prompt contract can remain small:

```text
Investigator: Answer only the assigned subquestion. Return a claim,
              supporting source reference, uncertainty, and any needed check.
Critic: Identify the most consequential unsupported claim or counterexample.
        Ask for evidence; do not request compilation or generated software.
Reviser: Correct the explanation using the supplied evidence and objection.
         Retain unresolved qualifications instead of inventing consensus.
Aggregator: Combine compatible supported claims. Preserve contradictions
            and provenance. Repetition is not independent corroboration.
```

This is an application prompt specification, not a drop-in upstream configuration. It must be connected to the text-artifact changes above.

## Illustrative inquiry lifecycle

Start with separate inquiries into sunlight, molecular scattering, and common misconceptions. An inquiry into scattering returns a source-supported shorter-versus-longer wavelength explanation. Another notices that “blue is the shortest wavelength” would be wrong and requests a colour-perception check. The checker returns evidence or an unresolved qualification, not a mandatory full answer.

[NASA's introductory explanation](https://spaceplace.nasa.gov/blue-sky/en/) supports a basic answer: air molecules scatter shorter-wavelength light more strongly than red light, and scattered blue light reaches observers from many directions. A final explanation must not imply that only blue light scatters. Detailed treatment of perceived colour needs appropriate additional evidence rather than an invented answer to the violet objection.

In a fixed MacNet-style DAG, the dependencies are predeclared. In an adaptive extension, the new perception inquiry can be delegated after the objection appears. That adaptive delegation is an extension, not behavior established by this runner's static graph traversal.

## What a production-oriented extension would add

Keep a logical inquiry population independent of active serving concurrency. A bounded ready queue can admit work under leases, run-wide reservations, deadlines, and cancellation. Native typed calls suffice in one process; Protobuf/gRPC can connect processes, while [A2A](../../protocols/agent-communication/a2a.md) addresses an interoperability boundary. Binary encoding changes transport, not whether a model understands the evidence.

[State management](../state-management.md) must separate private inquiry context, authoritative execution records, and shared evidence. Introduce versioned claims and immutable artifacts rather than a global mutable answer. Track source dependencies so corrections invalidate affected results, and retain provenance when an aggregation step combines findings.

A shared [knowledge graph](../../knowledge/knowledge-graphs/knowledge-graph-definition.md) is a distinct capability from the execution DAG. Domain relationships, delegated inquiries, supporting evidence, and message deliveries must retain different edge types and meanings. Retrieved peer content does not acquire authority to change permissions or budgets.

Use the sky question as an easy correctness and early-stopping control. Evaluate capacity separately with synthetic scheduling workloads and injected failures. An offline graph count or mock-worker test does not reproduce a thousand-agent reasoning result. Compare answer quality against a competent single-agent and independent-candidate baseline before attributing a gain to collaboration.
