# Vercel AI SDK UI

Official documentation: [AI SDK UI](https://ai-sdk.dev/docs/ai-sdk-ui/overview) and [chatbot guide](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot). Canonical repository and source example: [vercel/ai](https://github.com/vercel/ai) and [chatbot documentation source](https://github.com/vercel/ai/blob/main/content/docs/04-ai-sdk-ui/02-chatbot.mdx).

AI SDK UI provides framework integrations for conversation state and streaming. In React, `useChat` manages message parts, response status, and request controls. A transport connects it to an application endpoint; a component library or the application's own JSX determines how that state looks.

## Basic setup

For the v7 API family:

```bash
npm install ai@^7 @ai-sdk/react@^4
```

A small React client can send requests and render text parts:

```tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export function ReleaseChat() {
  const [draft, setDraft] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  return (
    <section aria-label="Release conversation">
      {messages.map(message => (
        <p key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <span key={index}>{part.text}</span> : null,
          )}
        </p>
      ))}
      {error && <p role="alert">The response could not be completed.</p>}
      <form onSubmit={event => {
        event.preventDefault();
        if (!draft.trim() || busy) return;
        void sendMessage({ text: draft });
        setDraft("");
      }}>
        <input aria-label="Message" value={draft}
          onChange={event => setDraft(event.target.value)} />
        <button disabled={busy || !draft.trim()}>Send</button>
        {busy && <button type="button" onClick={() => void stop()}>Stop</button>}
      </form>
    </section>
  );
}
```

The `/api/chat` endpoint is required. It authenticates the request, converts validated UI messages to model messages, runs generation, and returns the UI message stream. The current v7 source uses `createUIMessageStreamResponse` with `toUIMessageStream({ stream: result.stream })`; older examples can use different response helpers. A non-JavaScript backend can implement the [documented stream protocol](https://github.com/vercel/ai/blob/main/content/docs/04-ai-sdk-ui/50-stream-protocol.mdx).

Extend rendering for tools, files, and sources before accepting those part types. Stopping the fetch stream does not establish that a durable worker or external action stopped. Store history and run state on the server and define operation cancellation separately.
