# Model distillation

Distillation trains a student model to reproduce selected behavior of a teacher model or system. The student is often smaller or cheaper to serve. Classical distillation can train against the teacher's probability distribution; language-model pipelines also use generated answers, labels, or validated task traces as supervised targets. The original [knowledge distillation paper](https://arxiv.org/abs/1503.02531) explains the teacher-to-student approach.

A useful pipeline samples representative inputs, obtains teacher outputs, validates those outputs, trains the student, and evaluates it on separate cases. Keep the evidence available to the teacher aligned with what the student will receive. A teacher that consulted a database may produce answers the student cannot infer from the prompt alone.

For example, a strong model can classify historical support tickets into a fixed routing taxonomy. Human-reviewed labels become training data for a smaller classifier. Measure rare-category recall, ambiguous-ticket abstention, latency, and total serving cost before changing production routing.

Generated traces are observations of behavior, not proof that their explanations are correct. Executable tests or authoritative labels provide stronger validation than teacher confidence. Retain difficult failures instead of filtering the dataset down to easy examples.

Distillation transfers the behavior covered by its data. It does not guarantee the teacher's general reasoning ability, and a later change to the task taxonomy may require new data and training.
