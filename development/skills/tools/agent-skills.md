# Agent Skills format

Official specification: [Agent Skills](https://agentskills.io/specification). Integration guidance: [Integrate skills](https://agentskills.io/integrate-skills).

Agent Skills is an open package format for reusable agent procedures. A skill is a directory whose required `SKILL.md` contains YAML metadata followed by Markdown instructions. Optional files support execution or provide additional context.

## Minimal package

A directory named `review-migration` can contain this illustrative `SKILL.md`:

```markdown
---
name: review-migration
description: Review schema migrations for rolling-deployment compatibility.
---

Inspect changed fields and the application code using them.
Check whether old and new deployments can operate simultaneously.
Report incompatible ordering with file references.
```

The specification requires `name` and `description`; the name must match its directory and satisfy the format's naming constraints. Optional `scripts/`, `references/`, and `assets/` directories separate executable helpers, longer explanations, and reusable resources.

## Loading and interoperability

Hosts can expose lightweight metadata before loading the selected procedure and its supporting files. This keeps unrelated instructions out of the active task context.

The format does not guarantee that every client offers identical tools, runtimes, installation paths, or permission behavior. In particular, the experimental `allowed-tools` field has host-dependent support. A package's declaration should not be mistaken for a universal authorization mechanism.

Evaluate compatibility through a complete task: discovery, instruction loading, access to a referenced file, any helper execution, and inspection of the result. A valid frontmatter block establishes package syntax; it does not establish useful behavior or correct domain knowledge.
