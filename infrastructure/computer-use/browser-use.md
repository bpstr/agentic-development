# Browser use

Browser-use agents navigate web applications through visual interaction, DOM automation, accessibility information, or structured page tools. The term describes a capability; it does not imply a particular framework.

An execution environment owns browser contexts, tabs, authentication state, downloads, and navigation. The agent receives an observation and requests an operation against the current page. Semantic locators such as “button named Save” can survive layout changes that break coordinate clicks, although duplicate labels and hidden controls still require disambiguation. [Playwright locators](https://playwright.dev/docs/locators) illustrate this approach.

For a task update, open the correct workspace, locate the task by its identifier, change the status, and check the persisted result. A successful click only establishes that the interaction was delivered; it does not establish that the application saved the change. Track the active tab and origin when redirects or popups occur.

Use structured page or service capabilities when they expose the required operation reliably. Browser automation remains valuable for legacy sites and workflows spanning applications without suitable APIs. Keep sessions isolated by user or tenant, constrain unexpected navigation and file access, and distinguish a recoverable loading failure from an uncertain submitted operation before retrying.
