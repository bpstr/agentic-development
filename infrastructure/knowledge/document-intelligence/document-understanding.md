# Document understanding

Document understanding extracts usable semantic structure from files such as PDFs, office documents, scans, forms, and images. It combines native text extraction, layout analysis, table reconstruction, vision models, and optical character recognition according to the source.

Separate recovering content from interpreting it. A parser may identify the words “Payment due” and a nearby date; deciding that the date is the invoice deadline is a further extraction step. Preserve the original text and location alongside the interpreted field.

For an invoice, retain page number, bounding box, field label, currency, and source revision. That lets a reviewer inspect whether a total came from the invoice body, a previous balance, or an unrelated footer. A single flattened text string can lose those distinctions.

The [pypdf extraction guide](https://pypdf.readthedocs.io/en/stable/user/extract-text.html) explains why positioned PDF text does not reliably encode reading order or semantic structure. Prefer native extraction when a usable text layer exists; apply OCR to image content or unusable embedded text.

Evaluate the extracted structure against rendered pages. Include rotated scans, repeated headers, multiple columns, and continuation tables. A plausible summary can conceal missing pages or reordered content, so downstream generation should receive extraction warnings and source coordinates rather than an unexplained clean-looking transcript.
