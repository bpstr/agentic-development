# Handbook plan

Status: initial edition implemented and locally verified on 2026-09-19. The original scope and delivery sequence are recorded below; [VERIFICATION.md](VERIFICATION.md) describes the completed checks and evidence boundaries.

## Purpose

Build a navigable handbook for developers who need to understand, build, operate, and extend agentic systems. Explain the categories before comparing representative implementations. A reader should leave a topic knowing what it does, where it belongs, when it helps, and which primary resources to read next.

## Information architecture

| Location | Question it answers | Initial coverage |
| --- | --- | --- |
| `docs/00-orientation/` | How should I navigate this field? | System map, learning paths, evidence policy |
| `docs/01-foundations/` | What are the basic building blocks? | Models, agents, workflows, context, prompting |
| `docs/02-models-and-providers/` | Which model capabilities do I need? | OpenAI, Anthropic, Google, xAI, open weights, selection, benchmarks |
| `docs/03-calling-models/` | What actually crosses the API boundary? | Requests, responses, structured output, streaming, tool loop |
| `docs/04-tools-and-protocols/` | How does an agent reach other capabilities? | MCP, discovery, authentication, A2A, protocol distinctions |
| `docs/05-orchestration/` | Who controls execution and remembers progress? | Loops, state, workers, delegation, LangChain, LangGraph, SDKs |
| `docs/06-knowledge-and-memory/` | How does a system use external knowledge? | RAG, GraphRAG, Cognee, indexing, memory and provenance |
| `docs/07-interfaces-and-rendering/` | How do people see and direct the work? | assistant-ui, AI Elements, generative UI, OpenUI, A2UI, voice |
| `docs/08-hosting-and-delivery/` | Where does each part run? | Model serving, agent runtimes, gateways, local/cloud deployment |
| `docs/09-evaluation-and-operations/` | How do we know it works well? | Tracing, evaluations, reliability, security, cost, latency |
| `docs/10-development-workflows/` | How do developers work with and extend agents? | Codex, Claude Code, skills, plugins, proxies, code intelligence |
| `docs/11-recipes/` | How do the parts fit into a small application? | A bounded tool loop, grounded answers, background work |
| `docs/12-reference/` | Where can I find a term or a deeper source? | Glossary, tool/category index, source index, coverage map |

The orientation is chapter zero; the remaining twelve chapters are reading destinations. Backend and frontend are implementation locations within this map, rather than the only organizing dimensions.

## Writing contract

1. Begin with a short definition and the problem the topic addresses.
2. Explain the mechanism and the boundary with adjacent concepts.
3. Give an original, small example or decision table.
4. Describe the meaningful limits and operational tradeoffs.
5. Link directly to primary documentation, specifications, papers, or maintainers' repositories.
6. Include related handbook topics and a source-review date for changing product details.

Most topic pages should be readable in a few minutes. Split pages when they contain distinct questions, not simply when another vendor enters the market. Crosslink shared concepts rather than repeating a full explanation in every tool profile.

## Curation and evidence

- Favor established categories and implementations with maintained public documentation and a reproducible integration path. Popularity alone does not establish reliability.
- Separate **source-reviewed** product descriptions, **locally tested** examples, and **illustrative** snippets. Do not claim production testing of external products without a reproducible record.
- Explain benchmark methods and point to results. Do not maintain an unsourced ranking or a table of prices likely to become stale.
- Verify explicitly requested model names, current API surfaces, protocol versions, and project identities. Record ambiguity instead of inventing a mapping.
- Keep emerging protocols and community utilities in clearly identified sections with their limitations. They do not become default recommendations by appearing in this handbook.

## Delivery sequence

1. Establish the chapter map, page conventions, evidence labels, and navigation.
2. Research primary sources and write complete first-pass pages across all requested categories.
3. Add small recipes and an offline, deterministic tool-loop example with meaningful behavior checks. No paid provider calls are required for repository validation.
4. Build a glossary and an index mapping the requested fragments into the chapters.
5. Validate local links, Markdown structure, example behavior, and source/version consistency. Review crosschapter boundaries and remove duplicate or unsupported claims.
6. Commit and publish the initial handbook to this repository, preserving the existing MIT license.

## Future expansion criteria

Add a topic when it explains a missing mechanism or a recurring implementation decision. Add a product profile when it offers a representative approach that existing profiles do not explain. Version-specific integration examples can follow when their dependency versions, setup, expected output, and verification date are recorded.

Potential later work includes provider-backed examples, reproducible retrieval evaluations, deployment walkthroughs, and a generated documentation site. The initial edition is useful directly on GitHub and requires no site generator.
