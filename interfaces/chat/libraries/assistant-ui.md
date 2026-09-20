# assistant-ui

Official documentation: [Primitives](https://www.assistant-ui.com/docs/primitives), [runtime architecture](https://www.assistant-ui.com/docs/architecture), and [AI SDK integration](https://www.assistant-ui.com/docs/runtimes/ai-sdk/overview). Canonical repository: [assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui).

assistant-ui is a component and runtime system for conversational interfaces. Its React primitives handle interaction behavior such as composing messages, streaming updates, and scrolling while leaving visual design to the application. Its own Elements are styled, installable components built from those primitives.

The runtime owns or adapts conversation state and connects presentation to a backend. Using the UI does not require moving domain execution into it. Choose a documented adapter for an existing backend or implement the runtime contract for a custom store.

## Basic integration

The documented AI SDK v7 combination uses `ai@^7`, `@ai-sdk/react@^4`, and `@assistant-ui/ai-sdk`. Follow the [version-specific setup](https://www.assistant-ui.com/docs/runtimes/ai-sdk/v7) when using earlier AI SDK releases.

```bash
npm install @assistant-ui/react @assistant-ui/ai-sdk ai@^7 @ai-sdk/react@^4
```

This minimal composer uses the default chat transport; it expects the compatible `/api/chat` route described in the integration guide:

```tsx
"use client";

import { AssistantRuntimeProvider, ComposerPrimitive } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/ai-sdk";

export function ReleaseComposer() {
  const runtime = useChatRuntime();
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ComposerPrimitive.Root>
        <ComposerPrimitive.Input aria-label="Ask about the release" />
        <ComposerPrimitive.Send>Send</ComposerPrimitive.Send>
      </ComposerPrimitive.Root>
    </AssistantRuntimeProvider>
  );
}
```

Add a Thread element or thread/message primitives to display the resulting conversation. Keep primitives inside the appropriate runtime and message contexts. The backend must validate requests, execute authorized tools, and return the adapter's expected stream format.

Persist final messages and operation records independently of component mounts. Reconnection, thread history, and cloud storage are explicit integrations, not consequences of choosing a visual component. Avoid mixing examples from different adapter generations: package names and message contracts have changed.

assistant-ui Elements and Vercel AI Elements are separate libraries, despite the shared word “Elements.”
