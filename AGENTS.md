# Working on this handbook

- Read `PLAN.md` and `CONTRIBUTING.md` before changing structure or editorial policy.
- Organize by concepts and developer decisions. Put products in the category they illustrate.
- Verify changing technical claims against primary sources. Link near the supported claim and date the source review. Never invent benchmarks, prices, API names, product identities, or claims of production testing.
- Distinguish documented capabilities, local test results, and illustrative examples.
- Preserve the existing MIT license. Write original summaries; link to deeper resources instead of copying documentation.
- Keep pages concise but explanatory. Include a concrete example, a useful limit, and related reading where appropriate.
- Use relative links for handbook navigation. Update chapter indexes and the reference index when adding pages.
- Keep examples offline by default. Live provider calls must be explicit and have documented credentials and costs.
- Run `python3 scripts/check_docs.py` and `node --test examples/tool-loop/agent-loop.test.mjs` before completing changes that affect the handbook or its example.
