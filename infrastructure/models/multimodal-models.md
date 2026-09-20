# Multimodal models

A **multimodal model** accepts or produces more than one type of information, such as text, images, audio, or video. Input and output capabilities are independent: a model that describes an image may still produce only text. Image synthesis and video synthesis are separate capabilities with their own generation contracts.

Represent a multimodal message as typed parts with explicit relationships. An instruction can refer to an attached page, a particular image region, or a timestamp in a video. Flattening everything into one text string discards that structure and can make references ambiguous.

For example, a support assistant reviewing a screen recording needs to connect the user's complaint to the relevant frame and UI action. It may require video input, frame extraction, or a separate preprocessing pipeline. Google's [video-understanding documentation](https://ai.google.dev/gemini-api/docs/video-understanding) describes model-specific sampling and temporal controls; those details affect what evidence is actually visible.

Evaluate modality boundaries explicitly. Compare a clean screenshot with a compressed screenshot, small text, rotated text, and a partially obscured control. Anthropic's [vision guide](https://platform.claude.com/docs/en/build-with-claude/vision) illustrates why image sizing and visual limitations belong in integration design.

Preserve source files and timestamps so claims can be traced to evidence. A model may infer plausible details outside a crop, miss a short event between sampled frames, or confuse reading text with following instructions embedded in the image. Treat visual content as task data; it does not acquire authority because it appears in a screenshot.
