# ElevenLabs ElevenAgents

Official documentation: [ElevenAgents overview](https://elevenlabs.io/docs/eleven-agents/overview) and [React SDK](https://elevenlabs.io/docs/eleven-agents/libraries/react). Canonical TypeScript SDK repository: [elevenlabs/packages](https://github.com/elevenlabs/packages).

ElevenAgents is ElevenLabs' platform for conversational agents with voice interaction. Its client SDKs connect an application to a configured agent and expose conversation controls, status, transcripts, and tools. This is a broader integration than calling a text-to-speech endpoint to read a finished answer.

## Basic React integration

Create and configure an agent in the platform, then install:

```bash
npm install @elevenlabs/react
```

The current SDK uses a provider with conversation hooks. This minimal control is for an explicitly public agent:

```tsx
"use client";

import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
} from "@elevenlabs/react";

function Controls({ agentId }: { agentId: string }) {
  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();
  return (
    <div>
      <p>{status}</p>
      <button disabled={status !== "disconnected"}
        onClick={() => void startSession({ agentId })}>Start voice</button>
      <button disabled={status !== "connected"}
        onClick={() => void endSession()}>End voice</button>
    </div>
  );
}

export function VoiceControl({ agentId }: { agentId: string }) {
  return (
    <ConversationProvider>
      <Controls agentId={agentId} />
    </ConversationProvider>
  );
}
```

A real application also needs visible connection errors and microphone permission handling. For an authenticated agent, obtain a conversation token for WebRTC or a signed URL for WebSocket on a trusted server, then pass it to `startSession`. Do not expose the ElevenLabs API key to client code.

Keep client tools limited to appropriate local interactions; private domain operations should go through authorized server handlers. A conversation identifier supports correlation but does not itself authorize access to an application record.

When ending a session, stop playback and capture and persist the useful outcome. Verify interruption behavior, connection failures, and whether spoken confirmations match completed tool results. SDK state and a durable workflow's state are separate concerns, even when the same interface displays both.
