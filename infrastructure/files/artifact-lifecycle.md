# Artifact lifecycle

An artifact is a durable output produced or modified by an agent, such as a report, code patch, image, spreadsheet, presentation, or generated dataset.

Artifact lifecycle includes creation, versioning, preview, validation, approval, publication, retention, and deletion. Store the artifact independently from the conversational message that announced it.

An artifact usually begins as a candidate revision. Validation checks properties relevant to its format: a spreadsheet should preserve formulas and values, a document should render correctly, and a code patch should satisfy the applicable checks. A preview makes the proposed result reviewable. Publication then changes availability or replaces a shared version; it should not be confused with creation in a temporary workspace.

A generated report may have an immutable revision ID, a preview, its source dataset revision, and a published link. If generation is retried, a job identifier can prevent duplicate publication. An incomplete upload or failed render should leave the candidate distinguishable from the last published version.

Attach approval, when required, to the exact revision and intended destination. Editing the artifact afterward may invalidate that decision. Preserve provenance and a publication receipt so later users can establish which output was delivered. Retention and deletion need to cover copies, previews, and derived indexes as well as the original bytes; expiring one download link does not necessarily delete the artifact.
