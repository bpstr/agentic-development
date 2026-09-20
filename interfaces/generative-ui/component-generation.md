# Component generation

Component generation turns a user need and available data into a component selection, configuration, or source implementation. Clarify which output is expected: choosing a registered component with props is a different capability from writing a new component's code.

A catalog-driven system provides a finite set of component names, schemas, and intended uses. The model proposes a component, the application validates its props, and a trusted renderer displays it. An illustrative proposal is:

```json
{
  "component": "DeadlineProposal",
  "props": {
    "projectId": "prj_7",
    "proposedDate": "2026-09-25"
  },
  "action": "request_deadline_change"
}
```

This is an application schema, not OpenUI or A2UI syntax. The action handler loads the actual project and produces an authoritative change proposal. It does not accept the component's appearance as proof of permission.

Design each catalog entry around a useful interaction. A document picker needs stable identities, visible labels, selection limits, and empty states. A chart needs explicit units and source data. A component that accepts arbitrary HTML or JavaScript expands the execution boundary even if its outer object passes validation.

If the goal is new source code, use the normal development lifecycle: generate files, inspect dependencies, check accessibility, run appropriate verification, and review before integrating. A prototype rendered in an isolated environment does not inherit the application's authority.

Evaluate the generated interface against the user's task: can they find the relevant option, understand the data, and complete the intended action? Syntactic validity and a successful screenshot are useful checks, but neither proves the interaction works.
