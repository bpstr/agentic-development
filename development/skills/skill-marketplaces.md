# Skill marketplaces

A skill marketplace or directory connects users with reusable procedures and their publishers. It can add search, categories, installation commands, release information, audits, and popularity signals around the underlying skill package.

The catalog is a discovery and distribution layer. The canonical repository contains the instructions and helpers that determine behavior. A listing may change independently of a pinned local copy, and an update can change what that copy does.

## Compare the distribution contract

Before adopting a directory, establish:

- where the actual package is fetched from;
- how publisher identity and source provenance are represented;
- whether installation is project-scoped or user-scoped;
- how versions, upgrades, and removal work;
- which hosts and package layouts are supported;
- what an audit checks and what it does not establish.

Popularity indicates adoption, not success on a particular workflow. Security scanning may catch known patterns while missing incorrect domain advice or unintended behavior. [Skills.sh's documentation](https://www.skills.sh/docs) describes its installation-based ranking and the limits of its quality guarantees.

For a team, keep a small reviewed set tied to known sources and tasks. An internal catalog can point to existing repositories without creating a new skill format. Reevaluate a procedure when it changes dependencies, accesses a new service, or stops meeting its acceptance criteria.

Distinguish skill catalogs from [plugin distribution](../plugins/plugin-distribution.md). A plugin may bundle several skills with MCP connections and host-specific extensions, so its installation contract is broader.
