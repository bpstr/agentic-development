# Arize Phoenix

[Official documentation](https://arize.com/docs/phoenix) · [Canonical repository](https://github.com/Arize-ai/phoenix)

Phoenix provides open-source tooling for inspecting and evaluating AI applications, including model, retrieval, and agent traces. Its OpenInference instrumentation ecosystem gives semantic structure to telemetry from supported frameworks and providers.

Begin with a local or hosted Phoenix instance, select the instrumentation appropriate to the application, and configure its export destination. Submit one known request and confirm its model and retrieval operations appear with the expected relationships. Keep the experiment's dataset revision and application version available when connecting traces to evaluation.

A useful investigation compares the documents retrieved for a question with the answer's citations. Poor retrieval and unsupported generation can look similar in the final message but require different fixes. Phoenix's trace inspection helps locate the failing stage; task-specific evaluation determines whether the outcome met requirements.

Separate the Python package, instrumentation packages, collector/export configuration, and backend deployment when diagnosing setup. Installing one package does not automatically instrument every service or provider boundary.

Control sensitive input capture and network exposure for development instances. Operational adoption also requires persistence, retention, authentication, and exporter failure handling. A trace viewer cannot recover payloads or intermediate decisions that were never captured, and model-based evaluations remain dependent on their rubric and judge configuration.
