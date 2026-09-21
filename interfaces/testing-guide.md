# Testing advanced assistant-ui workflows

Companion to **IMPLEMENTATION-MANUAL.md**. Research snapshot: **21 September 2026**.

This is a proposed production test plan. Only the small reference selector suite included in this package has been executed. The browser, runtime-adapter, accessibility, security, and integration checks below remain implementation work in the target application.

## 1. Test the protocol and interaction, not the wording of a live model

Most UI correctness tests should not call a live model. Use deterministic event fixtures to control exactly when arguments, progress, approvals, results, and terminal states arrive. A live-model test can verify integration, but it is a poor way to reproduce a double-click race or a connection loss after a committed write.

Use four layers:

| Layer | What it verifies | Typical implementation |
|---|---|---|
| Pure projection/selector tests | Identity, state transitions, replay, partial/final semantics, derived labels | Unit tests with fixed events and snapshots |
| Component fixtures | Each visible state, form validation, fallback rendering, keyboard behavior | Storybook or a dedicated fixture route plus component tests |
| Browser workflow tests | Streaming, reload, navigation, multiple tabs, offline/online, focus, real user actions | Playwright against a controllable local stream service |
| Limited live integration | Actual adapter/provider compatibility, event shapes, permissions, continuation | Small stable smoke suite with nonconsequential tools |

Add manual screen-reader testing, security review, and performance traces. No single automated layer replaces them.

## 2. Build a controllable stream harness

The fixture server should be able to pause after a named event; emit an arbitrary number of chunks; disconnect before or after a command acknowledgement; duplicate an event; introduce a sequence gap; resume with replay; and finish without producing text.

Use a real local streaming endpoint for chunk-timing tests. A single mocked response body is useful for content/error tests but does not faithfully test delayed progressive delivery. Playwright's network controls remain useful for ordinary requests, failures, and test orchestration. [S41 in the manual]

Separate three concepts in the fixture:

```text
server facts:      what actually committed
wire delivery:     which facts this browser has received
user interactions: clicks, typing, navigation, refresh
```

A command can commit while its response is lost. Tests must be able to model that distinction.

### Fixture conventions supplied in this package

`fixtures/workflow-scenarios.json` contains declarative schedules for an example application event envelope. It is not an AI SDK, OpenAI, AG-UI, or assistant-ui wire format. Adapt it at your projection boundary.

- `atMs` is an artificial delivery time, not a latency claim.
- `kind: "event"` delivers a server fact to the test client.
- `kind: "interaction"` describes a user action the harness should perform.
- `kind: "network"` changes transport delivery or command response behavior.
- `kind: "render-fault"` asks the harness to make a particular renderer fail.
- `assertions` describes the required outcome; the JSON is not itself an executable browser test runner.

`fixtures/tool-presentations.json` is different: it is directly executed by the included selector tests.

## 3. Core invariants for the projection layer

Write these as executable properties, not just example-based checks:

**Idempotence.** Reapplying an already-applied event does not change projected state. Reconnect must not duplicate text, logs, tool cards, or committed-action badges.

**Ordering.** An out-of-order delta cannot attach to the wrong part. A missing prerequisite produces a controlled resynchronization path, not corrupted content.

**Snapshot equivalence.** A valid snapshot through N plus subsequent events produces the same state as the full history through that point. Keep unresolved local commands separate from the canonical snapshot.

**Identity isolation.** Events for another thread, run, attempt, part, or approval do not modify the current object's state. Same-name tools remain independent.

**No invented success.** Missing output, preliminary output, an accepted approval, a completed argument stream, or a disconnected transport cannot become successful execution by implication.

**Terminal truth.** Finished work has no active progress animation. Preserve authoritative committed receipts even when a parent run later cancels. Reject obsolete deltas without discarding legitimate reconciliation facts.

**Command safety.** View rendering and event replay issue zero mutation commands. A user command has one identity across retries of an uncertain submission.

**Presentation isolation.** Renderer exceptions never change the underlying tool outcome or automatically invoke a retry.

Property-based tests should generate repeated events, allowed reorderings, thread switches, and cancellation races. Do not generate arbitrary nonsensical state transitions and then “fix” them silently; invalid inputs should be rejected, quarantined, or trigger a defined resync policy.

## 4. Acceptance matrix

**P0** means release-blocking for the basic conversation contract. **P0/F** means release-blocking whenever that feature is enabled. **P1** means important polish/reliability coverage that should follow promptly; it is not permission to ship unsafe behavior.

### A. Sending, text, and basic parts

