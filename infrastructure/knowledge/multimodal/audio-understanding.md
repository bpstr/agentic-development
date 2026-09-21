# Audio understanding

Audio understanding extracts information from recordings. Spoken words are one signal; speaker turns, non-speech sounds, timing, and acoustic conditions are others. This is different from synthesizing speech or managing a live voice interface.

## Methods and their outputs

| Method | Question answered | Typical output |
| --- | --- | --- |
| Voice activity detection (VAD) | Where is speech-like activity? | Speech intervals |
| Automatic speech recognition (ASR) | What was said? | Transcript, sometimes word or segment timing |
| Speaker diarization | Which anonymous speaker spoke when? | Speaker-labeled intervals |
| Forced alignment | Where does a supplied transcript align with speech? | Word or phoneme timing |
| Audio event classification | What kinds of sounds are present? | Event labels and scores over intervals |
| Audio-language understanding | What does this recording support about a question? | A generated answer or structured interpretation |

Diarization labels such as `speaker_0` are not real-world identity verification. Forced alignment also does not prove that a supplied transcript is correct. Evaluate recognition, alignment, and speaker assignment separately.

## Representative implementations

[WhisperX](https://github.com/m-bain/whisperX) combines speech recognition, alignment, and optional diarization. It is useful for searchable recordings and word-level subtitles, but overlapping speech and language-specific alignment remain important limitations. [pyannote.audio](https://github.com/pyannote/pyannote-audio) supplies diarization-related building blocks; individual model access, terms, and hardware requirements must be checked.

[Gemini audio understanding](https://ai.google.dev/gemini-api/docs/audio) supports direct audio questions, transcription, and other audio analysis through a multimodal model. For dedicated transcription services, use the existing [speech-to-text model coverage](../../models/voice/speech-to-text.md), including the linked OpenAI, ElevenLabs, and Deepgram references. Do not assume every transcription endpoint also exposes word timestamps or diarization.

[YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet) is an example of sound-event classification rather than ASR. An alarm label can support locating a candidate interval; it does not establish that a real emergency occurred. Emotion or intent inferred from vocal features should similarly remain an uncertain interpretation, not a fact about the speaker.

## Build a recording pipeline

Inspect codec, sample rate, channels, duration, and stream offsets before conversion. Preserve distinct channels when they represent separate participants. Downmixing to mono may suit an ASR model but loses that channel evidence. Resample only to the selected processor's required input format.

A practical pipeline is decode -> optional speech segmentation -> ASR -> alignment/diarization when needed -> timestamped evidence -> retrieval. Preserve non-speech intervals separately when they matter. Do not discard silence before recording how edited time maps back to the source.

For an action-item extractor, keep the speaker label, exact relevant phrase, time interval, and uncertainty beside the proposed task. Recognition of a deadline does not establish that a user authorized the application to change it.

## Acceptance checks

Use fixtures with accents, Hungarian/English code-switching, background noise, names and numbers, overlapping speakers, long pauses, and recordings without speech. Report word/character error alongside application-specific field accuracy, timing error, and speaker-assignment quality. A low average word error rate can still hide a wrong amount or date.

Apply recording consent and access policy to transcripts and speaker embeddings as well as source audio. Store model/configuration revisions so a re-transcription is identifiable rather than silently replacing the historical evidence.
