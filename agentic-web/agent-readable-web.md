# Agent-readable web

The agent-readable web is the set of web representations and interfaces designed so software agents can reliably discover content and capabilities without reconstructing all semantics from visual pages.

It includes machine-readable content, structured data, agent-oriented Markdown, capability descriptions, browser-native tools, service APIs, and discovery metadata. It complements rather than replaces human-facing HTML.

There are three distinct needs. Discovery helps the agent locate relevant resources. Representation preserves their meaning in a form the client can consume. Interaction exposes operations with clear inputs and results. Improving only one does not solve the others: a readable product description may still lack a way to check current inventory or place an authorized order.

For a documentation site, a practical design is an ordinary HTML page, a linked Markdown representation, and a small index of the most useful references. Both page formats should describe the same version and link to the same canonical subject. For a task application, a structured action could additionally expose changing a task's status.

Measure success through actual tasks: can a client find an API parameter, preserve its constraints, and identify its source? Merely removing CSS does not establish this. Agent-facing content can still be stale or malicious, and discovery metadata does not grant access to protected resources.
