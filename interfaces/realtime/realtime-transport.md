# Realtime transport

A realtime transport carries input, output, and control events with enough timeliness for an interaction. The connection technology should match the traffic rather than dictate the agent architecture.

| Transport | Suitable traffic | Application work still required |
| --- | --- | --- |
| HTTP streaming or SSE | Server-to-client text and status events | Resume cursors, replay, authentication, and cancellation |
| WebSocket | Bidirectional events and server audio streams | Framing, flow control, reconnect, and session correlation |
| WebRTC | Interactive browser media and data channels | Signaling, permission handling, session setup, and media lifecycle |
| SIP | Telephony signaling and call integration | Media handling, call policy, and business execution |

[WebRTC](https://www.w3.org/TR/webrtc/) separates media tracks from data channels. A media connection and its control channel can report different progress; receiving a tool result does not prove that the user heard the spoken answer. [SSE](https://html.spec.whatwg.org/multipage/server-sent-events.html) defines an HTTP event stream and reconnection behavior, not durable storage of those events.

For a browser voice session, a typical setup is: authenticate to the application, obtain restricted connection credentials or a server-mediated handshake, request microphone access, connect media, then begin sending session events. Permanent provider keys remain on trusted infrastructure.

Define teardown explicitly. Stop microphone tracks, close playback and event channels, collect terminal usage when supported, and mark the session ended. Background jobs need their own cancellation decision.

Account for proxies, buffering, connection limits, and mobile network changes. An open socket is not a health guarantee, and automatic reconnect must not implicitly repeat side effects. Recover from a persisted session or run identifier and reconcile final state before retrying work.
