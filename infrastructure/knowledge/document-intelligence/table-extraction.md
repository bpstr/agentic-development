# Table extraction

Table extraction reconstructs rows, columns, headers, merged cells, and values from document structure or visual layout. Plain text extraction can preserve every character while destroying the relationships needed to interpret the data.

Distinguish cell detection from semantic interpretation. Detecting a number beneath a heading is different from deciding its unit, period, or whether parentheses mean a negative value. Preserve multi-level headers and footnotes that qualify the cells.

For a quarterly report, represent a value with its row label, column period, currency, source page, and cell coordinates. Keep blank, zero, and unavailable values distinct. When a table spans pages, verify repeated headers and row continuation before joining the results.

[pdfplumber](https://github.com/jsvine/pdfplumber#extracting-tables) provides table extraction settings and visual debugging for PDF geometry. Ruled tables can use lines and intersections; borderless tables require other alignment signals. Scanned tables also need OCR, adding a separate recognition problem.

Validate row and column alignment against the rendered source, then check domain constraints such as totals, expected categories, and consistent units. Arithmetic agreement alone is insufficient: two columns may be swapped while their combined total remains correct.

Retain the original table image or page location for review. Do not silently repair ambiguous cells or infer missing values merely to produce a rectangular output.
