#!/usr/bin/env python3
"""Offline checks for this handbook's Markdown conventions; no dependencies."""

from __future__ import annotations

import argparse
import html
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})([^\n]*)$")
HEADING = re.compile(r"^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$")
# Handbook convention: inline links; targets have no unescaped parentheses/spaces.
LINK = re.compile(r"!?\[[^\]\n]*\]\(([^\s)]+)(?:\s+\"[^\"]*\")?\)")


def prose_and_fences(path: Path, errors: list[str], root: Path):
    lines = path.read_text(encoding="utf-8").splitlines()
    prose: list[tuple[int, str]] = []
    fence = None
    body: list[str] = []
    json_count = 0
    for number, line in enumerate(lines, 1):
        match = FENCE.match(line)
        if fence:
            marker, language, start = fence
            if (match and match[1][0] == marker[0]
                    and len(match[1]) >= len(marker) and not match[2].strip()):
                if language == "json":
                    json_count += 1
                    try:
                        json.loads("\n".join(body))
                    except json.JSONDecodeError as exc:
                        errors.append(f"{path.relative_to(root)}:{start}: invalid JSON: {exc}")
                fence = None
                body = []
            else:
                body.append(line)
        elif match:
            fence = (match[1], match[2].strip().lower(), number)
        else:
            prose.append((number, line))
    if fence:
        errors.append(f"{path.relative_to(root)}:{fence[2]}: unclosed code fence")
    return prose, json_count


def anchors(prose):
    found: set[str] = set()
    for _, line in prose:
        match = HEADING.match(line)
        if not match:
            continue
        title = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", match[2])
        title = re.sub(r"<[^>]*>", "", title)
        slug = re.sub(r"[^\w\- ]", "", html.unescape(title).lower()).replace(" ", "-")
        unique, index = slug, 0
        while unique in found:
            index += 1
            unique = f"{slug}-{index}"
        found.add(unique)
    return found


def check(root: Path) -> int:
    root = root.resolve()
    files = sorted(p for p in root.rglob("*.md")
                   if not any(part in {".git", "node_modules", ".venv"}
                              for part in p.relative_to(root).parts))
    errors: list[str] = []
    pages = {}
    json_count = 0
    for path in files:
        prose, count = prose_and_fences(path, errors, root)
        pages[path] = prose
        json_count += count
        titles = [line for _, line in prose if line.startswith("# ")]
        if len(titles) != 1:
            errors.append(f"{path.relative_to(root)}: expected one H1, found {len(titles)}")
        if not path.read_bytes().endswith(b"\n"):
            errors.append(f"{path.relative_to(root)}: missing final newline")

    page_anchors = {path: anchors(prose) for path, prose in pages.items()}
    graph = {path: set() for path in pages}
    external: set[str] = set()
    local_count = 0
    for path, prose in pages.items():
        for number, line in prose:
            for match in LINK.finditer(line):
                target = match[1].strip("<>")
                url = urlsplit(target)
                if url.scheme in {"http", "https", "mailto"}:
                    external.add(target)
                    continue
                if url.scheme or url.netloc:
                    errors.append(f"{path.relative_to(root)}:{number}: unsupported link {target}")
                    continue
                local_count += 1
                dest = (path.parent / unquote(url.path)).resolve() if url.path else path
                if not dest.is_relative_to(root):
                    errors.append(f"{path.relative_to(root)}:{number}: link leaves repo: {target}")
                    continue
                if dest.is_dir():
                    dest = dest / "README.md"
                if not dest.is_file():
                    errors.append(f"{path.relative_to(root)}:{number}: missing target: {target}")
                    continue
                if dest in pages:
                    graph[path].add(dest)
                    if url.fragment and unquote(url.fragment) not in page_anchors[dest]:
                        errors.append(f"{path.relative_to(root)}:{number}: missing heading: {target}")

    for chapter in sorted((root / "docs").glob("[0-9][0-9]-*")):
        if not chapter.is_dir():
            continue
        index = chapter / "README.md"
        if index not in pages:
            errors.append(f"{chapter.relative_to(root)}: missing chapter README.md")
            continue
        for topic in chapter.glob("*.md"):
            if topic != index and topic not in graph[index]:
                errors.append(f"{topic.relative_to(root)}: not linked from chapter index")

    entry = root / "README.md"
    seen: set[Path] = set()
    todo = [entry]
    while todo:
        page = todo.pop()
        if page in seen:
            continue
        seen.add(page)
        todo.extend(graph.get(page, ()))
    for path in pages:
        if "docs" in path.relative_to(root).parts and path not in seen:
            errors.append(f"{path.relative_to(root)}: unreachable from root README.md")

    if errors:
        for error in errors:
            print(f"ERROR {error}", file=sys.stderr)
        print(f"Failed: {len(errors)} documentation issue(s).", file=sys.stderr)
        return 1
    print(f"Passed: {len(files)} Markdown files, {local_count} local links, "
          f"{json_count} JSON blocks; {len(external)} unique external links inventoried.")
    print("External availability and factual accuracy require separate source review.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    return check(parser.parse_args().root)


if __name__ == "__main__":
    raise SystemExit(main())
