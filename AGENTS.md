# Agent instructions

This repository is a taxonomy and technical reference for agentic development.

## Structure

Organize content by **concept or capability**, never by vendor. The filesystem is part of the knowledge model.

- Root directories represent major aspects such as `foundations/`, `infrastructure/`, `interfaces/`, `operations/`, and `development/`.
- Nested directories represent increasingly precise concepts.
- Use descriptive, search-friendly filenames such as `model-definition.md`, `text-to-video.md`, `plugin-development.md`, and `durable-execution.md`.
- Do not create generic `knowledge.md` or `introduction.md` files when a lexical filename can describe the subject.
- Subdirectories may repeat a parent term when that produces a precise taxonomy; filenames should still be unique and descriptive enough to search globally.
- Require globally unique Markdown basenames. Qualify a repeated product by capability: `langchain.md` versus `langchain-retrieval.md`, `openai.md` versus `openai-inference.md`, and `langsmith.md` versus `langsmith-evaluation.md`.
- Concrete implementations belong beneath the concept they implement.
- Prefer semantic implementation directories such as `providers/`, `frameworks/`, `platforms/`, `tools/`, `libraries/`, `runtimes/`, `image-generators/`, or `video-generators/` instead of generic `references/`.
- A product may appear under multiple concepts when it genuinely implements multiple capabilities. Each page must discuss only its relationship to the parent concept.

Example:

```text
infrastructure/
  models/
    model-definition.md
    media/
      text-to-image.md
      image-to-image.md
      text-to-video.md
      image-generators/
        openai-gpt-image.md
      video-generators/
        veo.md
        seedance.md

development/
  plugins/
    plugin-definition.md
    plugin-development.md
    common-agent-plugin-format.md
```

## Concept pages

Concept pages explain durable lexical knowledge without depending on a particular vendor or product. They should remain useful if every referenced product disappears.

Use the most precise established professional term available. Distinguish neighboring concepts instead of merging them for convenience: for example, agentic commerce versus agentic checkout, model inference versus orchestration, GraphRAG versus knowledge graphs, and image generation versus image editing.

## Implementation pages

Implementation pages should normally begin with:

1. links to official documentation and the canonical repository/specification when available;
2. a short readable description of what the implementation is;
3. what capability in the parent topic it implements and when it is useful.

For substantial developer tools and frameworks, go beyond a product summary when official material supports it. Include:

- quick start;
- basic setup and required configuration;
- minimal executable examples for the core lifecycle;
- important API or CLI operations;
- production boundaries and limitations;
- best practices;
- links to deeper official documentation.

For data/knowledge tools, show both **ingestion/indexing** and **retrieval/query** when those are separate operations. For agent frameworks, show a minimal agent/tool/run lifecycle. For protocols, show the smallest meaningful exchange or object model.

Do not invent code from an uncertain API. If exact syntax is unstable or cannot be verified, explain the flow conceptually and link to the current official example.

## Sources

Use primary sources: specifications, official documentation, papers, model cards, and canonical repositories. Avoid aggregator sites where a primary source exists.

Time-sensitive product details such as model IDs, pricing, API versions, browser support, and preview/beta status must be checked against current official sources before editing.

Community directories such as Skills.sh can be used to document discovery, installation, popularity, or community skills, but the skill's canonical repository remains the source for its actual contents.

## Scope

Keep pages focused. Split a subject into additional lexical files instead of growing one large catch-all document.

Do not turn the repository into an “awesome AI tools” list. Add implementations because they clarify a capability, are widely used, represent an important architectural approach, or are official reference implementations.

Peripheral areas are welcome when they materially affect agentic development. Examples include media generation, agentic commerce, browser-native agent interfaces, skills and plugins, code intelligence, observability, security, and deployment.

## Writing

Write as a technical reference book, not an online course.

- No breadcrumbs, “continue reading”, learning objectives, course progress, evidence badges, or repeated repository navigation inside knowledge pages.
- No chapter numbering.
- No repeated metadata headers.
- Link directly to primary sources where they support the knowledge.
- Examples should clarify the concept rather than advertise a product.
- Prefer concise technical prose over marketing terminology.
- Keep the root `README.md` as the primary table of contents and compact glossary.
- Use nested bullet lists for the complete table of contents, with every knowledge page linked once under its actual filesystem parent. Use tables only for substantive comparisons.
- Keep the root limited to `README.md`, `LICENSE`, `AGENTS.md`, and content directories. Do not add documentation generators, a `docs/` wrapper, scripts, example projects, CI workflows, or course administration files unless explicitly requested.

## Completeness and validation

Create actual explanatory articles when implementing a taxonomy; a filename, link collection, placeholder, or proposed tree is not a completed guide. Each page should define its subject and provide a useful mechanism, example, decision, or limitation. Split implementation setup into descriptive companion pages when it becomes too large.

Before publishing, check global filename uniqueness, README coverage, relative links including anchors, fenced JSON and code syntax, and obsolete references after moves. Perform temporary checks outside the repository rather than adding repository machinery. Use offline execution where it meaningfully validates an example. Do not call paid APIs or claim live integration testing merely because a snippet parses.

Remove outdated source-review banners and course navigation from retained pages. Keep relevant API revision and preview limitations in the knowledge itself. Preserve the MIT license and useful existing explanations while relocating content.

When restructuring content, preserve useful existing knowledge and update internal links.
