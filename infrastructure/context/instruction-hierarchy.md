# Instruction hierarchy

An instruction hierarchy defines which instructions take precedence when sources conflict. Agent applications combine provider rules, application instructions, user requests, project guidance, and reusable skills. These scopes do not automatically correspond to distinct API roles; the runtime must map them to the provider's supported message structure and its own documented precedence rules.

Keep instructions distinguishable from evidence. Text inside a retrieved document, web page, or tool result may describe a task without having authority to change it. [Research on instruction hierarchy](https://openai.com/index/the-instruction-hierarchy/) studies training models to respect priority differences and disregard conflicting instructions from less privileged sources.

For example, a support agent may be instructed to answer using approved policy documents. A retrieved page containing a request to reveal credentials should be handled as document content, not as a new application instruction. The same distinction matters when quoted examples contain imperative language.

Preserve role and source information during summarization, delegation, and protocol translation. Combining everything into one string can erase the boundary between a user's request and untrusted material. Resolve conflicting trusted configuration deterministically where possible.

Authorization must also be enforced outside the model. An instruction to avoid another customer's records cannot replace a database access check. Hierarchy improves behavior but does not make model compliance a security boundary.
