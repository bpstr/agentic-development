# Coding-agent verification

Verification establishes whether an agent's change satisfies a task. It should test the claimed behavior and relevant failure modes, then connect the evidence to the actual diff. Code that parses successfully may still implement the wrong business rule.

Choose checks according to the change. A calculation needs representative inputs and boundary cases. A transaction change needs duplicate, concurrent, and failure behavior. A layout change needs rendered inspection at useful viewport sizes. Documentation needs accurate references, valid examples, and working navigation.

## Evidence that supports a conclusion

For a webhook deduplication fix, meaningful checks include:

1. One event creates one invoice.
2. Replaying its identity creates no additional invoice.
3. A distinct event still creates its own invoice.
4. The persistence layer handles the relevant concurrent delivery case.

Assertions should target observable outcomes rather than echoing helper names or implementation details. Otherwise a rewritten implementation may pass tests that never checked the original requirement.

Keep the verification environment reproducible: dependency versions, database fixtures, configuration, and the tested revision matter. Inspect exit status and output instead of treating the presence of a test command as success.

A final report should identify what changed, what passed, and what remains unverified. Distinguish offline checks from live provider calls and vendor documentation from behavior reproduced locally. The general principle is evidence proportional to the claim: a local unit test cannot establish production service availability.
