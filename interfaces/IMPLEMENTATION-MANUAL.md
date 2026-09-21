# Building a production-grade assistant-ui chat interface

**A frontend implementation manual for streamed tools, interactive workflows, reliable recovery, and high-end conversation UX**

Research snapshot: **21 September 2026**. Target environment: React + TypeScript; compatible in architectural terms with a Vite application and shadcn-based UI. Examples use the assistant-ui API shapes documented on the research date, not a promise about an older installed version.

## Contents

1. The central design decision
2. What to learn from existing implementations
3. Application architecture and runtime selection
4. Model the states that users actually experience
5. Connect a real streamed tool to an Element
6. Translate protocol events without inventing progress
7. Scenario implementation playbooks
8. Connection failure, recovery, cancellation, and retry
9. Composer, scrolling, navigation, and branching
10. Rendering, security, accessibility, and performance
11. Implementation sequence and definition of done
12. Primary-source reading map

The companion **TESTING-GUIDE.md** contains the detailed acceptance matrix. The `examples/` directory contains a tested presentation selector, not a complete chat application.

---

## 1. The central design decision

**A production chat interface is a projection of workflow state, not a Markdown stream with animations attached.**

The user needs to know whether a request was received, whether a tool is only being prepared or is actually executing, whether a decision is required, what changed in the application, and what can safely happen next. Those facts must survive refreshes, reconnects, and navigation. A spinner cannot supply them.

assistant-ui Elements offers useful building blocks. Its documentation now includes runtime-connected and standalone examples for many elements, so the missing material is not simply “how to import a component.” The difficult part is specifying the cross-component lifecycle and deciding which signal is authoritative. The catalog is a starting point, not an implementation contract for your application. [S01]

### The recommended boundary for Assign Discuss

Keep Core as the owner of conversation history, run identity, approvals, and committed action receipts. Build a frontend projection of that state, then bridge it into assistant-ui using an ExternalStoreRuntime. Do not introduce another independent conversation database inside the chat components. Do not require a Next.js migration simply because an example uses an API route.

This recommendation is an architectural fit for an existing server-owned Discuss workflow, not a requirement of assistant-ui. ExternalStoreRuntime is specifically the integration option for externally managed message state. [S03]

```text
Core events / snapshots / command responses
                  |
       validate + normalize once
                  |
      replay-safe conversation store
       |                       |
 message/run/tool facts    command submission state
       |                       |
       +---- assistant-ui runtime bridge ----+
                                             |
                            typed parts + renderer registry
                                             |
                          Elements / custom cards / composer
```

There are two important independent paths:

```text
READ:   durable facts -> state -> visible UI
WRITE:  explicit user interaction -> command -> acknowledgement -> durable facts
```

Rendering the read path must never trigger the write path. Expanding a tool card, remounting a component, replaying a stream, or opening the same chat in another tab must not execute a tool again.

### What “mandatory” means in this manual

A requirement is mandatory when omitting it would misrepresent an outcome, lose user work, make an advertised feature unsafe, or prevent recovery from a common failure. A feature can remain out of scope. However, once the UI offers an approval button, cancellation, code execution, or an artifact preview, its associated correctness and safety requirements are not optional polish.

---

## 2. What to learn from existing implementations

Study complete workflows, not only screenshots. The following references answer different questions.

| Reference | Useful material to extract | What not to assume |
|---|---|---|
| assistant-ui ChatGPT example | Conversation composition, action placement, composer modes, familiar thread layout. [S27] | A similar appearance does not provide your persistence, cancellation, or permission semantics. |
| assistant-ui Artifacts example | Chat alongside an artifact/code workspace. [S28] | A visible preview is not evidence that generated content is safe or saved. |
| assistant-ui Elements | Tool presentation, execution displays, approvals, diffs, attention states, thread building blocks. [S01] | Standalone demonstrations may need lifecycle extensions. |
| LangGraph Agent Chat UI | Tool activity and interrupt-driven interaction around a running agent. [S29] | Adopting those UI patterns does not require changing your agent framework. |
| ChatKit.js and custom integration guide | Rich conversation widgets and actions that are not ordinary text messages. [S30, S31] | ChatKit and assistant-ui are different integration models, not interchangeable component packages. |
| OpenAI advanced ChatKit samples | Customer Support illustrates application-state updates; Metro Map illustrates chat-driven interaction with a visual application. [S32] | Their backend setup is an example, not a dependency of your React UI. |
| Vercel AI Elements Tool and Confirmation | Explicit input/output/approval presentation states. [S33, S34] | Vercel AI Elements and assistant-ui Elements have different APIs. |
| Vercel AI Elements IDE example and Chatbot | A richer workspace around conversation, including execution/artifact patterns. [S35, S36] | Copying the whole framework stack is unnecessary. |

### A productive reading exercise

Pick one workflow, such as “search documents, propose an edit, request approval, apply it, show the changed document.” For every reference, answer the same questions: where is the pending request shown, what enables the action button, how is acknowledgement shown, what happens on denial, and what remains after refresh?

A reference is genuinely useful when it clarifies these transitions. A component that only animates a preset transcript is useful for visual design, not proof of recovery behavior.

---

## 3. Application architecture and runtime selection

### 3.1 Choose one authoritative conversation store

| Existing situation | Sensible starting point | Frontend responsibility |
|---|---|---|
| Core already persists messages, runs, approvals, and ordered events | `useExternalStoreRuntime` | Normalize Core facts into messages and wire explicit command callbacks. |
| The application already treats AI SDK chat state as its conversation state | assistant-ui AI SDK runtime | Use the matching SDK stream/approval semantics and add persistence/recovery appropriate to that stack. |
| A graph-backed application already exposes supported stream and interrupt semantics | Matching graph runtime | Map graph state into user-understandable activities and decisions. |
| A custom command/state transport is desired without an existing store | AssistantTransport runtime | Define transport state and commands clearly; keep its adapter isolated. |

The runtime selection and integration guides document these options. AssistantTransport is a custom transport integration; it should not be confused with similarly named AI SDK transport classes. [S02, S19, S20]

For Assign, prefer the first row. Reusing assistant-ui does not require the browser to consume a provider's raw events. Core can expose a small, stable UI contract while providers change underneath it.

### 3.2 Suggested frontend module boundaries

```text
chat/
  contract/
    events.ts                 # application-owned event union
    commands.ts               # user intent and acknowledgement types
    decoders.ts               # runtime validation and version checks
  projection/
    conversation-store.ts
    reduce-event.ts
    reconcile-snapshot.ts
    selectors.ts
    tool-presentation.ts
  transport/
    subscribe.ts
    recovery.ts
    command-client.ts
  runtime/
    AssistantProvider.tsx
    convert-message.ts
    capabilities.ts
  renderers/
    toolkit.tsx
    ToolActivity.tsx
    ApprovalRequest.tsx
    ExecutionOutput.tsx
    ReviewChanges.tsx
    ArtifactCard.tsx
    UnknownPart.tsx
  thread/
    ConversationViewport.tsx
    Composer.tsx
    RunSummary.tsx
    ConnectionBanner.tsx
  tests/
    fixtures/
    projection/
    components/
    browser/
```

Do not put transport parsing into `ToolActivity.tsx`, approval persistence into `ApprovalRequest.tsx`, or model execution into a React effect. Those boundaries make replay and component testing possible.

### 3.3 Runtime bridge: the application-specific seam

The current ExternalStore API exposes distinct callbacks for sending, cancelling, regenerating, resuming, adding tool results, resuming a suspended tool, and responding to a tool approval. `onRefetchThread` reloads stored state; it is not the same operation as regeneration through `onReload`. [S04]

The following is an **integration template**, not a drop-in application. `useDiscussProjection`, `commands`, and `convertCoreMessage` are your code. They must preserve IDs and honor the callback types in your installed package.

