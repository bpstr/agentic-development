# OpenAI official skills

Official repository: https://github.com/openai/skills

OpenAI maintains a public skills repository containing system, curated, and experimental skills used with Codex-style skill workflows. It is useful both as an install source and as reference material for production skill structure.

Notable examples include:

- **skill-creator** — guidance and utilities for authoring effective skills.
- **openai-docs** — current OpenAI developer-documentation workflow.
- **security-best-practices** — framework-aware secure-development guidance.
- **skill-installer** — installation workflow for skills from GitHub sources.

OpenAI's skill guidance demonstrates progressive disclosure: lightweight metadata determines when a skill is relevant, the main `SKILL.md` supplies the core procedure, and scripts/references/assets are loaded or executed only when needed.

Treat the repository as a living implementation source. Inspect the exact skill revision before relying on behavior.
