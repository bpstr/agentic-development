# Agent-readable documents

Agent-readable documents expose content in forms that preserve useful structure for machine consumption. Markdown, structured JSON, semantic HTML, and well-tagged document formats are generally easier to process than visually encoded content alone.

Human and agent representations can coexist: a polished web page can expose a stable Markdown or structured-data representation of the same underlying document.

Preserve the relationships needed for interpretation. Headings establish scope; table headers explain values; units qualify numbers; captions connect figures to claims. Reading order matters in documents with multiple columns, sidebars, footnotes, or repeated headers. Extracting every visible word can still produce an incorrect document if those relationships are lost.

A revenue table should yield each value with its region, period, currency, and scale. Flattening the table into unrelated numbers makes comparisons unreliable. A chart may require both underlying data and an image so the agent can inspect labels and visual encodings.

Treat conversion as a derived representation with its own limits. Preserve links to original pages or sections, record the source revision, and flag missing or uncertain extraction. OCR can recover text from scans but may confuse characters or omit layout semantics. Choose parsing and rendering methods according to the question, then compare critical findings with the original instead of assuming that a successful conversion preserved all meaning.
