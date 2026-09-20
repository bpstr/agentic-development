# Vercel AI SDK

Official documentation: [AI SDK documentation map](https://ai-sdk.dev/llms.txt), [Building agents](https://ai-sdk.dev/docs/agents/building-agents). Source: [vercel/ai](https://github.com/vercel/ai), [agent guide source](https://github.com/vercel/ai/blob/main/content/docs/03-agents/02-building-agents.mdx).

AI SDK is a TypeScript application SDK covering model access, structured output, tools, agent loops, and streamed UI integration. Its core can run in an application-owned service. The UI packages and Vercel AI Gateway are separate capabilities.

Install `ai`, `@ai-sdk/openai`, and `zod`, plus `tsx` for this script. Set `OPENAI_API_KEY` and a tool-capable `MODEL_ID`. This example uses the provider directly:

```typescript
import { ToolLoopAgent, isStepCount, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const reader = new ToolLoopAgent({
  model: openai(process.env.MODEL_ID!),
  instructions: 'Read document states with the supplied tool.',
  stopWhen: isStepCount(4),
  tools: {
    documentStatus: tool({
      description: 'Read the state of a sample document.',
      inputSchema: z.object({ documentId: z.string() }),
      execute: async ({ documentId }) => ({
        status: documentId === 'doc-17' ? 'approved' : 'unknown',
      }),
    }),
  },
});
const result = await reader.generate({ prompt: 'What is the status of doc-17?' });
console.log(result.text);
```

Save as `example.mts` and run `npx tsx example.mts`. The agent runs model/tool steps until it completes or reaches the stop condition. `generateText` and `streamText` provide lower-level application primitives when a reusable agent object is unnecessary.

Pin dependencies and use the matching documentation: loop-control and context APIs evolve. Validate business authorization inside tools, pass secrets through trusted server context, and persist domain results outside the stream. A streaming UI hook does not supply durable job recovery, and an execution callback runs in your application unless it explicitly delegates to a sandbox.
