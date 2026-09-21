# Video understanding and temporal evidence

Video understanding analyzes visual change over time, often together with speech and other audio. A transcript extracted from a video is useful evidence about its audio track, but cannot establish what happened silently on screen.

For example, a release demo may say “the export is ready” before a failure dialog appears. An audio-only index misses the contradiction. A single thumbnail may miss it too. The relevant evidence consists of spoken words, the dialog's visible text, and their positions on the same timeline.

## Choose the processing path

| Path | Appropriate use | Missing or uncertain evidence |
| --- | --- | --- |
| Audio extraction and ASR | Talks, spoken explanations, searchable dialogue | Silent actions, slides, visual state |
| Sampled frames plus OCR/VQA | Slides, screen recordings, coarse scene summaries | Events occurring between samples |
| Scene-aware clips plus visual analysis | Locating transitions and relating observations over time | Detector thresholds can miss subtle changes |
| Native audio-video model | Questions requiring both modalities and temporal context | Internal sampling and model limits still apply |
| Video embeddings and temporal search | Finding relevant clips across a collection | A search match is not a verified answer |

[Gemini video understanding](https://ai.google.dev/gemini-api/docs/video-understanding) documents audio-video input and timestamped questioning. Its documented static processing samples frames, so fast events need explicit sampling choices or closer inspection. Treat quoted timestamps as candidate evidence until checked against the source.

[Docling's audio/video pipelines](https://docling-project.github.io/docling/usage/processing_audio_media/) distinguish an ASR route from a dedicated video route that can include sampled frames. The [Cognee video loader](https://github.com/topoteretes/cognee/blob/663a2dc15d04bc0d7ec2733a2dd604b7ed1b8c8e/cognee/infrastructure/loaders/core/video_loader.py) at the inspected revision follows the audio-transcription route, not visual analysis.

## Keep one source timeline

Use [FFmpeg and ffprobe](tools/ffmpeg-media-preprocessing.md) to inspect streams and prepare bounded clips or audio. Keep original presentation timestamps, trim offsets, frame selection policy, and audio/video offsets. A generated filename such as `frame-0042.jpg` is not evidence that the frame occurred at 42 seconds.

Combine fixed-interval coverage with scene-change or event-driven inspection when needed. Retain a mapping from sampled frames back to original time. Scene-change detection identifies visual changes, not necessarily meaningful events; stable scenes can still contain a brief cursor movement or changed number.

Store transcript intervals, OCR regions, frame descriptions, and inferred events as different records linked to the asset. Retrieve candidate intervals first, then reopen the relevant clip with surrounding context. Do not collapse an hour-long recording into one paragraph and expect precise later answers.

[TwelveLabs indexes](https://beta.docs.twelvelabs.io/docs/concepts/indexes) illustrate a hosted video-retrieval approach. Check the selected model's supported indexing, embedding, and search endpoints; a newer embedding model is not automatically a compatible replacement for an existing search index.

## Test temporal claims

Include silent clips, missing audio tracks, slide-only evidence, rapid transient dialogs, variable frame rate, offset audio, repeated scenes, and incorrect subtitles. Measure event localization and source-reference accuracy, not only summary fluency. “Not observed in sampled frames” is different from “did not occur.” Preserve that distinction in answers and downstream graph relationships.
