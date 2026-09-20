# Schema.org Actions

Official vocabulary: [Action](https://schema.org/Action). Authoring reference: [Schema.org Actions](https://schema.org/docs/actions.html).

Schema.org Actions describe potential or completed operations using structured web data. An action can identify its participants, object, target, status, inputs, and results. This vocabulary provides semantics that applications can interpret alongside other Schema.org entities.

## Describe an available search

A site can publish illustrative JSON-LD such as:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://shop.example/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://shop.example/search?q={query}",
    "query-input": "required name=query"
  }
}
```

The object says the website exposes a search action with a required query value. It describes the target and input relation; it does not execute a search merely because the markup is present.

Other action types can describe buying, reserving, or interacting with an object. Use a domain-specific action when its defined semantics match the operation, and keep the advertised target aligned with the actual service.

## Semantics and execution

Schema.org Actions predate LLM agents and remain useful where interoperable structured web vocabulary is appropriate. They do not, by themselves, establish an agent runtime, authorization flow, payment delegation contract, or reliable checkout lifecycle.

An agent consuming this data still needs a supported execution mechanism and authority for the proposed operation. The presence of a `BuyAction` is not evidence that a user approved a purchase.

Validate the JSON-LD and inspect the action target. Do not infer universal browser, search-engine, or agent support from vocabulary validity; consumer implementations determine whether and how they use the data.
