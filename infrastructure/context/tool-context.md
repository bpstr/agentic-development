# Tool context

Tool context is the information made available to a model about callable capabilities. It includes tool names, descriptions, argument schemas, constraints, and sometimes dynamically loaded subsets of a larger catalog.

Large tool catalogs consume context and can reduce selection accuracy. Tool discovery and deferred loading allow the runtime to expose only capabilities relevant to the current task.
