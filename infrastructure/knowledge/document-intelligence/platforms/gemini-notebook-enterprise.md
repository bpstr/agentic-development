# Gemini Notebook Enterprise

Official documentation: [Gemini Notebook Enterprise overview](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/overview), [notebook management API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks), [source management API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks-sources), and [audio overview API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-audio-overview).

Gemini Notebook Enterprise is Google Cloud's enterprise version of the grounded research and writing product previously branded NotebookLM Enterprise. Google renamed NotebookLM Enterprise to Gemini Notebook Enterprise in July 2026; some API paths, IAM role names, and documentation URLs still retain NotebookLM terminology for compatibility.

A notebook groups user-provided sources and lets the product answer, summarize, and generate artifacts grounded in those sources. Supported source types documented by Google include Google Docs and Slides, raw text, web content, YouTube, and uploaded document, audio, image, and presentation/spreadsheet formats.

## API surface

The enterprise product has a preview REST API on the Discovery Engine service. The documented API currently includes operations to:

- create, retrieve, list, delete, and share notebooks;
- add, upload, retrieve, and delete notebook sources;
- create and delete notebook audio overviews.

For example, notebook resources use a form like:

```text
projects/{project}/locations/{location}/notebooks/{notebook}
```

and the preview API is exposed under `discoveryengine.googleapis.com/v1alpha`.

Do not assume the consumer Gemini Notebook / former NotebookLM product exposes the same programmable interface. The API documentation here is specifically for the licensed enterprise Google Cloud product.

This API is useful for provisioning grounded research workspaces, importing sources programmatically, managing sharing, and triggering supported generated artifacts. It should not be treated as a generic RAG API: RAG Engine and Agent Search are the more direct Google Cloud building blocks for application-owned retrieval pipelines.

Because the API is preview and the product recently changed names, verify endpoint versions, supported source types, IAM roles, quotas, and generated-artifact methods before building automation around it.
