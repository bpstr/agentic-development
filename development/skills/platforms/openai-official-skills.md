# OpenAI official skills

Official repository: [openai/skills](https://github.com/openai/skills). Authoring guidance: [Build skills](https://learn.chatgpt.com/docs/build-skills).

OpenAI's skills repository publishes reusable procedures for Codex workflows. Its system, curated, and experimental collections provide both installation sources and examples of how to organize instructions and supporting resources.

## Install a focused capability

The repository documents installation through the built-in skill installer. A named curated example is:

```text
$skill-installer gh-address-comments
```

An explicit repository directory can identify a skill outside the default curated collection. Follow the catalog's current installation and session-refresh instructions so the target host discovers the added skill.

The collection is useful for studying responsibilities: a skill creator teaches authoring, an installer handles distribution, and a documentation skill retrieves current primary sources. Inspect the selected skill's actual files rather than inferring its behavior from the catalog name.

## Reuse the structure thoughtfully

Good candidates for reuse separate core instructions from larger references and executable helpers. That allows a host to load a procedure without immediately loading every supporting example.

Before adopting or adapting a skill, inspect its dependencies, license, host assumptions, and the revision being used. A procedure written for one execution environment may refer to tools or resource paths absent from another.

Try a representative task and review the resulting artifact or action. An official source provides provenance, while usefulness still depends on the task, available tools, and whether the procedure's assumptions match the environment.
