# Agent payments

Agent payments are payment operations initiated or coordinated by software under delegated authority. Separate the decision to obtain something, authorization to spend, execution of payment, settlement, and delivery of the purchased resource.

The category includes several different relationships:

- **consumer delegation** — an agent pays a merchant for a user's purchase;
- **business delegation** — an agent spends from an organization-controlled budget;
- **machine-to-machine payment** — software pays another service for an API, dataset, compute job, or other resource;
- **metered payment** — many small operations are charged per request or unit of usage.

These cases can share payment infrastructure while requiring different identity, approval, budget, reconciliation, and refund rules.

For example, an agent might purchase access to a report for an approved project. Its request should identify the merchant, report, amount, currency or asset, and applicable spending grant. A trusted payment component validates those details before using a payment instrument.

## Keep authorization outside generated text

Give the agent a bounded payment capability rather than unrestricted reusable credentials. Bind authorization to the intended purchase and record a stable operation identity.

[AP2](https://ap2-protocol.org/) represents checkout and payment authorization through mandates. [x402](https://docs.x402.org/introduction) addresses payment interactions for resources through HTTP. [UCP](../commerce/protocols/universal-commerce-protocol.md) can advertise commerce capabilities and interoperates with payment mechanisms without turning discovery into spending authority. These protocols address different parts of an agent's purchasing workflow; none makes every requested purchase appropriate.

Persist the payment outcome separately from the generated explanation. A signed authorization does not necessarily mean funds have settled, and settlement does not prove that the promised resource was delivered.

On timeout, reconcile the existing operation before issuing another payment. Handle rejected authorization, failed settlement, unavailable resources, and refunds as distinct states.

The orchestration layer still needs merchant policy, budget enforcement, credential custody, and an audit trail connecting the payer, agent, purchase, and resulting artifact.
