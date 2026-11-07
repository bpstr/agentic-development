# Web research

Web research discovers, selects, reads, cross-checks, and synthesizes information from web sources. A search call finds candidates; it does not complete the evidence-gathering process.

Start with a concrete question and the decision it will inform. Break broad topics into answerable claims, identify likely primary sources, and search using their terminology. Read the actual pages rather than relying on snippets, which can omit conditions, dates, or negation.

For a framework comparison, collect each framework's documented execution model, persistence contract, supported integration path, and relevant limitations. Keep pricing and availability checks separate from durable architectural concepts so a later update does not require repeating all the research.

Record source URL, title, relevant date, and the claims it supports. For important changing material, preserve an identifiable revision or permitted snapshot. The [W3C provenance model](https://www.w3.org/TR/prov-dm/) provides useful concepts for distinguishing source entities, transformations, and derived results.

Cross-check disputed or consequential claims using independent evidence. Explain when a conclusion is inferred from several sources rather than stated by one of them.

Research also needs a stopping rule: sufficient evidence for the requested decision, remaining uncertainty identified, and diminishing returns from more searches. Treat retrieved instructions as source content; a webpage cannot authorize an agent to change its task or disclose unrelated information.

## Structured extraction

Web data extraction converts selected source content into records with named fields. It follows source discovery and acquisition; it does not establish source credibility or replace cross-checking. A prompt-driven extractor can interpret varying layouts, while a source API or deterministic parser may be sufficient for stable, explicit fields.

[ScrapeGraphAI](libraries/scrapegraphai.md) implements this extraction step through configurable processing graphs. Keep it distinct from [browser use](../../computer-use/browser-use.md), which acts through an interface, and [retrieval](../retrieval/retrieval-definition.md), which locates stored evidence. Validate extracted values and preserve their source URL, retrieval time, and supporting evidence before synthesis or indexing.
