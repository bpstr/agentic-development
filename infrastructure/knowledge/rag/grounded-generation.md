# Grounded generation

Grounded generation produces an answer whose factual claims can be checked against supplied evidence. Providing documents in a prompt is only the input mechanism; grounding is a property of the resulting claims.

Give each evidence item a stable identifier, source revision, location, and text. Ask the model to connect claims to those identifiers and to distinguish supported facts from inference or missing information. Resolve source URLs in application code instead of accepting invented links.

For example, a runbook stating “Pause billing jobs before restoring the snapshot” supports an answer describing that ordering. It does not support “A verified snapshot is available” or “The restoration succeeded.” Those require separate evidence.

Contradictions need explicit handling. If two revisions disagree, prefer the authoritative current source or describe the conflict. Do not turn a majority of duplicated passages into an authority rule.

The [ALCE research project](https://github.com/princeton-nlp/ALCE) separates aspects of answer and citation quality. An application can similarly evaluate factual correctness, citation support, and whether all material claims have appropriate evidence.

Grounding also requires restraint: report insufficient evidence when retrieval cannot answer the question. A model may produce a plausible continuation from its training even when the provided sources are silent. Test that failure case deliberately rather than evaluating only questions with easy supporting passages.
