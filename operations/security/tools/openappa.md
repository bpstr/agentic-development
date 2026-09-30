# OpenAPPA

[Project site](https://www.openappa.com/) · [How it works](https://www.openappa.com/how-it-works) · [Add to an agent](https://www.openappa.com/add-to-agent) · [Policy contracts](https://www.openappa.com/contracts) · [Canonical repository](https://github.com/archestra-ai/OpenAPPA) · [APPA paper](https://arxiv.org/abs/2607.24625)

OpenAPPA is an open-source, MIT-licensed reference monitor that sits between an agent and its tools. Before a tool runs, it asks whether the data already in the trajectory is allowed to reach the proposed destination. The decision comes from APPA (Agentic Permissions Policy Algebra), not from another model prompt, so the same event log yields the same allow or deny.

It implements [tool authorization](../tool-authorization.md) and [policy enforcement](../../governance/policy-enforcement.md) as information-flow control rather than as a static allow-list of tool names. That distinction matters for [prompt injection](../prompt-injection.md): a retrieved page can still instruct the model to leak a customer list, but the monitor can refuse the outbound call after the untrusted read has already narrowed the session label.

The authors describe the project as a preview and RFC. Config and wire surfaces may change; treat current examples as the inspected public contract, not a frozen API.

## What it tracks

Each trajectory carries a label that only becomes more restrictive:

- **Audience** — who may receive data already read (for example a private workspace versus a public channel).
- **Trust** — whether sources so far are treated as internal or unvetted.
- **Effects** — recorded side effects such as egress, used by later `requires` checks.
- **Attention** — a one-shot approval requirement for a concrete action; it does not relax the rest of the label.

Reading a private repository narrows audience. Reading an untrusted webpage lowers trust. A later `send_email` that would carry that mix to an external address can fail the contract even when the same tool was allowed at the start of the session.

Policy lives in declarative `appa.toml`. A tool contract can declare:

- `delta` — how a successful result changes the label;
- `requires` — audience, trust, effects, or attention the call must already satisfy;
- `effects` — side effects recorded after success.

Contracts match on tool identity and optional argument selectors. Unmatched calls need a wildcard annotator or they fail closed. Reusable bundles (`include` / batteries) package audience sources and sanitizers for common integrations.

## Where it runs

The engine is designed to decide from the event log alone, without network or file I/O during the check. Hosts can embed the runtime in-process or run it as a local sidecar that receives hook events over HTTP (`POST /hook`).

Hook points cover the agent lifecycle rather than only the tool name:

- `session_start` — acknowledge or refuse the session;
- `tool_call` — allow, deny with a remedy offer, or pass control to a remedy handler;
- `tool_result` — deliver, replace, or withhold the result before it re-enters context;
- `turn_end`, plus child-trajectory events for isolated reads.

Official integration surfaces include a Claude Code plugin (`appa plugin install claude-code`, then `clappa` for a protected session), a Python binding, and a Rust example agent. Other languages can speak the hook protocol. Installers and plugin names should be taken from the current [add-to-agent](https://www.openappa.com/add-to-agent) and repository README; they are preview surfaces.

## Recovery instead of only abort

A deny is not only a hard stop. The monitor can return a machine-readable remedy plan:

- **Sanitizers** transform a payload (mask secrets, redact PII) so a wider audience becomes legal.
- **Authorities** approve one specific blocked action through a human or an internal service; approval does not broaden the session label.
- **Subagent reads** confine an untrusted fetch to a disposable child trajectory and admit only a shape-bounded return.
- **Withholding** can record an effect without admitting the raw result into parent context.

This is the practical difference from abort-only information-flow barriers: the agent can continue along an allowed path instead of stalling on the first tainted read. It is still not a substitute for [application authorization](../tool-authorization.md) or [sandboxing](../sandboxing.md). OpenAPPA constrains flows the policy describes; it does not invent tenant ACLs, filesystem isolation, or secret storage.

## Limits

- Coverage is only as complete as the tool contracts. An unannotated tool, a host that skips hooks, or a side channel outside the monitor is outside the guarantee.
- Labels do not relax after a sensitive or untrusted read. Utility then depends on sanitizers, authorities, and confined subagents being wired and tested.
- Annotators and model-based sanitizers reintroduce non-determinism at classification time; the subsequent allow/deny on a given label remains algebraic.
- Published evaluation numbers (task completion versus attack success versus auto-mode or FIDES) come from the authors' benches. Reproduce them on the application's own tools before treating them as a local security property. [Evaluation](https://www.openappa.com/evaluation), [paper](https://arxiv.org/abs/2607.24625).
- Preview policy language and hook schemas can break without compatibility shims.

Pair OpenAPPA with the usual agent-security tests in [prompt injection](../prompt-injection.md): a model-driven injection through retrieval, and a deterministic test that injects a forbidden tool call even when the model is assumed compromised. A polite refusal in the final answer is not evidence unless the outbound effect also did not occur.
