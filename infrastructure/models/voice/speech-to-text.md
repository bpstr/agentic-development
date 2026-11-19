# Speech-to-text models

Speech-to-text models convert speech audio into text. In agent applications they are used for transcription, command capture, searchable conversation records, and as the first stage of a chained voice pipeline.

Realtime transcription differs from file transcription. A streaming recognizer may emit provisional text, revise it, and later mark a segment or turn final. Applications must not treat every partial token as durable user intent.

For example, the live sequence:

```text
"move the deadline to fri..."
"move the deadline to friday"
"move the deadline to friday — actually monday"
```

may represent one evolving turn rather than three instructions. Tool execution should normally depend on finalized intent or an application-defined confirmation rule.

## Important capabilities

Evaluate:

- partial versus final transcript semantics;
- word or segment timestamps;
- speaker diarization when multiple speakers are present;
- language detection and multilingual code-switching;
- keyword or keyterm prompting for domain vocabulary;
- punctuation and formatting;
- end-of-turn signals;
- latency under real microphone and network conditions.

Voice activity detection is not transcription. VAD detects speech activity; a turn detector decides whether the speaker appears finished; STT determines what was said. Providers may combine these signals, but the application should keep the distinction clear.

Current official references include [OpenAI GPT-Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe), [OpenAI GPT-Live-Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe), [ElevenLabs Scribe models](https://elevenlabs.io/docs/overview/models), and [Deepgram Voice Agent STT models](https://developers.deepgram.com/docs/voice-agent-stt-models).

Persist transcript provenance when it matters. A displayed transcript can be corrected after the user has already heard or seen an earlier version, and generated backend actions should retain the finalized text or audio reference they were based on.

## Voice editing versus literal transcription

Google's [November 17, 2026 Gemini update](https://aistudio.google.com/docs/changelog) adds voice-driven **editing, rewriting, and formatting** to `gemini-3.5-transcribe` and `gemini-3.5-transcribe-live`. The [Transcribe guide](https://aistudio.google.com/docs/transcribe#voice-editing) supports spoken edits to dictation or supplied `source_text`, while the [Live Transcribe guide](https://aistudio.google.com/docs/live-api/live-transcribe#voice-editing) documents the streaming counterpart.

This is a different output contract from verbatim recognition: an edited result may omit disfluencies, correct wording, or deliberately rewrite existing text. Store raw recognized speech (when available), the requested edit operation, source revision, and resulting edited text separately. In workflows where exact spoken authorization or evidence matters, do not substitute the edited document for the underlying transcript. Treat uncertain partial live text as provisional and require confirmation before side-effecting commands.
