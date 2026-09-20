# Human in the loop

Human-in-the-loop systems pause automated execution at a decision point so a person can supply information, choose an alternative, approve an action, or correct proposed work. The human response becomes an input to the continuing workflow rather than a separate conversation with no execution effect.

Represent the pause as durable state: the pending question, relevant evidence, proposed operation, task identity, and the point from which execution should resume. A person should be able to answer later without keeping a browser tab or worker process alive. LangGraph's [interrupt mechanism](https://docs.langchain.com/oss/python/langgraph/interrupts) is one implementation using persisted execution state and explicit resumption.

For example, an agent preparing a support response can pause when two conflicting refund policies apply. A reviewer selects the applicable policy, and execution continues with that decision attached to the task. The application still validates the reviewer and the scope of the decision.

Choose pause points according to missing information and application policy. Existing explicit authorization can satisfy an approval requirement without another prompt. Keep work before a pause safe to replay, because resumption may restart a step. A decision interface alone does not prevent duplicated side effects or ensure that the resumed action still matches the reviewed proposal.
