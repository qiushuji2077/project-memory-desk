# Data Model

The current data model is JSON-first and easy to migrate.

## project

```json
{
  "id": "demo-school-a",
  "name": "示例学校 A",
  "status": "等待反馈",
  "tags": ["教育咨询", "课程方案"],
  "lastUpdated": "2026-05-28",
  "summary": "匿名教育项目",
  "stateBlocks": {
    "current": "等待反馈",
    "decided": "主题、目标与结构方向",
    "pending": "实施路径与评价机制",
    "nextStep": "依据反馈修订最终记忆"
  },
  "finalMemory": "项目当前处于等待反馈阶段。",
  "memoryFlowIds": ["mf-001"]
}
```

## finalMemory

`finalMemory` is the current usable version of the project context. It should only include information that is still valid, confirmed, or clearly marked as a current working judgment.

## memoryFlow

```json
{
  "id": "mf-001",
  "projectId": "demo-school-a",
  "date": "2026-05-28",
  "type": "定",
  "content": "阶段成果已交付，项目进入等待反馈阶段。",
  "status": "当前采用",
  "source": "对方确认",
  "relatedFiles": ["PPT", "DOCX"],
  "createdAt": "2026-05-28T09:30:00+08:00",
  "updatedAt": "2026-05-28T09:30:00+08:00"
}
```

`type` uses the closed [记忆流规范 v1](memory-flow-spec.md) vocabulary; `source` is the `【来源】` annotation:

- `定`: 已拍板、贯穿全篇的口径（已确认流）
- `判断`: 影响后续取舍的专业判断（判断流）
- `原话`: 不可改写的原始表述（已确认流）
- `待确认`: 尚未拍板、会卡住后续的问题（当前流）
- `废弃`: 被推翻的旧结论，仅在"全部"可见，不进入最终记忆

Supported memory statuses:

- `当前采用`: 已进入最终记忆或当前工作版本
- `历史记录`: 保留为过程依据
- `已替代`: 被后续信息覆盖，仅作历史追溯

## promptTemplate

```json
{
  "title": "从对话提取项目记忆",
  "description": "用于把聊天或会议对话粘贴给模型。",
  "prompt": "提示词正文"
}
```

Current prompt keys:

- `manual`
- `conversation`
- `audio`
- `file`
- `finalMemoryFromFlow`

## relatedFile

The initial demo stores related files as simple chips such as `PPT`, `DOCX`, `PDF`, `MD`, and `XLSX`. Future versions can replace this with objects containing `id`, `name`, `path`, `type`, `hash`, `createdAt`, and `updatedAt`.
