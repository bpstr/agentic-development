# Agent messaging

Agent messaging lets agents communicate with people or systems through channels such as email, chat, SMS, and collaboration platforms. A messaging integration connects generated content with a concrete destination and a provider's delivery interface.

Separate composition from delivery authorization. The agent can prepare a message while the application resolves recipient identity, channel, account credentials, and the policy governing transmission. An explicit request to send a defined message may already authorize delivery; a draft request does not imply the same scope. Use stable recipient identifiers rather than assuming a display name uniquely identifies a person.

For example, a project agent can compose a release update for a selected team channel, attach references to completed work, and send it through the authenticated integration. The provider's receipt establishes that it accepted the operation; it does not necessarily prove that every intended person read the message. Slack's [message API](https://docs.slack.dev/reference/methods/chat.postMessage/) illustrates a channel-addressed delivery contract.

Preserve a message operation identifier and track uncertain outcomes before retrying, so a timeout does not produce duplicate announcements. Handle rate limits and unavailable destinations explicitly. Keep drafts, accepted deliveries, failures, and any read acknowledgments distinguishable in application state, and include only information the destination is authorized to receive.
