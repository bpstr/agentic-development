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

## Mass refactoring without semantic drift

[Refactoring](https://refactoring.com/) changes internal structure while preserving observable behavior. A migration that intentionally changes the public contract is a separate task, even when it shares implementation steps. Establish this distinction before asking an agent to clean a repository.

Repeated transformations can stabilize stylistically without preserving semantics. A [2026 study of five readability-refactoring iterations](https://arxiv.org/html/2602.21833v1) found structural convergence in Java snippets but also functional-test regressions. Its snippet-level evidence and test-adaptation procedure do not establish repository-wide compatibility. [REFINE](https://arxiv.org/abs/2608.23611), an August 2026 file-level refactoring preprint, reports smell reduction while explicitly retaining preservation risks. Static improvement is evidence about a proxy, not complete evidence about behavior.

Treat the following as a proposed engineering workflow, to be calibrated on the repository rather than assumed sufficient for every change.

### Establish a preservation contract

Record the starting commit, relevant runtime/dependency versions, baseline failures, target transformation, permitted paths, public contracts, forbidden changes, and acceptance checks. Distinguish failures introduced by the patch from pre-existing failures; neither should disappear from the report.

For an illustrative service extraction, preserve public method signatures, exception types, serialization, transaction ownership, side-effect ordering, tenant isolation, and the runtime integration path. Include latency or query-count limits when these are explicit requirements. A smaller class is not success if the transaction now commits before its side effect is durable.

Create characterization tests for behavior that is important but poorly specified. Review surprising existing behavior with the requirement owner: characterization captures what happens, not necessarily what ought to happen. Do not silently fix a discovered business bug inside a behavior-preserving batch.

### Prefer constrained transformations

Use symbol-aware IDE/LSP refactors or reviewed AST-based codemods for mechanical transformations where they support the language and operation. Let the model identify exceptions, plan sequencing, and explain risks rather than regenerate every file unnecessarily. Semantic tooling still needs validation: reflection, configuration, templates, dynamic loading, and external consumers may sit outside its model.

Select coherent dependency boundaries for batches, not arbitrary line-count chunks. Inspect incoming callers, outgoing dependencies, initialization, registration, and generated artifacts. Keep a reviewed checkpoint per verified batch and a record of the cumulative diff. Locally successful changes can conflict when integrated.

### Layer the checks

| Layer | Useful evidence | What it does not establish alone |
| --- | --- | --- |
| Syntax, types, lint | Parsable code, compatible statically known calls | Correct business behavior or runtime registration |
| Characterization and differential tests | Original and candidate outcomes match over reviewed inputs | Equivalence outside the tested input/environment space |
| Property and boundary tests | Invariants survive edge cases and generated inputs | Every production interleaving or dependency behavior |
| Integration and contract tests | Callers, database boundaries, serialization, and errors work together | Production scale or all consumers |
| Runtime and end-to-end checks | The application starts and important user flows work | Comprehensive correctness |
| Performance checks | Relevant workloads stay within the agreed budget | Performance under unrepresented workloads |

Differential tests should compare observable outputs and effects, not private function layouts. Normalize only explicitly irrelevant nondeterminism. Inspect exception messages, ordering, and timestamps before deciding they are irrelevant. Use isolated databases or test doubles for effects, never replay production writes merely to compare implementations.

Protect the test contract. Inspect deleted assertions, added skips, broadened snapshots, relaxed thresholds, changed fixtures, removed exports, and altered fail/error paths. Legitimate test maintenance needs its own rationale and review. Passing tests that were weakened to accommodate a regression are not preservation evidence.

### Make each follow-up causal

A follow-up should identify a reproducible failure and its smallest plausible fix. For example: “The extracted service is not registered in the container; the runtime smoke test fails at startup” supports a registration correction. It does not justify replacing the dependency-injection design across the application.

When failures multiply, inspect the earliest causal change and compare against the last verified checkpoint before adding more patches. Reverting a bad candidate is often more informative than repairing its symptoms. Keep the [evaluator–optimizer](../../patterns/evaluator-optimizer-pattern.md) incumbent separate from the latest attempt, with read-only review before consequential acceptance.

After each batch, run targeted tests and affected integration checks; before accepting the cumulative refactor, run the broader regression suite and runtime checks justified by the blast radius. Separate local verification from permission to merge or deploy. Database changes, dependency updates, and external effects can require recovery procedures beyond a Git revert.

## Refactoring completion evidence

Report the preservation contract, reviewed diff, test commands and exit results, environment, tested commit, baseline failures, newly detected failures, unverified surfaces, and rollback boundary. Include what did not change. Fewer smells, less duplication, higher coverage, or fewer lines are secondary improvements only after the relevant behavior contract survives.