| ID | Priority | Setup/action | Required visible behavior | Must not happen |
|---|---|---|---|---|
| T01 | P0 | Send; delay acknowledgement | Pending user submission; recoverable draft | Claim work accepted before acknowledgement |
| T02 | P0 | Reject send before acceptance | Clear error; draft preserved; safe retry | Lost text or duplicate message |
| T03 | P0 | Commit send; drop response | Outcome-unknown then reconcile same command | Start a second run blindly |
| T04 | P0 | Double click Send / press Enter twice | One accepted instruction | Duplicate message or run |
| T05 | P0 | Delay first text | Stable shell and truthful pending phase | Empty unexplained bubble or invented activity |
| T06 | P0 | Split text across UTF-8/network boundaries | Correct complete text | Replacement characters or dropped fragments |
| T07 | P0 | Stream incomplete Markdown/code/table | Readable stable partial display | Thread crash or repeated remounting |
| T08 | P0 | Finish text part; start a tool afterward | Text finalized; run remains active | Premature run completion |
| T09 | P0 | Terminal run with no final text | Useful tool results/terminal explanation remain | Endless spinner |
| T10 | P0 | Unsupported part type or schema version | Safe fallback/resync policy | Entire thread crash or unsafe HTML |

### B. Tool identity and lifecycle

| ID | Priority | Setup/action | Required visible behavior | Must not happen |
|---|---|---|---|---|
| T11 | P0/F | Arguments stream slowly | Preparing request with safe partial preview | Claim execution started |
| T12 | P0/F | Arguments finish; executor starts later | Queued/preparing state until actual start | Success based on tool-call-end |
| T13 | P0/F | Final result is null/false/0/empty | Valid completed result | Truthiness interpreted as missing/failure |
| T14 | P0/F | Preliminary result then final result | Partial content remains active until final | Early success checkmark |
| T15 | P0/F | Error payload in otherwise complete tool part | Failure outcome and useful details | Green completed-success badge |
| T16 | P0/F | Three same-name tools run in parallel | Independent states with stable labels | Shared state keyed by tool name |
| T17 | P0/F | Results arrive C, A, B | Correct result attached to each call | Completion-order reassignment |
| T18 | P0/F | One optional tool fails | Partial result and explicit failed child | Erase successful siblings |
| T19 | P0/F | Retry one failed tool | New attempt linked to previous attempt | Replay every earlier tool |
| T20 | P0/F | Unknown tool name | Safe lifecycle-aware generic renderer | Automatic failure or missing entire message |
| T21 | P0/F | Successful result has malformed display data | Completed action; unavailable result view | Retry mutation due to display failure |
| T22 | P0/F | React Strict Mode/remount/expand/collapse | No execution caused by rendering | Duplicate tool dispatch |

### C. Approvals and human interaction

| ID | Priority | Setup/action | Required visible behavior | Must not happen |
|---|---|---|---|---|
| T23 | P0/F | No approval object exists | No authorization buttons | Optional-chain undefined creates false gate |
| T24 | P0/F | Unresolved approval arrives | Action, target, scope, allow/deny visible | Approval buried in collapsed history |
| T25 | P0/F | Click Allow; delay acknowledgement | Submitting decision, duplicate prevention | Claim action committed |
| T26 | P0/F | Approval submission rejected | Explanation; request retryable when valid | Permanently spent local controls |
| T27 | P0/F | Decision commits; response lost | Reconcile same approval | Double-authorize or run twice |
| T28 | P0/F | Second tab resolves request first | Read-only recorded decision in first tab | Conflicting second execution |
| T29 | P0/F | Approval expires/cancels while open | Closed expired/cancelled card | Old buttons remain usable |
| T30 | P0/F | Proposal changes after user review | Stale notice/new approval required | Reuse consent for changed arguments |
| T31 | P0/F | Deny approval | Denial recorded distinctly | Generic failure retry automatically runs tool |
| T32 | P0/F | Always-allow capability absent | Option omitted | Invented local permission grant |
| T33 | P0/F | Human form invalid/submit fails | Field errors; values preserved | Lost input or falsely completed tool |
| T34 | P0/F | Form schema/request revision changes | Explicit stale-form behavior | Submit answers to wrong request |

### D. Recovery and cancellation

