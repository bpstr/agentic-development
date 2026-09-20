# Voice agents

A voice agent adds speech input, spoken output, and conversational timing to an application that can reason or perform work. Speech capture and playback are interface capabilities; the agent still needs authorized tools, recoverable execution, and meaningful saved results.

There are three common arrangements:

- **Chained speech:** transcribe audio, run a text agent, then synthesize speech. Each stage can be inspected and replaced, but buffering and handoffs add latency.
- **Speech-to-speech:** an audio-capable model handles spoken input and output within a conversational session.
- **Voice with delegated work:** the speaking model remains available while a separate agent or service completes tasks.

For example, “Summarize the release blockers” may create a background analysis while the voice interface answers a follow-up question. Save the detailed analysis in the same conversation and speak a brief, accurate result when appropriate. An interrupted sentence should not erase the stored result or automatically cancel the analysis.

Voice activity detection estimates speech boundaries. It does not establish business intent or consent. “Move the deadline to Friday—actually, Monday” illustrates why partial transcripts need careful handling. Consequential actions should depend on resolved intent and the application's approval policy.

Show microphone and connection state, provide text alternatives, and let users stop playback. Track what was actually spoken separately from backend-generated text. Measure time to audible response, task accuracy, interruption handling, and whether spoken confirmations match saved changes.

OpenAI's [voice architecture guide](https://developers.openai.com/api/docs/guides/voice-agents) documents implementations of these patterns. The architectural choice should follow interaction needs, required control, and measured behavior on the application's own tasks.
