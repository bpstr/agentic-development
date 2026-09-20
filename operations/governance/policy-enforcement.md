# Policy enforcement

Policy enforcement converts organizational rules into checks around agent execution. It can constrain tools, resources, models, data locations, spending, side effects, and actions requiring human authorization. Instructions help the model understand these rules; enforcement determines whether an operation can actually proceed.

Evaluate a proposed action using the authenticated principal, resource, arguments, relevant application state, and applicable policy version. Place the check near the execution boundary so the model cannot bypass it by choosing a different phrasing or tool path. [Open Policy Agent](https://www.openpolicyagent.org/docs) is one implementation for separating policy decisions from application logic.

For example, a publication service can verify that the acting identity may publish the specified document revision to the requested destination. Existing authorization should satisfy the relevant rule when its scope and conditions remain valid. If the revision or audience changes, reevaluate the operation instead of assuming the earlier decision covers every variant.

Check for state changes between authorization and execution, and use transactional constraints or version checks where necessary. Record the decision and outcome for later diagnosis. Define behavior when the policy service is unavailable; model confidence cannot substitute for a missing authorization result. Enforcement also needs coverage across retries, background workers, and alternate integration paths, not just the visible chat route.
