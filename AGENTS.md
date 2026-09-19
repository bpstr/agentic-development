# Agent instructions

This repository is a taxonomy and reference for agentic development.

## Structure

Organize content by **concept or capability**, never by vendor. The filesystem is part of the knowledge model.

- Root directories represent major aspects such as `foundations/`, `infrastructure/`, `interfaces/`, `operations/`, and `development/`.
- Nested directories represent increasingly specific concepts.
- Use descriptive filenames such as `model-definition.md`, `tool-calling.md`, `plugin-development.md`, and `durable-execution.md`.
- Do not create generic `knowledge.md` or `introduction.md` files when a lexical filename can describe the subject.
- Concrete implementations belong beneath the concept they implement.
- Prefer semantic implementation directories such as `providers/`, `frameworks/`, `platforms/`, `tools/`, `libraries/`, or `runtimes/` instead of a generic `references/` directory.
- A product may appear under multiple concepts when it genuinely implements multiple capabilities. Each page must discuss only its relationship to the parent concept.

Examples:

```text
infrastructure/
  models/
    model-definition.md
    providers/
      openai.md
      anthropic.md
  orchestration/
    orchestration-definition.md
    frameworks/
      google-adk.md
      langgraph.md

development/
  plugins/
    plugin-definition.md
    plugin-development.md
    platforms/
      openai-plugins.md
      claude-code-plugins.md
```

## Content rules

Concept pages explain durable lexical knowledge without depending on a particular vendor or product. A concept page should remain useful if every referenced product disappears.

Implementation pages answer:

- What is this product or project?
- Which capability in the parent topic does it implement?
- What does it provide?
- What is it used for?
- What important boundaries or limitations distinguish it?
- Where is its official documentation or canonical repository?

Use primary sources: specifications, official documentation, papers, model cards, and canonical repositories. Avoid aggregator sites where a primary source exists.

Keep pages focused. Split a subject into additional lexical files instead of growing one large catch-all document.

Do not turn the repository into an “awesome AI tools” list. Add implementations because they clarify a capability or are established enough to help readers understand the ecosystem.

## Writing

Write as a technical reference book, not an online course.

- No breadcrumbs, “continue reading”, learning objectives, course progress, evidence badges, or repeated repository navigation inside knowledge pages.
- No chapter numbering.
- No repeated metadata headers.
- Link directly to primary sources where they support the knowledge.
- Examples should clarify the concept rather than advertise a product.
- Keep the root `README.md` as the primary table of contents and compact glossary.

When restructuring content, preserve useful existing knowledge and update internal links.
