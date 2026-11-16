# Tiny 2.1: a transformer for DOS

Official source: [WollyMonjac/Tiny-2.1](https://github.com/WollyMonjac/Tiny-2.1). Documentation: [usage and limits](https://github.com/WollyMonjac/Tiny-2.1/blob/1d5cf54677addf188a090ca1c91acb3d02989a1d/README.TXT), [inference source](https://github.com/WollyMonjac/Tiny-2.1/blob/1d5cf54677addf188a090ca1c91acb3d02989a1d/TINY.C), [build script](https://github.com/WollyMonjac/Tiny-2.1/blob/1d5cf54677addf188a090ca1c91acb3d02989a1d/BUILD.BAT).

Tiny 2.1 combines a small character-level question-answering transformer with a C inference program for DOS. It is useful as an educational example of local inference under a severe memory budget. Its compact model and runtime expose the relationship between weight storage, attention cache, numeric precision, and task scope; they do not establish suitability as a general agent backend.

The observations below refer to revision [`1d5cf54677ad`](https://github.com/WollyMonjac/Tiny-2.1/tree/1d5cf54677addf188a090ca1c91acb3d02989a1d), inspected on 2026-11-16. Hardware requirements and accuracy figures are upstream reports; execution was not reproduced for this guide.

## Model and runtime

The [project README](https://github.com/WollyMonjac/Tiny-2.1/blob/1d5cf54677addf188a090ca1c91acb3d02989a1d/README.md) describes about 367,000 parameters, four transformer layers, and a width of 96. The [implementation](https://github.com/WollyMonjac/Tiny-2.1/blob/1d5cf54677addf188a090ca1c91acb3d02989a1d/TINY.C) uses a 97-symbol vocabulary and a 128-position context shared by question and answer. Positions represent characters, so this is not a 128-word or subword-token context.

| Component | Implementation and consequence |
| --- | --- |
| Weights | Signed 8-bit values with one 32-bit floating-point scale per row reduce storage, while gains remain floating point. |
| Attention cache | Keys and values are stored as signed bytes with a scale for each layer and position. The program allocates the full configured cache. |
| Arithmetic | Matrix products accumulate into floating-point values. Quantized storage does not make this an integer-only inference engine. |
| Execution surface | DOS chat and plain-text standard input/output; the inspected program does not provide tool calling, an HTTP service, or an agent loop. |

The [pinned repository tree](https://api.github.com/repos/WollyMonjac/Tiny-2.1/git/trees/1d5cf54677addf188a090ca1c91acb3d02989a1d?recursive=1) lists `TINY.BIN` at 381,808 bytes and `TINY.EXE` at 53,604 bytes: 435,412 bytes for the two runnable files. This is a disk footprint, not a RAM measurement. The usage guide separately reports a requirement of about 540 KB of free DOS conventional memory.

For the documented four-layer, 96-wide model, the cache allocation can be derived directly from `alloc_memory`:

```text
key/value bytes = 2 × 4 layers × 128 positions × 96 values = 98,304
scale bytes     = 2 × 4 layers × 128 positions × 4 bytes   =  4,096
cache total     =                                         102,400 bytes
```

This is 100 KiB for cache values and scales alone, before weights, work buffers, code, allocation overhead, and the interface. It illustrates why [local model feasibility](../../models/open-source/local-models.md) needs a complete runtime budget and why [quantization](../../model-adaptation/quantization.md) should distinguish weights from cache precision.

## Run the supplied DOS application

The documented route uses plain DOS with `TINY.EXE` and `TINY.BIN` together in a directory such as `C:\TINY`. In that environment:

```bat
CD \TINY
MEM
TINY 0 /QUIET /P
```

`MEM` helps check available conventional memory. Creativity level `0` selects the highest-scoring next character; `/QUIET` disables sound and `/P` selects plain text. To capture answers from a prepared question file:

```bat
TINY 0 /P < QUESTIONS.TXT > ANSWERS.TXT
```

The output includes prompts, startup messages, and timing text rather than a structured response format. These are DOS commands, not a native installation procedure for current Windows, macOS, or Linux.

To rebuild using the documented Turbo C 2.0 toolchain, run `BUILD.BAT` after adjusting its compiler path, or use `TCC -ml TINY.C` with include/library directories configured. The large memory model is required. [README.TXT](https://github.com/WollyMonjac/Tiny-2.1/blob/1d5cf54677addf188a090ca1c91acb3d02989a1d/README.TXT) reports seconds per answer on machines with a math coprocessor and much slower software emulation; neither timing was measured here.

## Evaluation and reuse boundaries

- **Narrow task scope.** Upstream describes training around 3,500 facts and warns about confidently invented answers. Familiar questions, paraphrases, unseen combinations, and out-of-domain inputs need separate evaluation.
- **Unreproduced accuracy.** The usage guide reports about 61% on 780 unseen test questions and about 90% on familiar wordings. The inspected tree does not contain the evaluation set or runner, so these are author-reported figures, not an independently verified benchmark.
- **Missing training assets.** The guide references a TRAINKIT ZIP, but it is absent from the inspected tree. [Issue #1](https://github.com/WollyMonjac/Tiny-2.1/issues/1) requests that kit. Source and weights alone do not reproduce training.
- **Unspecified license.** The inspected repository has no license file or license declaration in its documentation. Describe the code and weights as publicly available with unspecified terms rather than assuming a permissive open-source license.
- **Display confidence is not factual confidence.** The neural monitor shows the selected next character's softmax probability before the creativity setting's temperature and candidate filtering. That does not estimate whether the answer is true, especially outside the model's training scope.

For a reproducible experiment, pin the revision, record file checksums, DOS/compiler or emulator configuration, memory availability, and generation settings. Evaluate answer correctness separately from footprint and latency. The transferable lesson is to budget each runtime component and measure the exact task a small model can perform reliably.
