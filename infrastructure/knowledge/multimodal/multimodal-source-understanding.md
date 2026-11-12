# Multimodal source understanding

Multimodal source understanding turns documents, images, recordings, and video into evidence that an application can search and reason over. It is an input-processing capability, distinct from media generation and from the interface used to capture a microphone or display a player.

A loader accepting a file extension does not establish what it understands. It may extract only embedded text, transcribe only the audio track, or generate an image description. Inspect the actual transformation and its output before choosing a downstream retrieval strategy.

## Match the method to the evidence

| Source or question | Method | Useful output | Important limitation |
| --- | --- | --- | --- |
| Digitally authored document | Native parsing and layout analysis | Text, headings, tables, source locations | Embedded scans and figures may need a separate route |
| Scan or photographed text | Optical character recognition | Characters, word regions, engine scores | Recognition is not field interpretation or table reconstruction |
| Photograph, screenshot, chart | Vision-language extraction or visual question answering | Descriptions, visible labels, candidate relationships | Generated descriptions can omit details or introduce unsupported interpretations |
| Spoken recording | Automatic speech recognition, alignment, diarization | Transcript, time intervals, speaker labels | A transcript loses nonverbal and visual information |
| Alarms, machinery, music | Audio event classification or audio-language analysis | Candidate event labels and intervals | A sound label does not establish its physical cause |
| Video or screen recording | Audio analysis plus temporal visual analysis | Linked transcript, frames, scene/event intervals | Sparse frames can miss short events |
| Visual document search | Image-text or multi-vector page retrieval | Ranked source pages or regions | Retrieval does not itself extract the answer |

The [Docling document model](https://docling-project.github.io/docling/concepts/docling_document/), [Gemini audio capabilities](https://ai.google.dev/gemini-api/docs/audio), and [ColPali research](https://arxiv.org/abs/2407.01449) illustrate why these outputs are not interchangeable.

## Preserve evidence through the pipeline

```text
original asset and access policy
  -> inspect format, streams, pages, and existing text
  -> extract native content or apply modality-specific models
  -> retain structured evidence and extraction warnings
  -> chunk, embed, and optionally build graph relationships
  -> retrieve candidates and reopen the relevant source region
  -> answer with page, region, or time references
```

Retain the original asset rather than replacing it with a summary. A useful evidence record identifies the source revision, transformation, and location. This illustrative application schema is not a provider response:

```json
{
  "source_id": "release-demo",
  "source_revision": "rev-7",
  "evidence_id": "release-demo-rev7-audio-12",
  "modality": "audio",
  "method": "speech-recognition",
  "text": "The export is ready.",
  "location": {
    "start_ms": 12400,
    "end_ms": 13700,
    "time_origin": "original-media-start"
  },
  "processor": {
    "implementation": "configured-asr",
    "revision": "deployment-2026-09"
  },
  "warnings": []
}
```

For pages, store page number, bounding box, coordinate units, and the transform back to the original image. For clips, retain the source timebase and any trim offset. Omit unavailable coordinates, timing, and confidence rather than inventing them. Keep directly extracted text, model interpretation, and reviewer corrections distinguishable.

## Adaptive agentic video analysis

Google's [video understanding guide](https://ai.google.dev/gemini-api/docs/video-understanding) documents two different processing modes for recorded video. **Static** is the default and extracts frames at approximately 1 FPS into model context. **Agentic** is opt-in for Gemini 4 Argon and selected Flash models: the model navigates the source timeline, chooses additional frames/resolutions, and consults transcripts in response to the question. Use `"processing": "agentic"` on a video part in the **Interactions API**, rather than assuming every uploaded video or Live API session receives this processing. For lengthy clips, `background=True` is documented to avoid losing long-running progress if the client disconnects.

Agentic processing can reduce tokens on long recordings but can add processing passes and latency; published provider efficiencies are not a guarantee for every clip. When reconstructing a conversation using stateless history, preserve the Interactions `processing_call` and `processing_result` steps needed to retain the analysis context. Results are interpretations, not a verified frame-by-frame transcript: retain original media IDs and time ranges, and replay the relevant original segment when evidence matters.

## Application boundaries

Use a content hash plus processor/model/configuration revision for reproducible processing. A new parser can change results without the source file changing. Propagate access restrictions and deletion to transcripts, thumbnails, embeddings, and graph-derived claims; derived content is not automatically less sensitive.

Treat instructions found in screenshots, documents, or recordings as untrusted source content. Bound decoder runtime, pages, pixels, duration, and model usage before processing unfamiliar uploads. An empty extraction or missing audio track is a reported condition, not successful understanding.

Evaluate each stage separately: extracted-field accuracy, evidence localization, retrieval recall, and answer support. A fluent answer cannot compensate for a missing page or an unanalyzed video track. [Multimodal retrieval](../retrieval/multimodal-retrieval.md) covers the next boundary after extraction.
