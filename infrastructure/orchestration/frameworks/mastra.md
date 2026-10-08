# Mastra

Official documentation: [Agents](https://mastra.ai/docs/agents/overview), [Tools](https://mastra.ai/docs/agents/using-tools). Source: [mastra-ai/mastra](https://github.com/mastra-ai/mastra).

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

The [Mastra Connect 1.0 release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.75.0) (October 7, 2026) changes the security default for discovered MCP tools: `@mastra/connect@1.0.0` no longer requires approval automatically. To preserve human review, configure `requireApproval` explicitly, either for all tools or a narrow set of mutating tools; the old `autoApproveTools` option is removed. Re-evaluate integration policy during upgrades rather than relying on the former default. The same release adds completed-span queries and cross-store token/cost aggregates to observability; apply telemetry retention and access controls before enabling them.

Retrieve registered agents through the Mastra instance to use shared services. Configure durable storage explicitly for memory and workflow persistence. Keep authorization in the tool or business service and propagate cancellation through execution context. Agent-generated plans do not replace deterministic workflow gates when a business process requires them.
