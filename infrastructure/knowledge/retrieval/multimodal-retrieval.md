# Multimodal retrieval

Multimodal retrieval finds relevant evidence across text, images, document pages, audio, or video. The representation used for search determines which details can be found; accepting a multimedia file does not imply that the index contains its original modalities.

## Three representation strategies

**Text surrogates** turn OCR, transcripts, captions, and scene descriptions into text chunks. They work with ordinary keyword and text-vector search and make retrieved evidence easy to inspect. Their limitation is irreversible omission: a caption that never mentions the small warning icon cannot support searching for it.

**Shared-space embeddings** encode different modalities into compatible vectors. [CLIP](https://github.com/openai/CLIP), for example, aligns text and images for matching. This supports text-to-image retrieval without requiring a caption first, but an embedding is neither a description nor an extracted answer. Training scope and preprocessing still affect results.

**Multi-vector visual document retrieval** represents a page with multiple vectors and scores query-to-page interactions. [ColPali](https://arxiv.org/abs/2407.01449) and the [ColVision implementations](https://github.com/illuin-tech/colpali) preserve visual document information in the retrieval representation. They are retrieval models, not OCR engines, and require a compatible multi-vector scoring/indexing path rather than assuming an ordinary single-vector field is sufficient.

## Combine evidence without losing identity

A practical document system can use lexical search for exact invoice IDs, text-vector search for explanations, and visual retrieval for charts and scanned layouts. Merge candidates by stable source/page identity, not by comparing unrelated raw similarity scores. Reopen the source page or crop for grounded extraction after retrieval.

For recordings, index transcript segments and visual/audio representations with their source intervals. An answer to “where did the failure first appear?” needs localized evidence, not only the recording ID. [TwelveLabs' index concepts](https://beta.docs.twelvelabs.io/docs/concepts/indexes) illustrate configuration of video search modalities.

Keep source revision, extractor revision, model ID, preprocessing, and chunk/page/time identity with each entry. Vectors from different embedding models are not interchangeable merely because their dimensions match. Re-embedding or a separate index is usually required when changing representation; validate the specific model's migration contract.

## Evaluation and access control

Construct queries whose answers depend on different evidence: exact visible text, a diagram edge, a spoken correction, or a silent video event. Evaluate candidate recall before evaluating the final answer. Compare a text-only baseline against visual or hybrid retrieval to show which failures the additional complexity resolves.

Use permission-aware candidate selection and authorization before returning source assets. A thumbnail, transcript, embedding-backed result, or generated caption must not expose a record hidden from the current user. Deletion and revision changes must invalidate all derived representations, including duplicate chunks and graph references.

Retrieval failure and answer uncertainty are different. Report when the necessary modality was never indexed instead of treating a text search miss as proof that the source contains no relevant evidence.
