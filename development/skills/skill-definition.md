# Skill definition

An agent skill is a reusable procedure for a recognizable class of tasks. It can combine written guidance with scripts, examples, and templates. The skill helps an agent decide how to perform work; the host's tools and permissions determine which operations it can execute.

A migration-review skill, for example, can explain how to assess schema compatibility and deployment order. A database tool retrieves the current schema. A plugin can distribute both together. These mechanisms cooperate without having the same responsibility.

The [Agent Skills format](tools/agent-skills.md) represents a skill as a directory containing `SKILL.md`. Its description helps the host or agent select it, while the body supplies the procedure. Supporting resources can remain separate until needed.

## A useful procedure

A skill should establish:

- the tasks and conditions that make it relevant;
- the inputs or context it needs;
- the decisions and steps that produce the result;
- the evidence needed to verify completion;
- how to handle missing information or failed tools.

“Act as a senior engineer” names a persona but does not supply a repeatable method. “Inspect the migration, check simultaneous old/new application compatibility, and report unsafe ordering” is operational knowledge.

A skill is also distinct from conversation memory. It explains how to perform a class of work, while memory records facts or decisions from previous work. Reusable skill selection and execution should be evaluated on realistic tasks, including nearby tasks where the skill should remain inactive.
