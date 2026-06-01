# Contributing

感谢你关注 Project Memory Desk。这个项目优先保护用户本地资料，因此任何贡献都需要遵守匿名数据原则。

## 本地运行

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run build
```

## 提交 issue

请使用对应模板提交：

- Bug report
- Feature request
- Documentation improvement

请不要在 issue 中粘贴真实学校、真实客户、真实访谈、真实合同、真实附件路径或可识别截图。

## 提交 PR

PR 应包含：

- 变更目的
- 主要改动
- 本地验证结果
- 是否涉及数据结构变化
- 是否确认没有真实项目资料

## 代码风格

- 保持本地优先，不默认上传用户数据。
- demo 数据必须匿名，统一使用“示例学校 A”“示例项目 B”“示例课程方案”等虚拟名称。
- UI 文案应优先说明当前状态、最终记忆和过程流，而不是制造复杂自动化。
- 新增功能应尽量先用可导出、可迁移的数据结构表达。

## 匿名数据要求

不要提交：

- 真实客户名或学校名
- 真实访谈记录
- 真实 Word、PPT、PDF、录音、截图
- 本机绝对路径
- API key、token、cookie、账号信息

可以提交：

- 匿名 demo JSON
- 虚构项目状态
- 不可识别的 UI 截图
- 通用提示词模板
