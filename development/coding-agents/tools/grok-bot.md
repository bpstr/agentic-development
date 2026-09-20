# Grok Bot

Official documentation: [Grok Bot overview](https://docs.x.ai/grok-bot/overview). Product announcement: [Introducing Grok Bot](https://x.ai/news/introducing-grok-bot).

Grok Bot is a persistent work-agent product. A named bot retains context and works through a cloud computer with a browser, filesystem, and terminal. It can support development work, but its scope also includes workflows across business applications.

## Give it a concrete job

Create a bot through the supported product surface, describe its role, and connect the applications needed for a bounded task. An illustrative development assignment is:

```text
Reproduce the reported invoice error in the staging application.
Record the steps, relevant screenshots, and observed result.
Prepare a focused engineering handoff with the evidence.
```

The bot's output should establish what it observed and which environment it used. A later coding task can consume that evidence without assuming the reproduction also identified the root cause.

## Persistence changes the boundary

The documentation states that bots within an account share a cloud computer, including files, browser sessions, and app logins. Different bot names therefore do not establish separate credential or filesystem isolation. Treat shared resources accordingly.

Persistent files and learned routines can reduce repeated setup, but they can also become stale. Check the current application state before repeating a previously successful workflow, and keep the intended action and its authorization clear.

Use [Grok Build](grok-build.md) for the separate terminal coding-agent interface. Neither product's announcement examples establish performance on a new team's particular repository or business workflow.
