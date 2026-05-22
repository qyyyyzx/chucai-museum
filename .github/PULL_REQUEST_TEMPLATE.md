## 改动说明

### 改动类型（必选其一）
- [ ] 新增功能（feat）
- [ ] Bug修复（fix）
- [ ] 紧急修复（hotfix）
- [ ] 重构（refactor）
- [ ] 文档更新（docs）
- [ ] 测试补充（test）
- [ ] 杂项（chore）

### 改动内容（必填）
<!-- 请描述本次 PR 改了哪些代码/模块，以及改动的原因 -->

### 关联Issue（强烈推荐）
<!-- 强烈建议关联至少一个Issue，使用 Closes #编号 自动关闭，或 Relates #编号 仅关联 -->
<!-- 如果确实没有关联Issue，请说明原因 -->
- Closes #
<!-- 或者 -->
- Relates to #
<!-- 或者 -->
- 无关联Issue（原因：）

---

## 文档同步（必检）

- [ ] 新增/修改 `src/` 下的 `.js` 文件，已同步更新对应模块的 `llm.md` 文档
- [ ] 若改动涉及 `CLAUDE.md` 或 `README.md`，已同步更新
- [ ] 若改动涉及目录结构，已更新 `CLAUDE.md` 中的模块索引

---

## 测试验证（必检）

- [ ] 本地 `npm test` 全部通过
- [ ] 若涉及 UI，已手动测试主要路径（H5模式下验证）
- [ ] 若涉及构建，已运行 `npm run build:h5` 无报错
- [ ] 若涉及微信小程序，已运行 `npm run build:mp-weixin` 无报错

### 测试截图（UI变更必填）
<!-- 如果涉及UI变更，请附上截图或录屏，否则Reviewer无法验证 -->

---

## 影响范围（必填）

### 涉及模块（必选）
<!-- 列出本次改动涉及的模块 -->
- [ ] exhibit（数字展陈）
- [ ] ar（AR预览）
- [ ] lbs（LBS推荐）
- [ ] social（社交打卡）
- [ ] user（用户）
- [ ] platform（平台适配层）
- [ ] shared（通用组件）
- [ ] pages（页面路由）
- [ ] 其他：

### 可能影响的其他模块
<!-- 描述可能影响的其他模块，以及影响方式 -->

---

## Breaking Changes

**请仔细检查本次改动是否有Breaking Changes：**
- Breaking Changes是指：API接口变更、数据结构变更、行为变更等会影响现有代码的改动

- [ ] 我已确认本次改动**无**Breaking Changes
- [ ] 本次改动**有**Breaking Changes（请在下方详细说明）

### Breaking Changes详细说明（如有Breaking Changes必填）
<!-- 说明哪些API/行为发生了变化，以及如何迁移 -->

---

## 自检清单（必检）

- [ ] 代码符合项目规范（无emoji、无原生input/textarea）
- [ ] commit message符合 `[type][author] 内容` 格式
- [ ] 不在 `main` 分支上直接开发
- [ ] 已从最新的 `main` 拉取分支
- [ ] 已解决所有合并冲突
- [ ] 已检查文档同步（llm.md等）
- [ ] 已运行测试并通过

---

## 其他说明
<!-- 任何需要说明的内容 -->