# Vercel AI Elements

Official documentation: [AI Elements](https://elements.ai-sdk.dev/) and [Conversation component](https://elements.ai-sdk.dev/components/conversation). Canonical repository: [vercel/ai-elements](https://github.com/vercel/ai-elements).

AI Elements is a collection of application components built on shadcn/ui. It supplies presentation for conversations, messages, tools, sources, confirmations, and other AI interactions. Components are installed into the application's codebase, making visual and behavioral customization a normal source change.

AI SDK UI supplies chat state and transport; AI Elements displays that state. Installing a component does not create an agent backend or persistence layer. It is also separate from assistant-ui's similarly named Elements.

## Basic setup

Start in a React application with shadcn/ui configured, then install only the needed component:

```bash
npx ai-elements@latest add conversation
```

The installed file exposes composable pieces. This presentation example makes no model call:

```tsx
"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

export function ReleaseResult({ summary }: { summary: string }) {
  return (
    <Conversation className="h-96">
      <ConversationContent>
        <p>{summary}</p>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
```

The import assumes the `@/` alias points to the application's source root. Bind actual message parts from the chosen chat store and install Message or Tool components when the corresponding content is needed. Keep empty, streaming, error, and completed states explicit.

The [Tool component](https://elements.ai-sdk.dev/components/tool) accepts AI SDK tool-part states; the [Confirmation component](https://elements.ai-sdk.dev/components/confirmation) provides approval presentation. Validate the backend-to-UI mapping, especially after upgrading an SDK. A rendered approval control must submit an authoritative operation identity, and a successful visual state must follow the server's result.

Review installed source changes during component upgrades. Local customization can diverge from registry updates, so check interaction behavior and accessibility alongside styling.