```tsx
import type { PropsWithChildren } from "react";
import {
  AssistantRuntimeProvider,
  AuiConfig,
  Tools,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import { toolkit } from "./toolkit";

export function DiscussAssistantProvider({ children }: PropsWithChildren) {
  const view = useDiscussProjection(); // app-owned cached snapshot

  const runtime = useExternalStoreRuntime({
    messages: view.messages,
    convertMessage: convertCoreMessage,
    isRunning: view.foregroundRunIsActive,
    isSendDisabled: !view.canSubmit,
    onNew: commands.sendMessage,
    onCancel: commands.cancelForegroundRun,
    onReload: commands.regenerateFromParent,
    onResume: commands.resumeForegroundRun,
    onRefetchThread: commands.refetchCurrentThread,
    onAddToolResult: commands.submitHumanToolResult,
    onResumeToolCall: commands.resumeSuspendedTool,
    onRespondToToolApproval: commands.respondToToolApproval,
  });

  const config = AuiConfig({ tools: Tools({ toolkit }) });
  return (
    <AssistantRuntimeProvider runtime={runtime} config={config}>
      {children}
    </AssistantRuntimeProvider>
  );
}
```

Implementation obligations for these application functions:

- Capture the exact thread, run, branch, and request identity when the command begins. Do not read a different “currently selected thread” after an `await`.
- Treat a transport timeout as an unknown outcome until reconciled. A rejected HTTP promise does not prove a write failed.
- Include idempotency and expected revision where the operation requires them.
- Make unsupported capabilities unavailable. A visible nonfunctional button is worse than omitting the feature.
- Read the foreground run separately from background jobs. A document export should not necessarily disable all conversation input.
- Preserve the user's draft even when submission is disabled.

For a server-executed tool set, leave any automatic client-execution pipeline disabled. The ExternalStore API explicitly warns that enabling an additional invocation pipeline over existing dispatch can execute callbacks twice. [S04]

### 3.4 Pin the whole integration, not only npm dependencies

Record React, assistant-ui packages, provider adapter packages, and any AI SDK version in an integration manifest. Also record the upstream source date of copied shadcn components. Copied element code will not necessarily update when a dependency changes.

Before upgrading, run a small compatibility suite covering a tool result, an approval, cancellation, a restored thread, and an unknown tool. The examples here use `defineToolkit` / `Tools` / `AuiConfig`; do not mix a current tutorial with older registration patterns without checking your installed types. [S07]

---

## 4. Model the states that users actually experience

### 4.1 Separate six state domains

The following is a **proposed application model**, not a list of assistant-ui exported types.

| Domain | Example states | What it answers |
|---|---|---|
| Connection/synchronization | connecting, online, reconnecting, offline, resyncing, auth-required | Can this browser see authoritative updates? |
| Command submission | draft, sending, acknowledged, rejected, outcome-unknown | Was this particular user instruction accepted? |
| Run lifecycle | queued, running, waiting-input, waiting-approval, cancelling, completed, failed, cancelled | What is the overall requested workflow doing? |
| Message/part generation | pending, streaming, complete, incomplete | Is this piece of conversation still being produced? |
| Tool attempt | preparing, queued, waiting-approval, running, succeeded, failed, denied, cancelled, expired | What happened to this exact operation? |
| Presentation health | normal, unsupported, render-failed, stale-preview | Can the UI display the underlying facts correctly? |

These states can coexist. The network can be offline while a server-owned run remains active. A tool can succeed while final prose is still streaming. A run can end with useful partial results. A result renderer can crash after a write committed successfully.

Do not reduce all of this to `isLoading`, `isStreaming`, and `hasError`.

### 4.2 Identity is part of correctness

Keep the following identities separate:

```ts
// APPLICATION contract sketch, not a vendor event type.
type EventEnvelope<T> = {
  schemaVersion: 1;
  eventId: string;
  conversationId: string;
  sequence: number;             // ordered within this conversation stream
  occurredAt: string;
  runId?: string;
  messageId?: string;
  payload: T;
};

type ToolIdentity = {
  runId: string;
  toolCallId: string;
  attemptId: string;
};
```

`toolName` chooses a renderer. It does not identify an invocation. Three simultaneous `search_documents` calls require three separate states. A retry should have an explicit attempt identity or a new call identity linked to its predecessor.

Use stable part identity internally as well. Do not assume every vendor message-part type accepts an arbitrary `id` field; preserve your own keys in the projection and translate to the installed runtime's supported shape.

### 4.3 Distinguish output existence from success

A valid result may be `false`, `0`, `null`, an empty array, or an empty string. A tool error may also have a structured result. A preliminary output may exist before execution finishes.

Therefore:

```ts
// Incorrect:
const done = !isRunning;
const success = Boolean(result);

// Better application-level checks:
const hasOutput = tool.outputReceived;
const succeeded = tool.phase === "succeeded";
const showPartial = hasOutput && tool.outputIsPreliminary;
```

assistant-ui exposes coarse status, error, and preliminary-result signals in its tool rendering surface. Use those as inputs to a presentation selector, rather than letting each component invent its own completion logic. [S07]

The included `examples/tool-presentation.ts` implements a conservative selector and is covered by 36 executed tests. It deliberately does not attempt to repair inconsistent network events or act as a conversation reducer.

### 4.4 Define visible copy from known facts

| Known fact | Good copy | Misleading copy |
|---|---|---|
| Request sent, not acknowledged | “Sending…” | “Working on it” |
| Accepted, execution not started | “Queued” | “Running the search” |
| Tool arguments are arriving | “Preparing search” | “Searched 12 documents” |
| Executor acknowledged start | “Searching documents…” | An invented percentage |
| Approval unresolved | “Approve changes to 3 tasks” | A perpetual spinner |
| Approval recorded, execution pending | “Approved · waiting to start” | “3 tasks updated” |
| Final result recorded | “3 tasks updated” with references | A success claim based only on generated prose |
| Connection lost, outcome unknown | “Connection lost · checking status” | “Task failed” |
| Cancellation requested | “Stopping…” | “Stopped” |
| Successful action, broken renderer | “Completed · result view unavailable” | “Operation failed · retry” |

Counts, progress, names, and targets should come from structured facts. Use generated text for explanation, not as the sole source of whether an action occurred.

---

## 5. Connect a real streamed tool to an Element

This section addresses the central integration problem: **what makes the visual ToolCall animate, stop, or become a result card?**

### 5.1 The complete path

```text
A model requests search_documents
  -> transport adapter identifies the call
  -> projection creates a tool part with stable identity
  -> args deltas update that same part
  -> executor start/progress/result update its facts
  -> assistant-ui matches toolName to a renderer
  -> renderer derives a presentation state
  -> ToolCall receives explicit props
```

The animation is a consequence of state. It should never be a timer that pretends work is progressing independently of the stream.

### 5.2 Register a server-owned tool as render-only

A backend toolkit entry renders an existing server-side tool; it is not the place to add another executor. The current registration surface distinguishes backend renderers from frontend execution and human-result tools. [S05]

```tsx
// toolkit.tsx — current documented registration style
import { defineToolkit } from "@assistant-ui/react";
import { SearchDocumentsUI } from "./SearchDocumentsUI";
import { ReviewTaskChangesUI } from "./ReviewTaskChangesUI";

export const toolkit = defineToolkit({
  search_documents: {
    type: "backend",
    render: SearchDocumentsUI,
  },
  review_task_changes: {
    type: "backend",
    display: "standalone",
    render: ReviewTaskChangesUI,
  },
});
```

Use a compact inline activity for incidental retrieval. Use a standalone surface for decisions, rich results, or work the user needs to interact with. Avoid hiding an unanswered approval inside an auto-collapsed tool group.

### 5.3 The ToolCall component is a presentation, not a scheduler

The current ToolCall element accepts explicit labels, query/request/result strings, a `running` flag, and controlled expansion state. Its simple active/completed appearance is not a complete failed/cancelled/expired state model. Gate unsupported states outside it or extend the copied component. [S08]

This **integration template** shows the seam between runtime data, application facts, and the element. `useToolFacts` is an application-owned selector; it is not an assistant-ui hook. Read facts for the exact invocation and active thread context. The source file in `examples/` supplies `selectToolPresentation`.

