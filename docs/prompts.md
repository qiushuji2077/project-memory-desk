# Prompt Templates

Prompt templates are stored in `data/demo-prompts.json`. They all implement [记忆流规范 v1](memory-flow-spec.md): the closed 4 + 1 vocabulary (定 / 判断 / 原话 / 待确认 / 废弃), the unified line format `类型【来源】：内容`, and the "only record what can't be regenerated" rule.

## 手动输入项目记忆 (`manual`)

Used when a user has already made a clear judgment and wants to turn it into one memory-flow item. Output follows the unified prefix format; modification actions are not recorded, only the resulting decision (定) and the reason (判断).

## 从对话提取项目记忆 (`conversation`)

Used when a user pastes chat records or meeting dialogue. Key rule: never record "I changed X to Y" — the result already lives in delivered files. Distill changes into 定 (new decision) and 判断 (reason). This entry almost only produces 定 and 判断.

## 从录音转写提取项目记忆 (`audio`)

Used when a user pastes a meeting transcript. The first job is to rescue 原话 (verbatim) before it is lost to paraphrase, then capture 待确认, 定, and 判断.

## 从文件内容提取项目记忆 (`file`)

Used when a user pastes document content. Focuses on 定 / 原话 / 待确认 that are already formed and will be referenced or checked later; keeps only the newest, most formal, most complete version when content has duplicates.

## 从记忆流生成最终记忆 (`finalMemoryFromFlow`)

This template turns the **complete** memory flow into final memory. It is a **full rebuild every time**: final memory is a disposable cache, the memory flow is the only source of truth, and prior generated summaries are never trusted or reused.

Rules:

- Feed the complete memory flow each run; never trust a previous final memory.
- Keep only currently valid information; merge duplicates; detect conflicts.
- Prefer explicit counterpart/client confirmations, then formal files, then latest meetings.
- Mark internal judgments (我方判断) separately from confirmed items.
- 废弃 items are deprecated conclusions and never enter final memory.
- Read 【来源】 tags: `【对方确认】` → confirmed; `【我方·未审定】` → judgment; `【原话】` kept verbatim.

Expected output:

- 当前状态
- 已确定
- 待确认
- 我方判断
- 原话
- 下一步
- 冲突处理
- 最终记忆正文
