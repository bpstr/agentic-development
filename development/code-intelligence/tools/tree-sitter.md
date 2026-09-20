# Tree-sitter

Official documentation: [Tree-sitter](https://tree-sitter.github.io/tree-sitter/), [query syntax](https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html). Python bindings: [tree-sitter/py-tree-sitter](https://github.com/tree-sitter/py-tree-sitter).

Tree-sitter is an incremental parsing system that produces syntax trees for source code. Agent tools use it to locate declarations, imports, calls, and other structural elements without asking a language model to infer syntax from raw text.

## Parse and inspect Python

Install the parser binding and a language grammar into the project's Python environment:

```bash
python -m pip install tree-sitter tree-sitter-python
```

A minimal example based on the current Python binding is:

```python
import tree_sitter_python
from tree_sitter import Language, Parser

language = Language(tree_sitter_python.language())
parser = Parser(language)
source = b"def total(items):\n    return sum(items)\n"
tree = parser.parse(source)
function = tree.root_node.named_children[0]
name = function.child_by_field_name("name")
print(source[name.start_byte:name.end_byte].decode())
```

This prints `total`. Grammar-specific queries can then select all declarations of interest. Store source locations alongside extracted names so callers can inspect the evidence.

## Syntax is one analysis layer

Tree-sitter identifies syntactic structure; it is not a complete type checker or runtime dependency resolver. Seeing a call expression does not necessarily identify the function invoked through dynamic dispatch, imports, or framework registration.

Pin compatible binding and grammar versions, preserve source encoding assumptions, and test malformed or incomplete code. Incremental parsing helps with changing files, but the application still owns index updates, deletions, and cross-file relationships.