```tsx
import { useState } from "react";
import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { ToolCall } from "@/components/assistant-ui/elements/tool-call";
import { selectToolPresentation } from "../projection/tool-presentation";

type SearchArgs = { query?: string };
type SearchResult = {
  hits: Array<{ id: string; title: string }>;
};

export const SearchDocumentsUI: ToolCallMessagePartComponent<
  SearchArgs,
  SearchResult
> = (part) => {
  const [open, setOpen] = useState(false);
  const facts = useToolFacts(part.toolCallId); // your store, scoped to this run

  const presentation = selectToolPresentation({
    phase: facts?.phase,
    status: part.status,
    result: part.result,
    resultReceived: facts?.outputReceived ?? part.result !== undefined,
    isPreliminary: part.isPreliminary,
    isError: part.isError,
    approval: part.approval,
  });

  // Validate network payloads in the adapter. This remains a defensive guard.
  const hits = Array.isArray(part.result?.hits) ? part.result.hits : undefined;
  const query = typeof part.args?.query === "string" ? part.args.query : "";
  const queryLabel = query.slice(0, 240);

  const simpleState =
    presentation.phase === "preparing" ||
    presentation.phase === "running" ||
    presentation.phase === "succeeded";

  return (
    <section aria-label="Document search">
      {/* Announce phase changes, not each token of the query or result. */}
      <p role="status" aria-atomic="true" className="sr-only">
        {presentation.label}
      </p>

      {!simpleState ? (
        <p>{presentation.label}</p>
      ) : presentation.phase === "succeeded" && !hits ? (
        <p>Search completed. The result view is unavailable.</p>
      ) : (
        <ToolCall
          label={hits ? `Found ${hits.length} documents` : "Search completed"}
          activeLabel={
            presentation.phase === "preparing"
              ? "Preparing document search"
              : "Searching documents"
          }
          query={queryLabel}
          request={queryLabel}
          result={hits ? hits.map((hit) => hit.title).join("\n") : ""}
          running={presentation.phase !== "succeeded"}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </section>
  );
};
```

This template is intentionally conservative. Without an authoritative execution-start event, it says “Preparing” instead of claiming execution. In a real product, failed/cancelled/denied states should use your reusable `ToolOutcome` component with appropriate details and permitted recovery actions. Do not turn the fallback paragraph into a generic “Retry” that replays a mutation.

For large results, do not pass the full result into a string display. Show a bounded summary and a typed result card or artifact instead. Apply access control and redaction before exposing tool details; truncation alone is not redaction.

### 5.4 Keep partial arguments safe

During input streaming, the argument object may be incomplete even if a generic TypeScript annotation looks complete. Render optional values defensively. A partially streamed `{"taskId":"ASN-` is not an executable command and is not valid JSON to parse on every keystroke.

Use the runtime's structured partial-argument support where available. `useToolArgsStatus` provides field-level progress information for richer components. [S06]

A safe card can show its fixed title immediately and reveal target information only when that field is complete. Do not enable Approve or Apply from partial arguments.

### 5.5 Prefer a renderer registry with explicit capabilities

Each tool renderer should declare a small application descriptor:

```ts
// Proposed application configuration.
type ToolPresentationPolicy = {
  placement: "activity" | "standalone" | "artifact";
  detailVisibility: "summary" | "redacted-details";
  mutatesApplication: boolean;
  resultSchemaVersion: number;
  supportsProgress: boolean;
  supportsCancellation: boolean;
  retryPolicy: "never-from-ui" | "read-only" | "server-decides";
};
```

The UI should still obtain actual per-run permissions from the server. A static descriptor helps choose components; it does not authorize execution.

---

## 6. Translate protocol events without inventing progress

### 6.1 An event-to-interface mapping

The vendor event names below are examples from their documented protocols. The middle column is a proposed application normalization, not an official SDK event vocabulary. [S22, S23, S24, S26]

| Upstream signal | Normalize into | Visible effect | What it does NOT prove |
|---|---|---|---|
| Function/tool-call item appears; tool-input starts | `tool.preparing` with identity | Add one activity row | The tool has executed |
| Function-call argument delta; tool-input delta | `tool.arguments.delta` | Update safe argument preview | Complete or validated arguments |
| Function arguments done; tool-input available; AG-UI tool-call end | `tool.arguments.ready` | Freeze final request preview | A successful tool result |
| Your executor acknowledges start | `tool.started` | Switch to real running state | Completion |
| Approval requested | `approval.requested` | Show decision card, stop busy animation for this gate | User authorization |
| Approval accepted | `approval.resolved` | Replace controls with recorded decision | Execution or committed changes |
| Preliminary output/custom progress | `tool.output.partial` / `tool.progress` | Update bounded preview/log/progress | Final output |
| Tool result/output event | `tool.output.final` plus normalized outcome | Show result or failure for that invocation | Entire assistant workflow finished |
| Next model text delta | `message.text.delta` | Continue the same visible turn/step sequence | All other parallel work is complete |
| Model step/response finishes | `model.step.finished` | Finalize that model step | The durable application run is complete |
| Your orchestrator records terminal run state | `run.finished` | Stop run-level progress; enable correct next actions | Rollback of any earlier committed action |

For OpenAI function calling, provider item identity and the function call's correlation identity are distinct. Keep the mapping so a tool output is attached to the requested call rather than whichever tool row happens to be last. [S26]

### 6.2 Example trace: search, approve, update, explain

The following is an invented but realistic application trace:

```text
1   command.accepted       userMessage=u1, run=r1
2   run.started            r1
3   tool.preparing         search call=c1
4   tool.arguments.delta   c1, query fragment
5   tool.arguments.ready   c1, final query
6   tool.started           c1
7   tool.output.final      c1, 3 document references, succeeded
8   tool.preparing         update_tasks call=c2
9   tool.arguments.ready   c2, exact 3 changes
10  approval.requested     approval=a1, revision=4, call=c2
    USER sees proposed changes and chooses Approve
11  approval.resolved      a1, approved, actor=current user
12  tool.started           c2
13  action.receipt         3 updates committed; entity revisions attached
14  tool.output.final      c2, receipt references, succeeded
15  message.text.delta     explanation and links
16  run.finished           r1, completed
```

Visible behavior: one user message, one coherent assistant turn, a compact completed search, a prominent approval, a committed-results card, and final explanation. There is no need to fabricate user messages such as “clicked Approve” merely to drive the UI. The decision can be recorded as its own event and surfaced in the conversation history.

### 6.3 Progress has several levels

Use an indeterminate activity indicator when only the current phase is known. Use a phase checklist when actual phase transitions are known. Use a measured progress bar only when a meaningful completed/total measure is supplied. A local elapsed-time counter is not progress and must be labelled as time.

Keep apparent progress truthful when work expands. “6 of 10 files” can change to “6 of 14 files” with an explanation if discovery increases the denominator. Do not force an invented monotonic percentage merely because it looks smoother.

Prefer progress descriptions such as “Checking references” to exposing raw internal tool names. Keep precise technical detail in an expandable, redacted view for users who need it.

---

## 7. Scenario implementation playbooks

Each playbook identifies when to use a surface, how it connects to state, and the minimum acceptance behavior. These are recommended product contracts; a library does not supply them automatically.

### 7.1 Plain text with a slow first response

**Use when:** the assistant can answer directly, or the workflow has not yet produced user-visible work.

**Surface:** a stable assistant-turn container, a small pending status, streamed text, and the usual final message actions.

Render the conversation shell and existing history immediately. After sending, distinguish local submission from acknowledged work. Do not leave an empty assistant bubble for a long interval. A factual phase label is better than a synthetic “thinking” story.

Create the text part once and append to that stable part. Preserve incomplete Markdown gracefully while it streams. Finalize only the relevant part on text completion; tool activity or another text part can follow. Use the run's terminal event for run-level completion.

**Mandatory:** preserve the draft on rejection; preserve partial output on interruption; explain a terminal error inline near the affected turn. Never clear earlier successful turns because the newest request failed.

**Acceptance:** first response delayed; no text ever produced; first delta arrives before a separate acknowledgement; final event arrives after text end; text succeeds but a later tool fails.

### 7.2 A single read-only tool

**Use when:** a search, lookup, or retrieval explains a visible delay or provides useful provenance.

**Surface:** ToolCall/ToolActivity for the operation; optional compact source/result cards afterward.

Use argument-generation state for “Preparing,” executor-start for “Searching,” and the final normalized result for completion. Keep a safe final query visible in the expanded detail. Display “No matches” as a successful empty result, not as an execution error.

