# Anthropic official skills

Official repository: [anthropics/skills](https://github.com/anthropics/skills). Format: [Agent Skills specification](https://agentskills.io/specification).

Anthropic's public skills repository contains examples and document-oriented procedures for Claude skill workflows. It illustrates how a skill combines instructions, reference material, and helpers for concrete tasks.

## Install through Claude Code

The repository documents registration as a plugin marketplace:

```text
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
```

The example bundle is available separately as `example-skills`. Choose the bundle that matches the task instead of installing unrelated procedures solely because they share a publisher.

Once available in the host, provide a concrete input and request the relevant skill. For example:

```text
Use the PDF skill to inspect the form fields in this document and
report their names, types, and current values.
```

This task has inspectable output, which makes it easier to evaluate than an open-ended request to “improve the document.”

## Understand the reusable parts

Document skills cover formats such as PDF, DOCX, PPTX, and XLSX. Some portions have different licensing terms, so read the applicable files before redistributing or adapting them.

A skill that manipulates a document still needs its runtime dependencies and a host with appropriate file access. Inspect produced artifacts in their rendered form when layout matters. Successful script execution alone does not establish that a presentation, spreadsheet, or document is usable.

Use the repository as implementation material, with behavior checked against the selected task and exact skill revision.
