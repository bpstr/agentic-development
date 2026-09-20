# Humanizer

Canonical repository: [blader/humanizer](https://github.com/blader/humanizer). Discovery listing: [Skills.sh](https://skills.sh/blader/humanizer).

Humanizer is a writing skill that identifies recurring stylistic patterns associated with machine-generated prose and revises the text. It is a useful example of an instruction-oriented skill: the main capability comes from an editorial procedure rather than a network protocol or hosted service.

## Install and apply

One documented distribution path uses the Skills CLI:

```bash
npx skills add blader/humanizer
```

Inspect the current source and select the intended host and installation scope. Then provide the actual text and its constraints. For example:

```text
Apply Humanizer to this release note. Preserve API names, numerical
claims, links, and quoted customer text. Keep the author's direct tone.
```

The procedure's value is easier to assess when the original and revised text can be compared. Look for unnecessary changes to domain terms, altered emphasis, invented examples, or factual drift.

## Editorial limits

Patterns such as repetitive transitions or inflated claims can be useful editing signals, but no stylistic checklist determines whether a passage was written by a human. Treat the skill as a writing aid, not an authorship detector.

For technical documentation, clarity and accuracy matter more than eliminating every phrase on a style list. Keep exact identifiers and carefully chosen terminology even when a general writing rule would prefer variation. Evaluate the result against the document's purpose and audience.