For a result the user will revisit, place a stable result card outside transient progress detail. An incidental lookup can remain inside the activity history.

**Mandatory:** one component instance per call identity; zero execution from renderer effects; no failure inferred merely from an empty result.

**Acceptance:** partial JSON, Unicode fragments, empty results, unknown tool name, final result containing `false` or `null`, result before optional progress events.

### 7.3 Sequential and multi-round tool use

**Use when:** the next operation depends on earlier output, such as finding a document, reading it, then proposing edits.

**Surface:** compact step timeline or adjacent tool group, with major decisions/results promoted into standalone cards.

Keep the dependency sequence visible without forcing every internal substep into a full-width card. A later step may begin while the assistant is also producing explanatory text. Preserve the original message-part order; do not collect all tools at the top and all prose at the bottom if that changes what the user saw happen.

assistant-ui's grouped-parts mechanism and ToolGroup support grouping adjacent tool activity. This is presentation grouping, not a complete workflow scheduler or dependency graph. [S09, S43]

**Mandatory:** completion of model round one must not stop the overall run if tools or subsequent rounds remain. Avoid recreating completed tool rows when the next model response arrives.

**Acceptance:** model → tool → model → tool → final text; a failed middle step with later recovery; a step emits no prose; restored history renders the same order.

### 7.4 Parallel tools and mixed outcomes

**Use when:** several searches, file inspections, or independent tasks run concurrently.

**Surface:** one summary line with independent child rows. For example, “4 checks · 2 complete · 1 running · 1 needs approval.” This is more informative than one group-wide spinner.

Order children by a stable creation/order key, not by completion time. Apply updates by invocation ID. A completed child must not become running because another child starts. Multiple calls with the same name still have distinct state and labels.

Allow users to expand the whole group or one failing child. Avoid auto-collapsing a card under the user's pointer or while it contains keyboard focus. Keep pending decisions prominent, even if ordinary completed activity collapses.

**Mandatory:** define partial-success semantics. A failed optional search does not automatically invalidate successful results; a failed required prerequisite may block dependent work. The server's run outcome should tell the UI which happened.

**Acceptance:** results arrive C, A, B; one child fails; one asks approval; repeated names; a retry creates a new attempt; one child finishes after Stop was requested.

### 7.5 Tool failures, unknown tools, and malformed output

**Use when:** a tool times out, returns a business error, is unsupported by the current client, or produces data the renderer cannot display.

**Surface:** a compact tool outcome card with a plain-language explanation and only safe actions. Keep technical details expandable and redacted.

Differentiate execution failure from display failure. If task creation committed but its result component throws, say the action completed and its details could not be displayed. Offer a canonical entity link, refetch, or a bounded generic view. Do not offer a mutation retry merely because a React component failed.

An unknown tool should not crash the entire thread. Show a neutral label, known lifecycle state, and safe structured metadata. Unknown does not mean failed. For missing renderer support, the correct recovery may be refreshing/upgrading the client rather than rerunning the agent.

**Mandatory:** a per-part or per-tool error boundary; runtime schema validation; bounded output rendering; no raw secrets in fallback JSON; no generic automatic retry for mutations.

**Acceptance:** `isError` with structured output; successful output with missing expected field; malformed URL; unknown part type; renderer throws; retry fails; a sibling tool continues normally.

### 7.6 Approval and authorization gates

**Use when:** the user must authorize a potentially consequential operation.

**Surface:** ApprovalCard/PermissionGrant or an application-owned decision card with a clear action, target, scope, and consequences. The catalog's approval presentation has a small visual state set; extend it for submitting, expired, stale, and unavailable states. [S12]

A useful state sequence is:

```text
request -> submitting -> decision recorded -> queued/running -> committed result
       \-> submission rejected -> request
       \-> denied
       \-> expired / cancelled / superseded
```

An accepted decision is not a successful mutation. Use separate copy for “Approved” and “Updated.” For a write operation, bind the decision to the exact action, target, version, and request identity. If the proposal changes, require a new decision rather than silently reusing consent.

The current tool-renderer API provides an approval object and a response method. An unresolved gate must exist before the UI offers a response. Expiry/cancellation and already-recorded decisions must also close it. [S05]

```ts
// In a renderer using the documented approval shape:
const canAnswer =
  approval !== undefined &&
  approval.approved === undefined &&
  approval.resolution === undefined;
```

Do not use only `approval?.approved === undefined`: that expression is also true when no approval object exists.

On click, immediately prevent duplicate submission locally and show “Submitting decision…”. Await the response when the API supplies a promise. Permanently resolve the UI only after accepted acknowledgement/authoritative state. Re-enable on a retryable failure; reconcile on an unknown outcome. A local disabled button is an in-flight affordance, not proof the approval was consumed.

Show “Always allow” only when the host exposes a real scoped policy option and can persist and revoke it. Explain the scope before confirmation. Do not invent permission persistence in localStorage. [S05]

**Mandatory:** keyboard-accessible allow/deny; precise target and permission scope; acknowledgement/error states; duplicate prevention; refresh persistence; multi-tab conflict handling; stale/expired request handling. Dangerous confirmation must not be preselected or triggered by unrelated Enter/Escape shortcuts.

**Acceptance:** approve, deny, double click, timeout after decision accepted, second tab already answered, permission revoked, proposal revision changed, run cancelled while card open.

### 7.7 Clarification, human input, and elicitation

**Use when:** work cannot continue until the user selects an entity, answers a question, supplies structured information, or resolves ambiguity.

**Surface:** an inline form or choice card, not necessarily an authorization dialog. “Which project?” and “May I delete this project?” have different semantics and should look different.

The integration mechanism depends on the workflow. A human-result tool uses `addResult`; a suspended tool can use `resume(payload)`; a server-owned approval uses its approval response path. Use exactly one dispatch path per interaction. Do not both call a custom endpoint and send the same result through the runtime independently. [S05, S07]

For native MCP elicitation, assistant-ui documents `McpElicitationPrimitive` in its MCP package. Its ElicitationForm is not simply another tool renderer in that integration. When Core mediates MCP, it can instead expose a normalized form request and let the browser remain provider-independent. [S13]

Keep form state keyed to request identity and schema version. Preserve valid input on transient submission failure. Distinguish a user choosing Cancel from a transport timeout. Validate required fields and show errors next to those fields.

**Mandatory:** labels, validation, submit-pending state, exact request correlation, acknowledgement before completion, stale-form handling. Never route passwords or connector credentials into an ordinary chat form; use the appropriate authentication flow.

**Acceptance:** required field missing, user cancels, refreshed page restores pending request, another user resolves it, schema changes, submit succeeds but response is lost.

### 7.8 Automatic code execution and streamed logs

**Use when:** a model-triggered tool executes code or a command in a managed execution environment.

**Surface:** an execution card containing code/command, current phase, bounded stdout/stderr, final exit status, duration if measured, and artifact references.

Do not confuse a code block in a message with executed code. Code syntax highlighting does not prove execution, and displayed output must come from an execution result or log stream.

The current TerminalBlock example has an important limitation: its completion header always displays `exit 0`, and its public state does not represent a nonzero exit or execution failure. Extend or replace this component before using it as the authority for execution outcomes. Its `visibleCount` can reveal captured lines, which is not by itself live stdout transport. [S10]

A better application-owned presentation contract is:

```ts
type ExecutionView = {
  phase: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  commandLabel: string;
  stdout: readonly { offset: number; text: string }[];
  stderr: readonly { offset: number; text: string }[];
  exitCode: number | null;
  signal: string | null;
  truncated: boolean;
  downloadableLogId?: string;
  artifactIds: readonly string[];
};
```

Merge chunks by stream identity and offset or sequence. Keep stdout and stderr distinguishable. Cap the DOM log view while preserving a download/open-full-log path. Show truncation explicitly. A final error must remain visible even when some output was useful.

**Mandatory:** genuine execution state; real exit/signal semantics; bounded logs; partial-output preservation; cancellation behavior; safe artifact links. Never execute generated code through browser `eval` as a shortcut for a server sandbox.

**Acceptance:** exit 0, exit 1 with stdout, signal termination, timeout, no output, huge output, split Unicode, duplicate log chunk, artifacts before final exit, lost final event.