| ID | Priority | Setup/action | Required visible behavior | Must not happen |
|---|---|---|---|---|
| T35 | P0 | Disconnect during text | Preserve output; show connection state | Mark execution failed automatically |
| T36 | P0 | Reconnect with duplicate deltas | Transcript unchanged by duplicates | Repeated words/logs/cards |
| T37 | P0 | Gap in event sequence | Controlled buffering/resync | Silently skip required facts |
| T38 | P0 | Replay window expired | Restore canonical snapshot | Append full snapshot to existing transcript |
| T39 | P0 | Refresh during active run | Restore same run and partial content | Start again or lose all partial output |
| T40 | P0/F | Refresh while awaiting approval | Restore same request and decision state | New unrelated approval identity |
| T41 | P0 | Switch threads; old stream sends late data | Correct thread isolation | Old output appears in new conversation |
| T42 | P0 | Click Stop online | Stopping, then confirmed outcome | Abort display claimed as durable cancellation |
| T43 | P0 | Click Stop offline | Cancellation unconfirmed; reconcile later | False “Stopped” confirmation |
| T44 | P0 | Run completes as Stop is processed | Authoritative completed/cancelled outcome | Impossible mixed success/cancel copy |
| T45 | P0/F | Mutation commits before cancellation | Receipt remains; later work cancelled | Claim rollback happened |
| T46 | P0 | Old Stop command arrives after new run starts | Targets old run only | New run cancelled accidentally |
| T47 | P0 | Auth expires during stream | Clear sign-in path; preserve safe local work | Retry storm or unauthorized actions |
| T48 | P0 | Provider/step/length limit/refusal | Specific terminal/incomplete state | Endless loading or misleading generic retry |

### E. Code, artifacts, and application actions

| ID | Priority | Setup/action | Required visible behavior | Must not happen |
|---|---|---|---|---|
| T49 | P0/F | Command exits 1 after useful stdout | Nonzero failure and preserved logs | Terminal says exit 0 |
| T50 | P0/F | Command killed by signal/timeout | Correct termination state | Blank or successful result |
| T51 | P0/F | Replayed stdout/stderr chunks | Deduplicated, distinguishable streams | Duplicated logs or merged meaning |
| T52 | P0/F | Very large logs | Bounded view; truncation/full-log path | Unbounded DOM/memory growth |
| T53 | P0/F | User edits code while old attempt runs | Output labelled with executed revision | Old result attributed to new code |
| T54 | P0/F | Diff selects none/discards all | No accidental Apply mutation | Empty patch falsely shown as applied |
| T55 | P0/F | Document changes before Apply | Conflict/stale result; re-review path | Silent apply to different revision |
| T56 | P0/F | Apply commits but response drops | Receipt reconciliation | Duplicate application |
| T57 | P0/F | Widget changes task seen elsewhere | Chat and task view converge on same revision | Optimistic and realtime duplicates |
| T58 | P0/F | Artifact URL expires/access revoked | Unavailable/refetch/auth state | Broken preview portrayed as ready |
| T59 | P0/F | Generated preview attempts privileged navigation | Sandboxed/blocked | Access to application credentials |
| T60 | P0/F | Result renderer throws after committed action | Completed action + display fallback | Automatic action retry |

### F. Composer, queue, branches, and background jobs

| ID | Priority | Setup/action | Required visible behavior | Must not happen |
|---|---|---|---|---|
| T61 | P0 | Type with IME and confirm composition | Text composition works | Premature Send |
| T62 | P0 | Draft while response streams | Draft remains responsive and intact | Stop control becomes unreachable |
| T63 | P0/F | Queue message, cancel foreground run | Explicit queue continuation/pause policy | Unexpected queued mutation executes |
| T64 | P0/F | Switch branch with queued message/open decision | Explicit rebase/discard/block policy | Pending work applied to wrong branch |
| T65 | P0/F | Regenerate a turn that made changes | New response branch; old receipts preserved | Real-world side effects silently repeated |
| T66 | P0/F | Background job plus foreground reply | Separate progress and cancel scopes | Entire composer locked by unrelated job |
| T67 | P0/F | Close tab while server job continues | Correct state after reopening | Implicit job cancellation on unmount |
| T68 | P0/F | Attachment upload fails/is removed | Clear per-file state and removal cleanup | Submit broken attachment as ready |

### G. Accessibility, security, and performance

| ID | Priority | Setup/action | Required visible behavior | Must not happen |
|---|---|---|---|---|
| T69 | P0 | Keyboard-only conversation and decisions | All controls reachable; visible focus | Focus trap or inaccessible allow/deny |
| T70 | P0 | Screen reader during busy parallel stream | Meaningful restrained status updates | Every token/log line announced |
| T71 | P0 | Reduced motion enabled | Nonessential animation suppressed | Continuous decorative movement required for meaning |
| T72 | P0 | User scrolls up while output arrives | Position preserved; new-activity control | Forced return to bottom |
| T73 | P0 | Prepend history/collapse tool above viewport | Stable reading anchor | Large unexplained scroll jump |
| T74 | P0 | Narrow screen/zoom/mobile keyboard | Composer and actions usable | Controls hidden under keyboard/panel |
| T75 | P0 | Unsafe Markdown/URLs/raw HTML/tool labels | Sanitized or rejected safe display | Script execution or unsafe navigation |
| T76 | P0 | Secrets in tool args/error payloads | Redacted UI, copy, telemetry, shares | Credentials leaked through fallback |
| T77 | P0/F | Stale or unauthorized artifact/card action | Revalidation and explanation | Action trusted because a button exists |
| T78 | P1 | Long thread with live typing and logs | Meets measured responsiveness budget | Full-history re-render on every token |
| T79 | P1 | Repeatedly switch/open long threads | Stable listeners and memory | Growing subscriptions/buffers |
| T80 | P1 | Lazy-load large renderer during stream | Stable placeholder and usable composer | Layout collapse or input freeze |

