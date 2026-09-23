# Muse desktop and the personal-agent interface

Official sources: [Muse](https://ai.meta.com/muse/), [Help Centre](https://www.meta.com/help/artificial-intelligence/1303670544995562/), [Mac files and applications](https://www.meta.com/help/artificial-intelligence/1126304576638594/), and [Meta's security architecture](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse).

Muse is Meta's personal-agent product. Its desktop application is a user interface and a permissioned bridge to local resources, not evidence that the model runs on the user's computer. This guide concerns Muse's documented Mac integration, not a claim that every mobile or web capability is available on every desktop platform or in every region.

## Local client versus cloud agent

Meta's [September 8, 2026 introduction](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) describes a personal agent with a dedicated virtual machine and browser. The [security design](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) places sensitive authorization and credential handling outside the agent's execution environment, with a separate Sentinel service mediating connector requests and network access.

This separation is useful containment, but it is not a blanket promise that authorized data stays on a Mac or never reaches inference. A local application bridge extends what the agent can access. Evaluate the VM, connector credentials, local OS grants, and user approval surface as separate boundaries.

## A restrained first setup

Install through the official Muse product flow and verify account and regional availability in the [Help Centre](https://www.meta.com/help/artificial-intelligence/1303670544995562/). Start with one synthetic document or a test application rather than a personal home directory.

The [Mac guide](https://www.meta.com/help/artificial-intelligence/1126304576638594/) distinguishes macOS permissions such as Full Disk Access and Automation from Muse's per-application settings: **Off**, **Read only**, and **Read and interact**. Full Disk Access is broad OS authority; a narrower product setting should not be mistaken for an OS-enforced folder sandbox.

Choose the smallest usable access level. Ask Muse to summarize a test file before permitting edits. Inspect the resulting activity, then verify that disabling access works. Revoke permissions both in Muse settings and macOS Privacy & Security when appropriate. Treat operations such as sending a message or purchasing as explicit approval boundaries, not a consequence of granting read access.

## Special features and practical strengths

**Artifacts rather than answers alone.** Muse can work with documents, spreadsheets, images, source files, and browser-viewable tools. Its [artifact guide](https://www.meta.com/help/artificial-intelligence/2074655449783957/) describes reading, generating, revising, storing, and sharing outputs. A useful workflow is to inspect a source, produce a separate draft, review it, and authorize any external sharing independently.

**Personal continuity.** Ongoing conversations, reminders, scheduled work, and connected services can reduce repeated setup for recurring tasks. The [Help Centre](https://www.meta.com/help/artificial-intelligence/1303670544995562/) covers these surfaces. Before relying on unattended work, verify the trigger, cancellation path, target account, and delivery behavior with a harmless test.

**Built-in skills.** The [skills documentation](https://www.meta.com/help/artificial-intelligence/2797651547267109/) describes Meta-developed capabilities selected by the agent for tasks such as research, documents, images, and podcasts. They are not the same distribution surface as user-authored Muse Code `SKILL.md` packages.

The architectural strength is coordinated work across files, applications, and durable outputs. That convenience is valuable only when the user can understand and constrain what the agent may read, change, or share. Generated artifacts still need factual and functional review.

## Developer integration and publishing boundaries

Do not equate creating a web artifact with publishing an installable integration into a public agent marketplace. The cited personal-agent skill guide documents built-in Meta skills; it does not establish a third-party app-submission or plugin-marketplace contract.

For an application embedding model inference, use the [Meta Model API](../../../infrastructure/inference/apis/meta-model-api.md). For repository automation and a programmable coding harness, use [Muse Code](../../../development/coding-agents/tools/muse-code.md). A personal-agent connector, a reusable coding skill, and a model API integration are different products with different authorization paths.

## Privacy and verification

Muse's consumer data controls, documented in the [artifact guide](https://www.meta.com/help/artificial-intelligence/2074655449783957/), are separate from the API's Standard and Contributor model selection. Check what the chosen control covers rather than inferring API policy from the desktop toggle.

For a safe evaluation, use synthetic files and accounts; test read-only versus write access, an approval denial, permission revocation, an interrupted operation, and the provenance of a generated artifact. Verify the resulting application state instead of trusting a success message. This is a proposed evaluation procedure, not a claim that these failure cases have been tested here.