### 7.9 User-triggered code running

**Use when:** the assistant presents runnable code and the user explicitly chooses Run.

**Surface:** CodeRunner with idle, running, success, and error presentation, plus a clear explanation of the execution environment.

The documented CodeRunner flow is user-triggered and can complete a human tool through `addResult`; its execution function is supplied by the application. That is different from automatically displaying a model-triggered execution tool. [S11]

Capture the exact code revision when Run is clicked. If the user edits afterward, the visible result must still identify the revision it belongs to. A rerun is a new attempt, not a silent overwrite of a previous result.

**Mandatory:** explicit execution capability and target, disabled duplicate Run while pending, cancellation only when supported, truthful result, version association. Do not allow arbitrary generated code to inherit privileged application credentials.

**Acceptance:** edited code while running, double Run, result from an older attempt, offline click, rejected execution request, successful code with no return value.

### 7.10 Reviewing a diff and applying changes

**Use when:** users should inspect generated changes before they affect tasks, documents, files, or settings.

**Surface:** ReviewableDiff or a domain-specific before/after card. Use a plain summary for small property changes; a line diff is not always the clearest representation of a due-date update.

ReviewableDiff exposes selection and apply callbacks, but its review decisions do not themselves persist changes. Treat “keep this hunk” as a local choice and “apply accepted changes” as a distinct command. Guard the empty-selection/no-op case. [S14]

Bind the patch to a base revision. If the underlying document changes, mark the proposal stale and offer recomputation or explicit conflict resolution. Do not silently apply a patch to a different document version.

**Mandatory:** kept/discarded/pending distinctions; apply-pending state; conflict handling; committed receipt and new version after success; no success claim based on selecting hunks alone.

**Acceptance:** discard all, apply none, mixed selection, document changed remotely, apply timeout after commit, partial application if supported, regeneration while an old diff remains open.

### 7.11 Rich result cards, artifacts, and canvas

**Use when:** output should be interacted with, compared, downloaded, edited, or kept visible alongside the conversation.

**Surface:** a stable ArtifactCard in the thread, with a side panel or canvas for substantial content. Prefer structured React components for known entities; use a sandboxed frame only when arbitrary generated document/web content is genuinely needed.

Store artifact identity, revision, kind, title, and availability separately from the transient text stream. “Drafting,” “ready,” “saving,” “saved,” “failed to save,” and “download expired” should not all map to one green card.

Keep the user's selected artifact stable while new output arrives. A background update should not steal panel focus or replace the artifact they are editing. On mobile, use a full-screen sheet/detail route with a clear return to conversation.

The assistant-ui artifacts example is a useful layout reference; ChatKit's action mechanism is useful for understanding how widget interactions can drive application updates without pretending each button press is a user text message. [S28, S31]

**Mandatory:** revision-aware updates; loading/error/unavailable states; secure URLs; consistent app and chat references; render isolation. Clicking a stale card action must be revalidated, not blindly replayed.

**Acceptance:** artifact arrives incrementally, download link expires, access revoked, preview crashes, user edits while regeneration finishes, same artifact referenced by two turns.

### 7.12 Application-changing widget actions

**Use when:** a card offers “Open task,” “Assign to me,” “Apply,” “Save,” or “Schedule.”

**Surface:** domain-specific card actions with distinct navigation and mutation behavior.

Navigation can open immediately. A mutation needs an explicit command ID, target, expected revision, permission check, pending state, and receipt. After the receipt, update the application entity store and the conversation projection from the same authoritative facts.

Do not mark the task changed simply because the assistant says it changed. Similarly, do not add duplicate optimistic cards when the entity update later arrives through the app's normal realtime channel. Deduplicate by command/receipt/entity revision.

**Mandatory:** disabled/hidden unsupported actions; context and permissions; acknowledgement; conflict handling; safe repeated clicks. Maintain a visible explanation if an action is no longer available.

**Acceptance:** same action from two tabs, task deleted, access revoked, command succeeds after UI timeout, chat card and normal task view converge.

### 7.13 Background work, subagents, and delegated runs

**Use when:** a report, repository analysis, export, or delegated task should continue independently of the current foreground turn.

**Surface:** a durable RunSummary/BackgroundRuns card with a meaningful name, phase, owner, last known update, and supported controls. A parent summary can contain expandable child-agent activities.

Represent background work separately from the foreground assistant response. “Started report generation” can be a completed foreground answer while the report job remains active. Keep the composer available according to an explicit product policy.

Subagent activity should expose task-level summaries and useful outputs, not raw hidden reasoning. Track parent and child IDs so cancellation scope is clear. A “Stop this analysis” button must not ambiguously cancel unrelated work in the thread. assistant-ui's multi-agent material provides a useful presentation reference, but your durable job model remains application-owned. [S44]

**Mandatory:** restore after navigation/refresh; no cancellation merely from closing a tab; explicit stop scope; clear distinction between background status and message generation; no fabricated percentage or ETA.

**Acceptance:** two background jobs and one foreground reply; parent completes while child still active according to contract; child fails; user switches thread; work completes while browser is closed.

### 7.14 Sources, citations, reasoning summaries, and provenance

**Use when:** users need to verify an answer or understand what information was used.

**Surface:** inline citations connected to source previews, plus optional compact activity or approved reasoning-summary sections.

Store references as typed data with stable identity. Resolve citations against those records rather than treating a model-generated URL string as a guaranteed source. Distinguish a retrieved source from evidence actually used to support a statement when the application can make that distinction.

A late-arriving source record can temporarily show a neutral placeholder. A broken or revoked source should have an unavailable state instead of silently linking somewhere else. For private sources, preserve access control on open and avoid exposing sensitive titles in notifications or public shares.

**Mandatory:** source identity and safe navigation; no fabricated evidence; no hidden chain-of-thought exposure. Only display provider-approved summaries or application activity facts as reasoning-related UI.

**Acceptance:** citation arrives before source metadata, duplicate sources, unsafe URL, deleted private document, unsupported source type, output cites a source the user cannot access.

### 7.15 Attachments and multimodal output

**Use when:** the user attaches files or the assistant returns images, audio, video, or other generated media.

**Surface:** attachment chips/cards with upload/processing/ready/error states; output cards with generation, availability, and retry semantics appropriate to the medium.

assistant-ui provides an attachment adapter contract; it does not remove the need for upload lifecycle and error handling. [S18]

A selected file is not yet a successfully attached server asset. Separate local preview, upload, server validation, processing, and readiness. Define whether Send waits for attachments or rejects with a useful explanation. Keep failed items visible with replace/remove/retry actions.

For generated media, do not mark an asset ready merely because a placeholder was created. Preserve an artifact ID independently from an expiring download URL. Revoke local object URLs and cancel unneeded preview work when an attachment is removed.

**Mandatory:** size/type validation on both boundaries; failure and cancellation; access-controlled downloads; ready-state truthfulness; accessible alternatives. Audio playback must have its own state rather than being tied to text generation.

**Acceptance:** upload interrupted; attachment removed mid-upload; message submitted twice; unsupported type; processing fails; preview URL expires; generated image cancelled after partial work.

### 7.16 Refusals, limits, and deliberate termination

**Use when:** the assistant declines a request, a tool/step limit is reached, credentials expire, or work ends without a normal full answer.

**Surface:** a clear final or incomplete response, with the specific reason and only meaningful next actions.

A refusal is not necessarily a network error or a retryable exception. A length limit is not the same as cancellation. A tool limit should not be hidden behind “Something went wrong” if the user could narrow the task. An authentication problem should lead to a reauthentication path without discarding the draft or previous output.

Use a StoppedRun-style presentation for user-initiated stopping; use distinct copy for timeout, quota, unavailable permissions, or output limits. [S17]

**Mandatory:** no endless spinner after terminal outcomes; preserve useful partial output; distinguish retryable from nonretryable conditions. A Continue button must reflect a real continuation or new-run capability, not an imaginary resumption point.

**Acceptance:** refusal before output, refusal after a tool result, step limit, length cutoff, tool timeout, auth expiry, server shutdown, graceful cancellation, unrecoverable stream protocol error.

---

## 8. Connection failure, recovery, cancellation, and retry

