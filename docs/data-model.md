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
  "type": "当前",
  "content": "阶段成果已交付。",
  "status": "当前采用",
  "source": "阶段复盘",
  "relatedFiles": ["PPT", "DOCX"],
  "createdAt": "2026-05-28T09:30:00+08:00",
  "updatedAt": "2026-05-28T09:30:00+08:00"
}
```

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
