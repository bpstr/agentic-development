# OpenUI by Thesys

Official documentation: [OpenUI](https://openui.com/). Canonical repository and quick start: [thesysdev/openui](https://github.com/thesysdev/openui).

Thesys OpenUI is a framework for generating and progressively rendering interfaces from a component library. Its OpenUI Lang describes UI through a structured language, and its packages provide parsing, prompt generation, rendering, and chat integration.

This is distinct from [Weights & Biases OpenUI](https://github.com/wandb/openui), a separate UI generation and preview project. Include the project owner when identifying either implementation.

## Quick start

The canonical repository documents this scaffold:

```bash
npx @openuidev/cli@latest create --name release-interface
cd release-interface
npm run dev
```

Before starting generation, configure the scaffold's server-side provider credentials in its environment file. The default example uses `OPENAI_API_KEY`; keep it out of browser bundles and version control. Follow the generated application's configuration for provider or model changes.

The core lifecycle is: define allowed components and prop schemas, generate model instructions from that library, request an OpenUI Lang stream, and feed it to the renderer. The component catalog is the contract between the prompt and the UI.

For an existing React application, the documented packages include:

```bash
npm install @openuidev/react-lang @openuidev/react-ui
```

`@openuidev/react-lang` supplies the rendering integration; `@openuidev/react-ui` supplies prebuilt surfaces and component libraries. The repository also separates framework-independent parsing and prompt generation into `@openuidev/lang-core`.

Use a narrow application catalog first: document search results, a release summary, and a validated date proposal are easier to reason about than unrestricted layout generation. Register application action handlers separately and check domain permissions on the server. Partial streamed props should not enable a mutation.

Preserve catalog compatibility and a text fallback for saved responses. Generated UI quality still depends on component design, supplied data, and model behavior; the framework does not establish business correctness or authorize actions.