### 8.1 Reconnect, retry, regenerate, and continue are different commands

| User action | Intended effect | Typical UI label | Forbidden implicit side effect |
|---|---|---|---|
| Reconnect | Restore subscription to the same work | Reconnect | Starting a second run |
| Refresh state | Fetch canonical snapshot/receipts | Check status | Resubmitting the last message |
| Retry sending | Resolve/retry a specific unacknowledged command using its identity | Retry send | Creating a duplicate user message |
| Retry a tool | Start an authorized new attempt of one failed operation | Retry search / Try operation again | Replaying previously committed mutations |
| Regenerate | Produce a new assistant branch/run from a specified parent | Regenerate response | Pretending previous real-world changes were undone |
| Continue | Resume a supported checkpoint or start an explicit follow-on run | Continue response | Claiming the original execution never stopped |
| Stop | Request cancellation of a particular run/scope | Stop response / Stop job | Cancelling unrelated background work |
| Undo | Run an explicit compensating action when supported | Undo task update | Treating branch navigation as a rollback |

These labels are part of the contract. Avoid a generic Retry button that chooses whichever operation happens to be easiest to implement.

### 8.2 Stream recovery state machine

```text
connecting -> online -> connection lost -> reconnecting -> resyncing -> online
                              |                 |
                              +-> offline       +-> auth-required
                                                +-> failed-to-resume
```

Preserve the visible transcript while disconnected. Show an unobtrusive connection banner and a last-synchronized indicator when useful. Do not replace the whole conversation with a global error screen.

The ConnectionState element needs adapter-supplied network information; there is no universal thread connection fact from which every transport can infer durable recovery. Its resume action also depends on the chosen runtime. [S15]

Only say “Work continued in the background” when the backend guarantees or confirms that. Otherwise say “Connection lost. Checking whether the run is still active.”

### 8.3 Replay algorithm for a server-owned conversation

The following is a proposed contract, not a built-in assistant-ui guarantee:

1. A snapshot describes state through cursor N. Replace the canonical base with that snapshot and retain separate unresolved local commands.
2. Subscribe/replay strictly after N, using the transport's defined semantics.
3. Validate schema and conversation identity before applying an event.
4. Ignore exact duplicates already applied. Do not append a repeated text/log delta twice.
5. Apply events in sequence. On a gap, pause projection of dependent deltas and request missing events or a fresh snapshot.
6. Commit projected changes and the new cursor together. Do not advance the cursor after a failed reducer.
7. Reconcile local optimistic messages and commands through their client command IDs.
8. If replay history expired, obtain a newer snapshot rather than trying to reconstruct missing text from model output.

Do not assume a SDK's resume endpoint emits only missing deltas. Some adapters own their own full-message/replay reconciliation. Decide whether your custom projection or the SDK is responsible; layering two independent append/replay strategies creates duplicates. The official AI SDK stream/resume documentation is useful for understanding this boundary. [S23, S25]

Protect thread changes with a subscription generation or equivalent identity guard. A delayed event from the previous thread must not update the newly selected thread's visible state. The old thread's durable store may still update if intentionally subscribed; it must not be mistaken for the current view.

### 8.4 Handle unknown outcomes conservatively

Suppose the user clicks “Create task,” Core commits it, and the response connection breaks. The frontend knows only that the response was lost, not that creation failed.

Show “Checking whether the task was created…” and reconcile by command ID or receipt. Only offer a new mutation attempt after the outcome is known or the server explicitly makes idempotent retry safe. The same rule applies to approval submissions and message sends.

For read-only tools, automatic retry can be less risky, but still bound attempts and explain prolonged delays. Avoid retry storms across several tabs. Treat authorization errors differently from temporary service failures.

### 8.5 Stop is a workflow command, not a transport side effect

For server-owned runs, keep “stop receiving updates” and “cancel execution” separate. The current AI SDK resumable-stream guidance makes this distinction explicitly: client abort/disconnect alone does not cancel the underlying resumable generation; a separate cancellation path is required in that setup. [S25]

Recommended visible sequence:

```text
running -> user requests Stop -> cancelling -> confirmed cancelled
                                    |              |
                                    |              +-> preserve partial results
                                    +-> already completed
                                    +-> request failed / status unknown
```

Disable repeated Stop submissions while one is outstanding, but keep the status visible. If the browser is offline, do not claim stopping succeeded. On reconnect, show the confirmed outcome.

Cancellation is not rollback. Keep committed action receipts even if later steps were cancelled. Distinguish obsolete late text deltas from authoritative reconciliation events that report an already-committed action. A blanket “ignore every event after cancelled” rule can erase important facts.

A Stop request must target the run it was created for. If a new run starts before the cancellation endpoint processes the command, the old Stop must not cancel the new run.

### 8.6 Stalls and liveness

A heartbeat confirms transport liveness, not useful model progress. A quiet tool may be doing work, stalled, waiting for a missing permission, or already complete with a lost terminal event.

Use a “Taking longer than usual” status based on measured service behavior, then offer Check status or Stop if supported. Avoid inventing a deadline that causes the UI to report failure while work continues. If the application declares a true timeout, persist that terminal outcome and define whether the worker can still produce committed receipts afterward.

Mobile suspension, tab backgrounding, and authentication expiry belong in recovery testing. A browser returning after a long pause should reconcile state before animating stale “running” indicators indefinitely.

### 8.7 Minimum backend-facing facts the frontend needs

This manual does not require a particular queue or agent framework. It does require an answer to these contract questions:

| Contract | Frontend reason |
|---|---|
| Stable thread/run/message/tool/approval IDs | Correlation and recovery |
| Canonical snapshot plus documented stream ordering/replay | Correct refresh/reconnect |
| Explicit terminal outcomes | No indefinite or false success states |
| Command acknowledgement and idempotency semantics | No duplicate writes on uncertain outcomes |
| Approval identity, scope, resolution, and version | Honest and safe decision UI |
| Cancellation target and acknowledgement | Truthful Stop behavior |
| Structured mutation receipts | Consistent chat and application state |
| Capabilities and permissions | Only offer supported actions |
| Artifact identity/version/access | Stable results beyond an expiring URL |

Without these facts, the UI can look advanced but cannot reliably infer what happened. The correct frontend response is to expose uncertainty, not manufacture missing semantics.

---

## 9. Composer, scrolling, navigation, and branching

### 9.1 The composer is a stateful interaction surface

Define a policy for each state:

| Situation | Recommended behavior |
|---|---|
| Idle | Draft, attach, and send normally. |
| Sending, not acknowledged | Show pending submission; prevent duplicate sending; preserve recoverable draft. |
| Foreground run active | Allow drafting. Either disable Send with explanation or offer an explicit queue/steer action. |
| Waiting for approval/input | Keep the decision visible; allow drafting without implying it answers the gate. |
| Background job active | Usually allow a new foreground message. |
| Offline | Preserve draft and clearly distinguish saved locally from sent. Avoid silently queueing consequential commands. |
| Authentication expired | Preserve draft, explain reconnect/sign-in, and disable unauthorized submission. |
| Attachment processing | Show which attachment blocks sending or allow removal. |

A Stop icon replacing Send must have a clear accessible name and scope. Do not hide the only Stop control because the user has begun drafting their next message.

Treat queueing, steering, and immediate parallel conversation as different product features. The ExternalStore runtime supports queue-related integration, but a durable multi-device queue still needs an explicit owner and reconciliation policy. [S03]

For an initial production release, the simplest safe default is: allow drafting during a foreground run; permit a clearly labelled queued message only after its behavior is implemented; let independent background jobs continue without locking the composer.

### 9.2 Scrolling should follow the user, not the demo

There are at least two scroll modes: following live output and reading history. When the user scrolls away from the bottom, preserve their position and display a “New activity”/jump-to-latest control. Do not pull them back because another tool emits a line.

Use the runtime viewport and scroll primitives as the starting point. The standalone ScrollAnchor catalog demo includes timer-driven behavior for demonstration; it should not be copied as the application's scroll policy. [S16]

Implementation requirements:

- Preserve position when older history is prepended.
- Preserve an anchor when a tool group collapses above the viewport.
- Do not scroll merely because another thread receives output.
- Preserve per-thread position where appropriate.
- Avoid moving focus when an assistant message completes.
- Account for composer resizing, mobile keyboard, safe areas, and artifact panels.

