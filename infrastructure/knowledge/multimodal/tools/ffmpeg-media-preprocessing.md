# FFmpeg and ffprobe for media preprocessing

[FFmpeg documentation](https://ffmpeg.org/ffmpeg.html) · [ffprobe documentation](https://ffmpeg.org/ffprobe.html) · [Official downloads](https://ffmpeg.org/download.html)

FFmpeg decodes, selects, converts, and extracts media streams. ffprobe reports their metadata. They prepare audio and video for understanding models; they do not transcribe speech or explain visual events.

Use them to establish what an uploaded container actually contains before selecting ASR, image analysis, or a native audio-video model. File extension alone does not identify codec, available streams, channels, or timing.

## Inspect and prepare bounded inputs

With `ffmpeg` and `ffprobe` installed on PATH, inspect a local recording:

```bash
ffprobe -v error -show_format -show_streams -of json input.mp4 > streams.json
```

Extract the first audio stream, limiting this illustrative sample to one minute:

```bash
ffmpeg -n -i input.mp4 -map 0:a:0 -t 60 -vn -ac 1 -ar 16000 audio.wav
```

The explicit map fails when no audio stream exists instead of silently choosing a different track. Mono 16 kHz is an example ASR input choice, not a universal model requirement. Preserve original channels when they distinguish participants, and do not replace the source recording with this derivative. `-n` prevents overwriting an existing output.

Extract a candidate visual observation near ten seconds:

```bash
ffmpeg -n -i input.mp4 -ss 10 -map 0:v:0 -frames:v 1 frame.png
```

This demonstrates a single-frame extraction, not comprehensive video understanding. For an evidence-producing sampler, retain actual decoded presentation timestamps and the mapping to the original timeline. A requested seek time or numbered filename is not a measured event boundary.

## Timing and quality

Inspect stream start times, timebases, and frame rates. Trimming and resampling can change the relationship between derivative positions and source time. Variable-frame-rate video cannot be localized reliably by multiplying a frame index by an assumed fixed interval.

Repeated frame extraction should use a documented sampling policy and bounded output count. Scene-change thresholds can reduce redundant frames but are not semantic event detectors. Reinspect candidate intervals at finer resolution when a short event matters.

Decoder success establishes that a stream was processed, not that its evidence is complete. Validate duration, output stream properties, and expected audio/video presence before calling a model.

## Production boundary

Run patched decoders in resource-limited workers for untrusted media. Cap duration, resolution, output size, and execution time; restrict network protocols and remote inputs. Invoke commands with an argument array rather than interpolating untrusted filenames into a shell. Record tool version and conversion parameters, retain stderr for diagnosis, and remove temporary derivatives according to the source retention policy.
