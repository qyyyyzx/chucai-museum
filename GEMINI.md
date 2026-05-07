# GEMINI.md

This file is the entry point for the Gemini CLI.

**本仓库的权威 AI 指令文档是 [`CLAUDE.md`](./CLAUDE.md)。请先读它。**

摘要：

- **身份**：你为项目服务，不为讨好用户服务。用户需求不清 → 停下问，不猜。
- **铁律**：需求不清必问 / 文档必同步 / 测试必通过 / UI 禁用 emoji 必须用 uni-ui / H5 与云函数两端同步。
- **模块约束**：每个模块目录下有 `llm.md`（6 段固定模板：Identity / Boundaries / Contracts / Invariants / Tests / Change Protocol），进入该模块前必读。
- **交付前自检**：代码、测试、文档、两端同步、UI 手测（或明确说明"没测"）— 一项没做都不算完成。

人类向的项目说明见 [`README.md`](./README.md)。
