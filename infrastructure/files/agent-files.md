# Files in agent systems

Files are both context sources and artifacts. Agents may read source files, attachments, datasets, images, PDFs, spreadsheets, archives, and generated outputs.

A file reference should preserve identity, type, size, provenance, access control, and version where relevant. Passing a filename alone is insufficient when multiple tenants or revisions can contain the same name.

Ingestion resolves a file identifier, checks access, reads its bytes, detects the format, and creates a suitable representation. Text extraction, image rendering, and spreadsheet parsing produce different views of the same source. Attach the source revision to each derived view so an answer can identify what was read.

For example, `budget.xlsx` may refer to an uploaded original, an edited workbook, or a rendered preview. A reference containing an opaque file ID and revision distinguishes them; a display name helps the user recognize them. A download URL is an access mechanism and may expire without changing the underlying file's identity.

Reading, modifying, and publishing a file are separate capabilities. Enforce each at the storage boundary rather than trusting a path supplied by a model. Limit file size and archive expansion during processing, retain the original when transformations lose information, and verify output bytes before announcing a generated file. A filename in a chat message does not establish that an artifact exists or is accessible.
