# Agent spending limits

Spending limits constrain autonomous purchasing and paid tool use. Limits can apply per transaction, task, merchant, currency, time window, or shared workspace. The payment or orchestration layer must enforce them independently of model-generated decisions.

Suppose a task has a €10 budget and each report costs €3. Three purchases fit. Two parallel agents must not both observe €1 remaining and independently authorize another charge.

## Reserve before spending

Maintain a ledger of committed charges and outstanding reservations. Atomically check the limit and reserve an amount before starting a paid operation. Settle the reservation against the actual charge or release it after a confirmed failure.

Use a stable operation key so a retried request reuses its reservation. Do not release funds merely because the client timed out; the provider may already have charged them.

Represent money in the asset's documented units, and account for applicable fees and variable usage. A per-call maximum differs from a cumulative daily budget.

Some protocols express transaction-level bounds: x402's [payment schemes](https://docs.x402.org/schemes/overview) include bounded usage authorization. Application-wide limits still require shared accounting across calls.

Define whether refunds restore budget and how currency conversion is valued. Refresh budget state before every authorization; a budget written in a prompt cannot coordinate concurrent workers or prevent overspending.