“Always force bottom on every token” is not an acceptable implementation.

### 9.3 Navigation, reload, and history hydration

Opening a thread should render its cached shell/history promptly, then reconcile current state. Identify stale cached output during synchronization if actions depend on freshness. Restore unresolved approvals and running jobs from durable facts, not component-local booleans.

Keep canonical content separate from ephemeral UI preferences such as expanded tool rows and currently selected artifact tabs. Restoring a conversation should not require restoring every animation frame.

Delete/unsubscribe local listeners on navigation. Bound retained event buffers. Revisit a long thread repeatedly in testing and verify that subscriptions and memory do not accumulate.

### 9.4 Edit, regenerate, and branches

Editing an earlier message should create an explicit revised history/branch according to the application's model. Do not silently rewrite a historical user instruction while keeping incompatible later outputs as though they belong to it.

Regeneration creates a new response attempt. It does not undo task assignments, emails, files, or other actions already committed by the old branch. Keep action receipts historically accurate and revalidate any proposed mutation in the new run.

Define what happens to queued messages, open approvals, and artifact editing when a branch changes. The safe initial policy is to block ambiguous changes or explicitly discard/rebase incompatible pending local work with user-visible confirmation.

**Mandatory:** stable branch identity; restored selection; no duplicate side effects from branch switching; clear distinction between historical output and current application state.

### 9.5 Ordinary interaction details that matter

Support IME composition before interpreting Enter as Send. Preserve expected Shift+Enter behavior. Provide touch-sized controls, visible focus, reliable paste handling, and copy states that do not change message content.

Keep long code blocks horizontally scrollable without forcing the entire page to scroll sideways. Let users select/copy streaming text without remounting its container. Avoid automatically opening every rich result panel, particularly on narrow screens.

---

## 10. Rendering, security, accessibility, and performance

### 10.1 Typed parts before rich formatting

Represent text, tools, sources, artifacts, notices, approvals, and application entities as distinct parts or structured state. Do not encode every state into Markdown conventions and then parse it back out.

For provider-independent widgets, use validated typed payloads and an allowlisted component registry. A model should choose from supported components and data shapes, not gain authority to create arbitrary privileged React behavior.

Use a safe generic renderer for unsupported versions. Maintain an adapter boundary so changing provider event names does not require rewriting every visual component.

### 10.2 Security belongs in the UI implementation

Treat generated Markdown, URLs, tool output, filenames, and HTML as untrusted content. Disable arbitrary raw HTML unless a reviewed sanitization policy requires it. Validate link schemes and attachment destinations. Redact credentials and private content before display, telemetry, copying, or sharing.

For generated HTML previews, use a dedicated sandboxing strategy rather than injecting the content into the application's DOM. assistant-ui's Safe Content Frame is a relevant starting point, but your allowed capabilities, origins, messaging validation, and content policy still need review. [S38]

A sandbox should not automatically inherit application authentication, unrestricted top-level navigation, or the right to issue privileged app commands. Validate any `postMessage` channel by expected source/origin and payload schema. Artifact actions should return through your normal permission-checked command boundary.

Do not hide consequential operations in seemingly harmless “view” interactions. Opening a card, expanding details, downloading a preview, or selecting a branch should not execute a tool.

### 10.3 Accessibility: communicate transitions, not every token

Use a small status region for meaningful changes such as request acknowledged, approval required, disconnected, or finished. Avoid announcing every token, every log line, and every changing query fragment. WCAG status-message guidance and the ARIA status technique are useful references for announcing updates without moving focus. [S39, S40]

Keep the status region present before updates where possible. Coordinate announcements across parallel tools so four rapidly changing spinners do not flood a screen reader. Errors needing immediate attention can use an appropriate alert, but ordinary progress should not be assertive.

Mandatory checks include keyboard-only operation of tool groups and approvals, labelled form fields, focus return after panels close, visible focus, contrast, non-color status cues, reduced-motion support, and zoom/narrow-screen usability. A spinner needs meaningful text; color alone must not distinguish failed from successful.

Manual assistive-technology testing is still necessary. Semantic snapshots are helpful regression tests, not an accessibility certification. [S42]

### 10.4 Performance: do not make advanced UI expensive by default

The following are proposed engineering practices, not measured assistant-ui guarantees:

**Keep the initial shell light.** Eager-load the thread skeleton, composer, basic text, and compact activity. Lazy-load rich editors, charts, syntax grammars, large artifact viewers, and diff engines behind stable placeholders. A tool renderer should not force an entire IDE dependency into the first route load.

**Batch display updates, not semantic decisions.** Coalesce token/log display updates to animation frames or another measured small interval. Preserve every semantic event, and flush promptly for terminal states, decisions, and errors. Do not allow a throttled text queue to overwrite a newer complete snapshot.

**Use narrow subscriptions.** Update the current text part or tool instance instead of remapping the full transcript on each token. External-store snapshots should be immutable and cached correctly; React documents this requirement for `useSyncExternalStore`. [S37]
**Contain heavy work.** Avoid reparsing every completed Markdown block whenever the active block changes. Defer expensive syntax highlighting while code is incomplete when the renderer supports it. Bound log DOM size, expensive JSON trees, and large tables. Keep copy/download access to full data separately.

**Virtualize carefully.** Long transcripts and logs may benefit, but test variable heights, reading position, text selection, search, focus, and screen-reader behavior. Do not introduce virtualization into a short chat just to satisfy a checklist.

**Measure the real workflow.** Profile typing while several tools stream, switching threads, opening a large artifact, and restoring a long history. A fast backend does not prevent renderer-induced lag.

Suggested starting budgets for your test devices, to be validated rather than treated as universal standards: visible send feedback within 100 ms, no sustained typing jank during a busy stream, and no chat-controlled main-thread task above 50 ms in a representative trace. Record hardware, browser, fixture size, and percentile before setting a release threshold.

### 10.5 Observability without leaking conversations

Track command-to-acknowledgement, acknowledgement-to-first-useful-content, event-receipt-to-paint, approval-submit-to-resolution, reconnect-to-resynchronized, and cancellation-request-to-confirmation. Separate provider latency from UI processing latency.

Count missing/gapped events, duplicate suppression, unknown part types, renderer failures, stale approval submissions, and unknown command outcomes. Correlate with opaque IDs rather than raw prompts, tool arguments, or results by default.

A support-friendly error includes a stable trace/run reference and a plain-language recovery path. It should not require copying sensitive chat content into an error report.

---

## 11. Implementation sequence and definition of done

### Phase A — Contract and projection foundation

**Build:** versioned event decoder, stable IDs, normalized run/tool/message state, explicit command state, snapshot reconciliation, and the single runtime bridge.

**Deliver:** text-only stream plus one read-only tool, driven from deterministic fixtures rather than a real model.

**Exit gate:** duplicate events, reordered arrivals, missing events, and reload cannot duplicate messages or show false success. Unknown output is contained. Rendering has no side effects.

### Phase B — Complete the ordinary conversation path

**Build:** sending/acknowledgement/rejection, streaming/incomplete text, composer state policy, stopped-run UI, connection banner, navigation, scroll behavior, and a generic tool fallback.

**Deliver:** a usable conversation with truthful pending/error/cancellation states before adding rich tool visuals.

**Exit gate:** send failure preserves the draft; reconnect restores the same work; Stop cannot target a newer run; reading history is not interrupted by streaming.

### Phase C — Tool activity and result semantics

**Build:** per-tool presentation selector, known renderer registry, partial args, executor start/progress, final outcomes, grouping, parallel calls, standalone result cards, and per-part error boundaries.

**Deliver:** sequential and parallel workflows with accurate outcomes and bounded detail.

**Exit gate:** same-name parallel tools never share state; empty results are valid; preliminary output is not final; successful actions remain successful when rendering fails.

### Phase D — Human interaction and mutations

**Build:** approvals, denial/expiry/stale decisions, elicitation forms, submission acknowledgements, versioned review/apply, widget actions, and action receipts synchronized with normal app state.

**Deliver:** a workflow that proposes and applies real application changes safely.

