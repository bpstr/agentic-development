# Agent notifications

Agent notifications surface meaningful state changes without requiring an interactive conversation to remain open. They are useful for completed background work, actionable failures, pending decisions, deadlines, and monitored conditions. A notification points to an event or task; it is not the authoritative record of that work.

Generate notifications from durable application events, using a stable event identifier and recipient scope. This lets retries avoid duplicate deliveries while preserving distinct updates. For example, a failed export and its later successful retry are different events, even though both concern the same export task.

Select the delivery channel according to urgency and user preferences. A routine completion can appear in an inbox, while a time-sensitive decision may justify a push notification. Group repetitive low-value updates, and let users inspect the underlying object for current status, evidence, and available actions. Recheck access when opening the link, because membership can change after delivery.

Keep notification payloads brief and suitable for the channel. Lock-screen previews may expose content beyond the application's authenticated view. Track delivery separately from reading or acting: a provider accepting a push does not establish that the user saw it. Dismissal should clear the notification without silently deleting the underlying task or decision.
