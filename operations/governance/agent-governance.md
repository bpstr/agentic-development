# Agent governance

Agent governance defines organizational rules for configuring, deploying, operating, and reviewing agent systems. It assigns accountability for model choices, data handling, tool access, delegated authority, monitoring, and incident response across the system's lifecycle.

Governance complements technical security. Security mechanisms enforce boundaries; governance determines which boundaries the organization needs and who can change them. A policy might permit a development agent to edit isolated worktrees while limiting production deployment to designated identities and approved release conditions. The implementation then makes those rules enforceable.

Keep policies connected to an owner, a version, and observable evidence. Record which configuration applied to a run, how exceptions were granted, and who is responsible for reviewing outcomes. Changes in available tools or external integrations can alter the system's capabilities even when the model and prompt remain unchanged.

The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) offers broader guidance for organizational AI risk responsibilities. Applying a framework still requires concrete choices for the actual application and its users.

Avoid policies that exist only in a document the runtime cannot interpret. Convert relevant rules into configuration, authorization checks, retention controls, and review procedures. Evaluate whether those controls work on real workflows and revise them when evidence exposes gaps or unnecessary friction.
