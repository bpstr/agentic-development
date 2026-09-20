# Markdown endpoints

A Markdown endpoint exposes a document or page in a stable Markdown representation for machine consumption. It can mirror a human-readable page while preserving headings, links, code blocks, and textual hierarchy with little presentation noise.

The convention is application-defined unless a protocol specifies otherwise. Keep canonical identity and permissions consistent between HTML and Markdown representations.

A site can publish a separate path, such as `/docs/tasks.md`, or negotiate the representation at an existing URL using the request's `Accept` header. If `Accept` selects the representation, the response should include `Vary: Accept` so caches distinguish the variants. This follows [HTTP content negotiation and Vary semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.5).

An illustrative negotiated response is:

```http
HTTP/1.1 200 OK
Content-Type: text/markdown; charset=utf-8
Vary: Accept

# Task API

`status` accepts `open`, `in_progress`, or `done`.
```

Generate both representations from the same source. Preserve headings, code language labels, complete links, and warnings that affect correct usage. A conversion that drops a table's column labels may save tokens while changing the meaning of its values.

Private content needs the same authentication and cache restrictions in every representation. A `.md` suffix must not bypass those checks. Markdown also cannot fully represent an interactive application or a visual diagram; include descriptions or links to those resources instead of silently omitting essential information.
