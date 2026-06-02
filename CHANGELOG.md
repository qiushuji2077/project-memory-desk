# Changelog

All notable changes to Project Memory Desk will be documented here.

## Unreleased

- Adopted Memory Flow Spec v1: closed 4 + 1 vocabulary (定 / 判断 / 原话 / 待确认 / 废弃) with the unified `类型【来源】：内容` line format.
- Rewrote all five prompt templates to implement the spec, including a full-rebuild "从记忆流生成最终记忆" prompt.
- Added `docs/memory-flow-spec.md` and refreshed `docs/prompts.md`.
- Added a memory-flow filter (全部 / 当前·待确认 / 已确认·原话 / 判断) and a Markdown snapshot export to the demo UI.
- Added a one-click copy for the final-memory prompt; manual capture now parses the unified prefix format.
- Migrated demo data to the v1 vocabulary and de-schooled wording into generic counterpart/client terms.

## 0.1.0 - 2026-06-01

- Added the initial Project Memory Desk demo.
- Added anonymous project, memory flow, and prompt template data.
- Added local-first README and documentation.
- Added community files, MIT License, GitHub issue templates, PR template, and build workflow.
- Moved legacy school-specific files and real materials into ignored local `private/` storage.
