# Optical character recognition

Optical character recognition (OCR) converts text represented as pixels into machine-readable characters. It is useful for scans, photographs, and image-only PDF pages. Recognition may also estimate word locations, but it does not automatically reconstruct document meaning or table structure.

Prefer native text extraction when a document already contains a reliable text layer. Rasterizing clear digital text and recognizing it again introduces unnecessary opportunities for errors. For scanned content, image resolution, skew, contrast, language, and page segmentation affect recognition quality. [Tesseract's quality guide](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html) describes these preprocessing and segmentation concerns.

For example, an invoice number `INV-1008` can be misread as `INV-IOO8`. Preserve the image region and original OCR output, then validate the candidate against the expected identifier format or source system. A language model's correction should remain distinguishable from directly recognized text.

Keep confidence and coordinates where the engine supplies them, while recognizing that confidence is not a universal probability of correctness. Verify critical amounts, dates, and identifiers against the rendered source.

Process pages independently when content types differ. A mixed PDF may contain both native text and scanned attachments. Applying one extraction method to the entire file can silently omit the attachments or duplicate an existing OCR layer.
