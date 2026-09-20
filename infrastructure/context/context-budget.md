# Context budgets

A context budget allocates limited request capacity among instructions, user input, history, retrieved evidence, tool schemas, tool results, and generated output. It turns context into a resource the application can measure and control.

Begin with the selected model's documented limits. Reserve capacity for mandatory instructions and expected output, then assign the remainder to task state and evidence. Under a hypothetical shared 32,000-token limit, reserving 4,000 for output, 6,000 for fixed input, and 2,000 for overhead leaves 20,000 for history and retrieved material. Providers can impose separate output limits or different accounting for reasoning and media.

Count the assembled request with the model's tokenizer or provider counting endpoint. Character counts are unreliable across languages, code, and structured data. [Anthropic's token-counting documentation](https://platform.claude.com/docs/en/build-with-claude/token-counting) also notes that preflight counts are estimates, so leave headroom.

When a request exceeds its budget, remove redundant evidence, narrow tool results, retrieve smaller passages, or compact older history. Preserve the current goal, corrections, and unresolved actions before keeping incidental conversation detail.

Recalculate after tool execution: one large search result can consume the space reserved for later reasoning. Monitor quality as well as token savings; a cheap request that omits the decisive source can cause costly retries or an incorrect answer.
