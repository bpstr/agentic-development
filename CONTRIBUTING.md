# Contributing

The handbook explains categories and development decisions using representative implementations. Changes should help a reader understand a mechanism, evaluate a tradeoff, or reach a reliable primary resource.

## Add or improve a topic

1. Find its home in the [chapter map](README.md). Prefer improving an existing explanation over creating a second definition.
2. Describe the problem, the mechanism, a small example, and the relevant limits. Distinguish application policy from vendor behavior.
3. Read the actual primary source: official documentation, a specification, an author's paper, or the maintainer's repository. Link directly to the supporting page.
4. Date changing claims and identify relevant API/specification versions. A project's default branch can move; record a tag or commit for reproducible integration tests.
5. Add chapter navigation and an entry in the [topic index](docs/12-reference/topic-index.md) when needed.
6. Run the checks below and record what was actually tested.

## Evidence labels

| Label | Required evidence |
| --- | --- |
| Source-reviewed | Primary source read, review date, and a link supporting the claim |
| Locally tested | Runnable files, environment/dependency versions, command, expected behavior, and verification date |
| Illustrative | Explicit statement that the snippet is schematic or unexecuted, with placeholders explained |

Do not describe a product as proven, fastest, secure, or production-ready merely because its README says so. Describe its documented role and evaluate it against the workload. For community projects, include the owner/repository and explain why that example belongs in the category. Record unresolved identity questions without silently selecting a similarly named project.

## Page format

Use a descriptive title, a link to the handbook and chapter, then a source-review date when applicable. Most topic pages need:

- A definition and the problem it solves.
- How it works and where its responsibility ends.
- An original example or a compact decision table.
- Limits, failure modes, or selection guidance.
- Primary resources and links to adjacent chapters.

Avoid duplicated vendor marketing, enormous catalogs, uncited rankings, and extensive copied documentation. Leave current prices at their authoritative source unless a calculation needs a clearly dated snapshot. Explain model price units, benchmark settings, and environment differences before comparing numbers.

## Verification

Run from the repository root:

```sh
python3 scripts/check_docs.py
node --test examples/tool-loop/agent-loop.test.mjs
node examples/tool-loop/demo.mjs
```

The documentation checker validates local links, local heading fragments, fence balance, and JSON syntax in JSON fences. It also checks that every chapter has an index and every topic is linked from that index. It does not check external URL availability or factual accuracy. Review those against actual sources, including redirects and version-specific behavior.

Provider-backed examples must be opt-in. Document credentials, supported versions, expected charges, and cleanup. Repository CI should not call paid models. Update [VERIFICATION.md](VERIFICATION.md) to distinguish new live checks from existing offline checks.

## Maintaining changing knowledge

Review model catalogs, prices, and endpoint changes when editing their pages. For protocols, link a versioned specification and explain compatibility with older clients. Mark superseded material with a replacement link rather than leaving it as an unexplained alternative. For retired or unmaintained tools, preserve the concept and replace or qualify the implementation example.
