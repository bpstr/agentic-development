# Context selection

Context selection chooses which available information enters the next model request. Candidates can include recent messages, user corrections, retrieved passages, application state, tool descriptions, and prior results. Selection decides relevance and priority before material is packed into the available context budget.

Apply access controls and source eligibility first. Then rank eligible material by its relationship to the current question, authority, freshness, and information gained beyond already selected evidence. Deduplicate overlapping passages while preserving source identifiers. A high similarity score does not establish that a passage is current or answers the question.

For a question about a release blocker, select the current release record, the blocking issue, and the latest decision that changed its status. An older conversation describing a resolved blocker should not outweigh the current issue state merely because its wording resembles the question.

Selection can happen before inference or progressively through tools. [Anthropic's context engineering discussion](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) describes keeping lightweight references and loading details as the task requires them.

The main failure is excluding the decisive evidence. Measure answerability and missing-source errors as well as token reduction. When sources disagree, include enough provenance to expose the conflict instead of silently treating the highest-ranked passage as truth. Re-select after new observations change the task.
