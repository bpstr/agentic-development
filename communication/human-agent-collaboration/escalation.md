# Human escalation

Escalation transfers a task or decision from automated execution to a person when the agent reaches an operating boundary. The trigger may be missing authority, conflicting requirements, inadequate evidence, an exceptional business case, or a policy rule requiring human judgment.

A useful escalation carries the objective, evidence collected, actions already attempted, unresolved issue, and exact decision needed. “Something went wrong” forces the person to repeat the investigation. “Two customer records match the supplied email; choose the account before updating its contract” makes the blocked decision concrete.

Route the request to someone able to resolve it, with access to the relevant evidence. Persist the pending state, ownership, and resumption information so a closed chat or restarted worker does not lose the handoff. Independent work can continue when it does not depend on the unresolved decision.

Escalation does not always mean approval. A person may supply a missing identifier, correct an assumption, choose an alternative, or take ownership of the remaining task. Validate the response and recheck current resource state before resuming. If no answer arrives, follow the application's timeout or reassignment policy; elapsed time alone supplies neither information nor authorization.
