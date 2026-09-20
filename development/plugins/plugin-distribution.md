# Plugin distribution

Plugin distribution connects a versioned package with an agent host's installation and update mechanism. Common paths include a local development directory, a Git repository, a private marketplace, and a public catalog. These paths have different discovery, review, and update behavior.

A release should identify a source revision and contain the resources needed by the package. A repository URL alone does not establish which version a user receives or whether an update will be automatic.

## A reproducible release

Validate the packaged files rather than only the development checkout. Include supported host requirements, configuration prerequisites, the license, and a short explanation of the capability. Keep credentials outside the release and make initial configuration understandable.

For Claude Code, a marketplace supplies a catalog of plugin sources. Its documentation defines `.claude-plugin/marketplace.json`, supported source types, and installation commands. A private or local marketplace can distribute a plugin before public catalog acceptance. [Claude marketplace reference](https://code.claude.com/docs/en/plugin-marketplaces)

OpenAI's public plugin flow separately documents connection testing and submission. Public listing is a distribution step, not an automatic consequence of writing a valid manifest. [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)

When changing a release, consider component compatibility and rollback. A skill-only edit can change task behavior just as significantly as an MCP implementation update. Verify a representative workflow after installation and preserve enough version information to diagnose differences between team members' environments.
