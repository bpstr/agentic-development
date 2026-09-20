# Playwright

[Official library guide](https://playwright.dev/docs/library) · [Canonical repository](https://github.com/microsoft/playwright).

Playwright provides browser automation for navigation, DOM interaction, screenshots, files, and isolated browser contexts. An agent can use it as an execution layer while its model decides which task to perform.

Install the JavaScript library and its Chromium browser:

```sh
npm install --save-dev playwright
npx playwright install chromium
```

Save this as `form-check.mjs` and run `node form-check.mjs`. It opens an isolated browser page containing only in-memory HTML and verifies a field update:

```javascript
import { chromium } from "playwright";
import assert from "node:assert/strict";

const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent('<label>Task title <input type="text"></label>');
  const title = page.getByRole("textbox", { name: "Task title" });
  await title.fill("Review release");
  assert.equal(await title.inputValue(), "Review release");
} finally {
  await browser.close();
}
```

[Locators](https://playwright.dev/docs/locators) resolve elements against current page state and support roles, accessible names, labels, and scoped matching. Prefer an unambiguous semantic locator over a coordinate or an element's position in a list. Multiple matches should prompt better targeting.

Real applications also require authentication, explicit navigation handling, and verification of persisted changes. Browser isolation separates sessions but does not authorize business actions or neutralize instructions found on a page. Restrict the operations exposed to the agent and keep credentials outside generated code. A successful `fill` establishes a field value, not a saved server record.
