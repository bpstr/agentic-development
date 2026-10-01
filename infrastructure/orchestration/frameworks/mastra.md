# Mastra

Official documentation: [Agents](https://mastra.ai/docs/agents/overview), [Tools](https://mastra.ai/docs/agents/using-tools). Source and releases: [mastra-ai/mastra](https://github.com/mastra-ai/mastra), [releases](https://github.com/mastra-ai/mastra/releases).

Mastra is a TypeScript framework for agents, tools, workflows, memory, and application integration. It fits products that want these capabilities in the same TypeScript service and need explicit registration and shared runtime services.

Install `@mastra/core` and `zod`, plus `tsx` to run TypeScript examples. Set `MASTRA_MODEL` to a supported `provider/model` identifier and supply that provider's key, such as `OPENAI_API_KEY` for OpenAI.

```typescript
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const statusTool = createTool({
  id: 'document-status',
  description: 'Read the publication state of a sample document.',
  inputSchema: z.object({ documentId: z.string() }),
  outputSchema: z.object({ status: z.string() }),
  execute: async ({ documentId }) => ({
    status: documentId === 'doc-17' ? 'approved' : 'unknown',
  }),
});
const reader = new Agent({
  id: 'document-reader', name: 'Document reader',
  instructions: 'Use statusTool before answering document questions.',
  model: process.env.MASTRA_MODEL!,
  tools: { statusTool },
});
const mastra = new Mastra({ agents: { reader } });
const result = await mastra.getAgentById('document-reader')
  .generate('Report the state of doc-17.');
console.log(result.text);
```

Save as `example.mts` and run `npx tsx example.mts`. Current tools receive validated input as the first `execute` argument; an optional second argument carries execution context. Older examples with another signature may not match the installed version.

Retrieve registered agents through the Mastra instance to use shared services. Configure durable storage explicitly for memory and workflow persistence. Keep authorization in the tool or business service and propagate cancellation through execution context. Agent-generated plans do not replace deterministic workflow gates when a business process requires them.

## Durability and multi-worker execution

Current Mastra releases have strengthened durable and background execution. In the 1.72 line, background tasks use persisted ownership leases so multiple managers can share one storage backend without intentionally running the same claimed task at the same time; stale workers are prevented from overwriting results after losing ownership. The lease duration is configurable, and stale-task recovery is lease-fenced.

Treat this as execution coordination, not exactly-once business delivery. A worker can still perform an external side effect and fail before its result is recorded. Make consequential operations idempotent, store external operation identifiers, and test crash recovery around the side-effect boundary.

Tool-approval APIs are also version-sensitive: current 1.72 behavior requires a `toolCallId` when responding to a tool approval. Pin compatible core/server/storage packages and check release notes before copying older approval or durable-workflow examples.
