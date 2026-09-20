# llms.txt

[Official llms.txt proposal](https://llmstxt.org/).

llms.txt is a proposed Markdown convention for giving agents a concise overview and links to useful website content. Its purpose is discovery: a client reads the small index, then fetches relevant detailed pages instead of loading the entire site into context.

The v2 proposal permits a file at the root or within a path. For example, `/docs/llms.txt` describes the documentation beneath `/docs/`. It recommends linking to useful Markdown representations and advertising the index through a `describedby` link relation. An `alternate` link with `type="text/markdown"` can identify a page's Markdown representation.

For a library, the index might briefly explain its purpose and link to installation, the API reference, and migration guidance. Keep version-specific instructions attached to the version they describe; a compact index should help select a source, not silently merge incompatible releases.

Publishing this file does not guarantee that a particular agent reads it. It grants no authorization, establishes no trust in linked content, and does not replace access controls. Treat it as a maintained discovery document whose usefulness depends on accurate descriptions and working links.
