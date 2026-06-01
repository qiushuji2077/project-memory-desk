# Prompt Templates

Prompt templates are stored in `data/demo-prompts.json`.

## 手动输入项目记忆

Used when a user has already made a clear judgment and wants to turn it into one memory-flow item.

## 从对话提取项目记忆

Used when a user pastes chat records or meeting dialogue into a model and asks it to extract project memory.

## 从录音转写提取项目记忆

Used when a user pastes a meeting transcript and needs meeting conclusions, next steps, and confirmed decisions.

## 从文件内容提取项目记忆

Used when a user pastes document content and wants project changes, formal confirmations, conflicts, or follow-up items.

## 从记忆流生成最终记忆

This template turns memory-flow entries into final memory. It must:

- Keep only currently valid information.
- Merge duplicates.
- Detect conflicts.
- Prefer explicit customer or school confirmations.
- Prefer formal files.
- Prefer latest meetings or feedback.
- Mark internal judgments separately.
- Use old discussions and drafts only as reference.

Expected output:

- 当前状态
- 已确定
- 待确认
- 我方判断
- 下一步
- 冲突处理
- 最终记忆正文
