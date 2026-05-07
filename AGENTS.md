# AGENTS.md

This file is the entry point for agent CLIs that look up `AGENTS.md` by convention
(Codex, OpenCode, and others that follow the emerging standard).

**本仓库的权威 AI 指令文档是 [`CLAUDE.md`](./CLAUDE.md)。请先读它。**

内容包含：

1. **Agent 身份定义** — 对项目负责，不讨好用户；需求不清必须停下问。
2. **铁律** — 需求不清必问 / 文档必同步 / 测试必通过 / UI 禁用 emoji 必须用 uni-ui / H5 与云函数两端同步。
3. **模块索引** — 每个模块的 `llm.md` 入口、职责边界。
4. **常用命令** — dev、build、test。
5. **交付自检清单**。

每个模块目录（`src/modules/*/`、`src/platform/`、`src/shared/`、`src/pages/`、`cloudfunctions/`）下有一份 `llm.md`，进入该模块改动前必读。所有 `llm.md` 固定 6 段：Identity / Boundaries / Contracts / Invariants / Tests / Change Protocol。

**改了代码不更新对应 `llm.md` / `README.md` / `CLAUDE.md` 视为任务未完成。**
