# Model output evaluation

Model output evaluation checks whether a particular generated result meets its contract. It is narrower than evaluating a complete agent run: a good answer may follow an unauthorized action, and valid structured output can still refer to the wrong record.

Choose checks according to the output. Parse structured objects and validate required fields deterministically. Compare identifiers and numeric facts against authoritative inputs. Grade prose for relevance, completeness, and factual support, allowing equivalent wording when exact phrasing is not required.

For a release summary, useful criteria include every confirmed blocker being mentioned, every citation resolving to supplied evidence, and no unsupported deadline being asserted. These are separate checks; a single “quality” score can hide an unacceptable factual error.

Model judges can help assess meaning at scale, but their outputs depend on the rubric, examples, model, and supplied evidence. Calibrate them against human-reviewed cases and inspect disagreements. [OpenAI's evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices) discusses task-specific testing and grader choices.

Use paired comparisons on the same inputs when comparing prompt or model revisions. Retain raw outputs and judgments so a score change can be investigated. Repeated sampling exposes variability; one success does not establish reliability. Report case counts and failure categories alongside aggregate scores, latency, and cost.
