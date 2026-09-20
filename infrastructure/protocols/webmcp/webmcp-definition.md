# WebMCP

Official specification: https://webmachinelearning.github.io/webmcp/
Chrome documentation: https://developer.chrome.com/docs/ai/agents

WebMCP is a browser-side API that lets web applications expose structured JavaScript tools to AI agents. A page can describe operations with natural-language descriptions and structured input schemas so an agent can invoke application functionality without inferring every action from pixels and DOM interaction.

WebMCP is complementary to server-side MCP. The WebMCP specification describes web pages as conceptually similar to MCP servers whose tools execute in client-side application code and share the user's live web context.

Two authoring styles are important:

- **Imperative tools** register JavaScript-backed operations.
- **Declarative tools** annotate ordinary HTML forms so existing interfaces can become agent-addressable.

As of September 2026, WebMCP is a Web Machine Learning Community Group draft rather than a W3C Recommendation. Chrome exposes it through an origin trial and local development flag. Treat browser support and API details as evolving.

Security matters because page content and agent instructions can interact. Tools should expose narrow operations, validate arguments, preserve user control, and distinguish read-like actions from sensitive side effects.