**Exit gate:** double-click, two tabs, timeout-after-commit, and changed target revision cannot produce duplicate or unauthorized actions. No “Always allow” without a real policy implementation.

### Phase E — Execution and advanced workspace surfaces

**Build:** truthful terminal/code UI, bounded logs, artifact lifecycle, side panel/canvas, background runs, and subagent summaries as required by the product.

**Deliver:** advanced workflows without turning the entire chat into an overloaded developer console.

**Exit gate:** nonzero exit never looks successful; stopped work preserves useful output; artifacts and jobs restore after navigation; mobile layout remains usable.

### Phase F — Production hardening

**Build:** fixture-based browser tests, real delayed-stream tests, accessibility checks, performance traces, security tests, observability, and upgrade compatibility tests.

**Deliver:** the release report described in the companion testing guide, including known limitations and unsupported capabilities.

**Exit gate:** every advertised scenario has evidence across its success, failure, interruption, and restoration paths. Cosmetic fidelity alone is not a release criterion.

### Recommended first vertical slice for Assign

Implement one realistic flow end to end:

```text
Ask for a task summary
 -> two parallel read tools
 -> compact combined result
 -> proposed task update
 -> approval
 -> committed task receipt
 -> final explanation
```

Then run that same fixture with disconnect during search, refresh during approval, cancellation after one tool succeeds, a renderer failure after the update commits, and a second-tab decision. This exposes the missing lifecycle contracts much faster than implementing a large catalog of disconnected cards.

### Release checklist

A release should not claim advanced workflow support until it can demonstrate: truthful tool states; stable identity and replay; safe acknowledgement/retry semantics; persistent decisions; cancellation without false rollback; robust unknown/malformed content handling; accessible composer and decisions; stable scrolling; bounded rich rendering; and no duplicate side effects from refresh, branch switching, or multiple tabs.

---

## 12. Primary-source reading map

These sources were consulted for API and implementation facts. The architectural contract, scenario requirements, test matrix, and sample selector are original recommendations, not guarantees made by these projects. Follow the current source and your installed types when documentation differs from copied snippets.

### assistant-ui foundations and runtime integration

- **[S01] Elements catalog:** https://www.assistant-ui.com/elements — entry point for visual surfaces.
- **[S02] Runtime selection:** https://www.assistant-ui.com/docs/runtimes/pick-a-runtime — choose the integration model.
- **[S03] ExternalStoreRuntime guide:** https://www.assistant-ui.com/docs/runtimes/custom/external-store — externally owned message state.
- **[S04] External Store API reference:** https://www.assistant-ui.com/docs/api-reference/external-store/runtime — exact callbacks and capabilities.
- **[S05] Tool UI guide:** https://www.assistant-ui.com/docs/tools/tool-ui — tool registration and interaction mechanisms.
- **[S06] Tool status API:** https://www.assistant-ui.com/docs/api-reference/tools/status — argument/status helpers.
- **[S07] Tool rendering API:** https://www.assistant-ui.com/docs/api-reference/tools/rendering — typed rendering surface.
- **[S18] Attachments:** https://www.assistant-ui.com/docs/guides/attachments — attachment adapter integration.
- **[S19] AssistantTransport:** https://www.assistant-ui.com/docs/runtimes/custom/assistant-transport — custom transport/state integration.
- **[S20] AI SDK runtime:** https://www.assistant-ui.com/docs/runtimes/ai-sdk/overview — version-specific SDK integration.
- **[S21] Resumable streams:** https://www.assistant-ui.com/docs/guides/resumable-streams — persistence and resumption integration.
- **[S43] Message primitives:** https://www.assistant-ui.com/docs/api-reference/primitives/message — typed and grouped parts.
- **[S44] Multi-agent tools:** https://www.assistant-ui.com/docs/tools/multi-agent — delegated/nested tool UI patterns.

### Elements worth inspecting as source code

- **[S08] ToolCall:** https://www.assistant-ui.com/elements/tool-call — props-driven tool activity.
- **[S09] ToolGroup:** https://www.assistant-ui.com/elements/tool-group — adjacent activity grouping.
- **[S10] TerminalBlock:** https://www.assistant-ui.com/elements/terminal-block — execution display and documented status limitation.
- **[S11] CodeRunner:** https://www.assistant-ui.com/elements/code-runner — user-triggered execution surface.
- **[S12] ApprovalCard:** https://www.assistant-ui.com/elements/approval-card — decision presentation.
- **[S13] ElicitationForm:** https://www.assistant-ui.com/elements/elicitation-form — structured user input and MCP integration.
- **[S14] ReviewableDiff:** https://www.assistant-ui.com/elements/reviewable-diff — review decisions versus applying changes.
- **[S15] ConnectionState:** https://www.assistant-ui.com/elements/connection-state — transport-aware status presentation.
- **[S16] ScrollAnchor:** https://www.assistant-ui.com/elements/scroll-anchor — viewport integration versus demonstration behavior.
- **[S17] StoppedRun:** https://www.assistant-ui.com/elements/stopped-run — deliberate interruption presentation.

### Protocols and lifecycle semantics

- **[S22] AG-UI events:** https://docs.ag-ui.com/concepts/events — explicit run/text/tool/state event taxonomy.
- **[S23] AI SDK UI stream protocol, official source:** https://raw.githubusercontent.com/vercel/ai/main/content/docs/04-ai-sdk-ui/50-stream-protocol.mdx — input/output and step/message event boundaries.
- **[S24] AI SDK tool usage, official source:** https://raw.githubusercontent.com/vercel/ai/main/content/docs/04-ai-sdk-ui/03-chatbot-tool-usage.mdx — tool and approval states.
- **[S25] AI SDK resumption, official source:** https://raw.githubusercontent.com/vercel/ai/main/content/docs/04-ai-sdk-ui/03-chatbot-resume-streams.mdx — disconnect, replay, and explicit cancellation.
- **[S26] OpenAI function calling:** https://developers.openai.com/api/docs/guides/function-calling — streamed call arguments, correlation, and tool outputs.

### Advanced reference applications

- **[S27] assistant-ui ChatGPT example:** https://www.assistant-ui.com/examples/chatgpt — familiar conversation layout.
- **[S28] assistant-ui Artifacts example:** https://www.assistant-ui.com/examples/artifacts — conversation plus workspace.
- **[S29] LangGraph Agent Chat UI:** https://docs.langchain.com/oss/javascript/langgraph/ui — agent activity and human interruption.
- **[S30] ChatKit.js:** https://openai.github.io/chatkit-js/ — ChatKit integration model.
- **[S31] Custom ChatKit:** https://developers.openai.com/api/docs/guides/custom-chatkit — custom widgets and actions.
- **[S32] OpenAI advanced ChatKit samples:** https://github.com/openai/openai-chatkit-advanced-samples — application-integrated conversation examples.
- **[S33] Vercel AI Elements Tool:** https://elements.ai-sdk.dev/components/tool — tool input/output presentation.
- **[S34] Vercel AI Elements Confirmation:** https://elements.ai-sdk.dev/components/confirmation — decision UI.
- **[S35] Vercel AI Elements IDE:** https://elements.ai-sdk.dev/examples/ide — advanced workspace composition.
- **[S36] Vercel Chatbot documentation:** https://chatbot.ai-sdk.dev/docs — integrated chat application reference.

### Production rendering and test references

- **[S37] React external-store subscription:** https://react.dev/reference/react/useSyncExternalStore — stable store snapshots.
- **[S38] Safe Content Frame:** https://www.assistant-ui.com/safe-content-frame — isolated generated-content previews.
- **[S39] WCAG status messages:** https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html — accessible updates.
- **[S40] ARIA status technique:** https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22 — status-region behavior.
- **[S41] Playwright network testing:** https://playwright.dev/docs/network — controlled network tests.
- **[S42] Playwright ARIA snapshots:** https://playwright.dev/docs/aria-snapshots — semantic UI regression tests.

### Maintenance procedure

When updating this guide for a new package version, revisit the exact runtime callback reference, ToolCall and terminal source, approval behavior, and resumption documentation first. Re-run the local presentation tests, compile the React bridge against the project's real lockfile, and run the five compatibility flows from section 3.4. Record changed assumptions rather than silently replacing source snippets.