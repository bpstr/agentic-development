# Skills.sh and the Skills CLI

Official site: [Skills.sh](https://skills.sh/). Documentation: [directory overview](https://www.skills.sh/docs), [CLI source](https://github.com/vercel-labs/skills).

Skills.sh is a public discovery directory for agent skills. The associated Skills CLI searches and installs packages into supported agent environments. It is a distribution tool around skill sources, rather than a replacement for the Agent Skills format.

## Find and inspect a package

The documented CLI supports keyword search and repository installation:

```bash
npx skills find migrations
npx skills add blader/humanizer
```

These commands require network access and may download the CLI. Use the installer's prompts and current options to select the intended agents and scope. Confirm what was installed before relying on it in an existing workflow.

A listing leads to a canonical repository, where the actual `SKILL.md`, scripts, assets, and dependencies can be reviewed. The site also presents popularity signals derived from installation activity. Those signals measure adoption; they do not measure accuracy on a particular task.

## Adopt by demonstrated behavior

Inspect a skill's source and publisher, then try it on a representative input. Check whether its output preserves the necessary facts and whether its helpers access the expected resources. Skills.sh describes audits but explicitly does not guarantee every listed skill's quality or security.

A team can use the CLI for convenient installation while maintaining its own reviewed set of sources and revisions. Keep update behavior visible so a changed upstream procedure does not silently alter a critical workflow.
