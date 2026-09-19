# Verification record

Initial edition: 2026-09-19.

## Evidence boundaries

Product descriptions and protocol examples were checked against primary documentation, specifications, model cards, and maintainers' repositories. Topic pages carry their source-review date and link to supporting material. Pricing and benchmark sources are provided without claiming an independently reproduced ranking.

The local checks below validate this repository's structure and educational example. No live provider inference, hosted agent session, MCP interoperability, OAuth integration, retrieval backend, UI framework, or external coding agent was executed as part of this edition. Their examples remain source-reviewed and illustrative.

## Local environment

| Component | Version used |
| --- | --- |
| Node.js | v24.19.0 |
| Python | 3.12.14 |
| External dependencies for the example/checker | None |

The example targets Node.js 20+ and the checker Python 3.10+. These minimum versions were not separately tested; the exact execution versions are listed above.

## Commands

```sh
python3 scripts/check_docs.py
node --test examples/tool-loop/agent-loop.test.mjs
node examples/tool-loop/demo.mjs
git diff --check
```

The documentation checker passed across **64 Markdown files and 30 JSON blocks**. It validates local links and heading fragments, chapter index coverage, reachability from the root README, fence balance, and JSON-fence syntax. It inventories external URLs without fetching them. It is a checker for this repository's inline-link conventions, not a complete CommonMark parser or an external-link availability test. `git diff --check` also passed.

The offline example's **13 behavior tests pass**. They cover tool-call/result identity, argument validation, unknown tools, non-disclosing workspace denial, user membership, turn and call budgets, invalid-attempt accounting, cancellation boundaries, sanitized tool errors, and duplicate call IDs. The demonstration produces `TASK-1: Review login flow — todo.` using two scripted model turns and one tool call.

## Review corrections

Independent chapter review checked category boundaries, API examples, product identities, and claims of evidence. It led to a clearer distinction between suspended and terminal runs, use of released MCP security guidance, and an explicit note that the illustrative Cognee Python workflow can call configured paid model services.

The handbook documents MCP 2026-07-28 separately from its legacy 2025-11-25 handshake. It distinguishes assistant-ui Elements from Vercel AI Elements; identifies both OpenUI projects; identifies the requested Codex Proxy as `icebear0828/codex-proxy`; and separates managed inference, agent harnesses, and execution environments. Follow-up source review incorporates the supplied Graphify website and Grok Bot announcement while preserving the distinction between documented capabilities and tested integrations.

## Continuous checks

The [GitHub Actions workflow](.github/workflows/checks.yml) runs the documentation checker, offline tests, and demonstration on pushes and pull requests. It uses read-only repository permissions and action versions pinned to reviewed commit SHAs. It makes no model API calls.

External source review remains a separate maintenance task. A working URL can change its content, and a locally valid JSON example does not prove interoperability with a live implementation.
