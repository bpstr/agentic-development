# Fine-tuning

Fine-tuning continues training a pretrained model on examples from a target task or domain. Supervised fine-tuning adjusts parameters to make desired outputs more likely for their corresponding inputs. It can improve classification, extraction, formatting, and recurring response conventions when the training examples represent the workload.

A practical pipeline cleans examples, separates training and evaluation sets, applies the model's tokenizer and conversation format, trains, and compares saved checkpoints. Full fine-tuning updates the selected model weights; parameter-efficient approaches such as adapters update a smaller parameter set. The [Transformers training guide](https://huggingface.co/docs/transformers/training) describes the tokenization, batching, optimization, and checkpointing steps.

For a ticket classifier, each example pairs the ticket text with an approved queue label. Split tickets by customer or time when near-duplicates would otherwise leak across sets. Include difficult negative cases and uncommon queues, then measure per-queue errors alongside overall accuracy.

Compare against a strong prompted baseline using the same available evidence. Keep the base model, dataset revision, optimizer settings, and checkpoint identifier in the release record so a regression can be reproduced.

Fine-tuning does not provide a dependable live database of facts. Frequently changing ownership, prices, or policies still need retrieval or application state. Excessive training on narrow or inconsistent examples can cause overfitting and weaken general capabilities.