## 5. Component fixture inventory

Give each shared renderer a fixture for every meaningful state, not just loading and success:

```text
tool:       preparing / queued / running / partial / succeeded / failed /
            cancelled / denied / unknown / unsupported-result
approval:   request / submitting / accepted / denied / expired / cancelled /
            stale / submit-failed / resolved-in-other-tab
execution:  queued / running-no-output / running-output / exit-zero /
            exit-nonzero / signal / timeout / cancelled / truncated-logs
artifact:   drafting / ready / saving / saved / save-failed /
            stale-revision / access-denied / expired-url / preview-crash
connection: connecting / online / offline / reconnecting / resyncing /
            auth-required / unable-to-resume
composer:   draft / sending / run-active / queued / offline /
            attachment-processing / auth-required
```

Include long labels, empty content, RTL/bidirectional text as a layout fixture when your product supports it, emoji, long unbroken strings, narrow widths, and high zoom. Use semantic assertions for labels/states and visual snapshots for layout. Keep screenshot baselines small and deterministic; broad full-page screenshots of changing timestamps are noisy.

## 6. Browser testing patterns

A useful test reads like this pseudocode:

```ts
// Harness API is proposed application test code, not a Playwright API.
await harness.load("approval-timeout-after-commit");
await page.goto(harness.threadUrl);
await page.getByRole("button", { name: "Approve task update" }).click();
await harness.waitForServerFact("approval.resolved");
await harness.dropDecisionResponse();
await expect(page.getByText("Checking decision status")).toBeVisible();
await harness.reconnect();
await expect(page.getByText("Task updated")).toBeVisible();
expect(await harness.countCommands("apply-task-update")).toBe(1);
```

Use two browser contexts or pages for multi-tab/multi-user decisions. Model a tab going offline without falsely stopping the fixture server. For cancellation, assert both the visible state and the exact run ID targeted by the command.

Observe the application's command boundary in tests. “The UI looks right” is not sufficient if two identical writes were sent.

## 7. Performance experiments

Start with representative fixtures rather than a synthetic empty conversation. Suggested stress inputs, not promises about supported limits:

| Fixture | What to measure |
|---|---|
| 100 existing messages plus one active text stream | Event-to-paint delay, typing responsiveness, re-render fan-out |
| 10 parallel tool rows with mixed progress | CPU, layout shifts, status announcement volume |
| A long code response plus syntax highlighting | Main-thread long tasks and incremental rendering cost |
| 10,000 log lines | DOM count, memory, truncation behavior, scroll anchoring |
| A large diff opened during streaming | Lazy-load cost and composer responsiveness |
| Refresh during a long restored run | Hydration/reconciliation duration and duplicate prevention |
| 50 repeated thread switches | Listener counts, retained buffers, heap growth |

Record browser version, hardware, throttling, data sizes, and percentiles. Separate time spent waiting on the model from frontend event processing. Use an actual mobile device for keyboard/viewport behavior before release.

## 8. What has actually been executed in this package

The dependency-free TypeScript selector was executed under **Node v22.16.0** using built-in test tooling and experimental type stripping. It passed **36 tests**: 34 JSON fixture cases and two additional tests for explicit undefined output and complete application-phase coverage.

These tests verify conservative state presentation, valid empty results, preliminary output, failure/cancellation/expiry, approval presence, and isolation of rendering failure from execution success. They also check deterministic output and nonmutation of fixture inputs.

They do **not** verify assistant-ui package compatibility, JSX compilation, network replay, actual tool execution, browser behavior, accessibility, or security. Run those layers in the target project using this guide.

## 9. Release evidence template

For each enabled workflow, record the package/adapter versions, relevant test IDs, pass/fail evidence, manual accessibility result, performance trace, and known limitations. An example release entry:

```text
Workflow: task update with approval
Versions: project lockfile commit + copied element source revision
Required tests: T03, T16, T24–T31, T39–T46, T55–T60, T69–T77
Command evidence: exactly one committed mutation across timeout/reconnect
Restore evidence: same approvalId/runId after reload
Accessibility: keyboard and screen-reader walkthrough recorded
Performance: fixture/device/trace attached
Limitations: no persistent always-allow policy; option not exposed
```

The release gate is not “all animations look good.” It is: the UI accurately represents what happened, permits only meaningful next actions, and remains usable when the ideal request/response path breaks.