# Agent-addressable actions

An agent-addressable action is an operation exposed with enough structure for an agent to understand when and how it can be invoked. A useful action defines its purpose, inputs, output, side effects, errors, and authorization boundary.

For example, `set_task_status(task_id, status, expected_version)` describes a business operation more precisely than “click the third button.” Its contract can require an existing task, restrict status to an enumeration, reject a stale version, and return the resulting status and revision. The caller can inspect the result to decide whether the requested change happened.

Discovery and execution are separate steps. A description tells an agent that an action exists; an authenticated executor decides whether this caller may perform it on this resource. An action marked read-only should actually avoid changes, while a modifying action should explain retry behavior and any irreversible effects.

MCP tools, WebMCP tools, HTTP APIs, and structured action vocabularies expose different parts of this contract. A schema describing a possible action does not necessarily provide a callable endpoint. Whatever transport is used, validate arguments at execution time, bind authorization to the resolved resource, and return an operation receipt. These checks remain necessary when a model produces perfectly valid JSON.
