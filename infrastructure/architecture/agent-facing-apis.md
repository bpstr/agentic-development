# Agent-facing APIs

Agent-facing APIs expose operations with schemas and semantics that are easy for models and runtimes to use safely. Good operations are narrow, clearly named, bounded, idempotent where possible, and return stable identifiers plus actionable errors.

Avoid generic execute-anything endpoints. The API should encode domain intent rather than pushing business semantics into prompts.
