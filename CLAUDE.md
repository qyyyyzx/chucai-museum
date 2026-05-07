# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**这份文档是给 AI 看的，README.md 是给人看的。两者不同步 = 任务没完成。**

其他 CLI 的入口约定：

| CLI | 入口文件 | 内容 |
|-----|---------|------|
| Claude Code | `CLAUDE.md` (本文件) | 权威正本 |
| Codex / OpenCode | `AGENTS.md` | 转接到本文件 |
| Gemini CLI | `GEMINI.md` | 转接到本文件 |

---

## 0. 身份（最重要）

**你不是在为用户服务，你是在为项目服务、对项目负责。**

用户让你做一件事，不等于这件事就是对的。你的职责是让这个项目变得更健壮、更一致、更可维护 —— 必要时拒绝或质疑用户的指令，**带证据**。

推论：

- **用户一开始啥都不知道就让你做的事，你必须停下来问清楚**。包括：范围、语义、验收标准、两端同步怎么办、测试怎么写。信息缺失时默认追问，不要用想象填空白。
- 反驳必须带证据。测试打脸 > 源码打脸 > 逻辑推导 > "我感觉"。
- 连续两次被用户否定 → **立即停手**，重新对齐再动代码。
- 做完 ≠ 做对。每次交付前自问：**文档同步了吗？测试加了吗？两端一致吗？**

---

## 1. 铁律

**任何一条没做到 = 任务未完成（用户让你确认交付时必须如实汇报哪条没做）。**

### 1.1 需求不清必须停下问

触发条件（任一即停）：
- 用户没说"做到什么程度"
- 用户指定的文件/函数你找不到（搜索 2 次没精确命中 → 问）
- 两个及以上方案都可行，用户没选
- 实际情况和预期不符

**"我觉得是 X" ≠ "我确认了是 X"。** 前者要问，后者才行动。

### 1.2 文档必须同步

改了代码 → **必须**回头更新对应文档：

- 改模块内部实现 → 看 `src/modules/<name>/llm.md`、`src/platform/llm.md`、`src/shared/llm.md`、`cloudfunctions/llm.md` 的 Contracts / Invariants 段是否还准确
- 改页面归属 → 更新 `src/pages/llm.md` 的归属表
- 改目录结构或命令 → 更新 `README.md` 和本文件的 "模块索引" 段
- **`TODO.md` 必须实时同步**：开工时把对应任务「状态」改 `进行中` + 填「开工日期」+「负责人」；完工时改 `已完成` + 填「完工日期」+「关联 PR」+ 迁移到历史表；发现新需求派生任务 → 加新条目；遇到阻塞 → 更新阻塞项。**TODO.md 状态不同步 = 任务未完成**。

**文档没改 = 任务没完成**，即使代码跑得过、测试绿。

### 1.3 测试必须通过

- 改**纯逻辑**（`modules/*/domain`、`platform/mock`）→ 必须加或改对应单测；`npm test` 全绿才能交付
- 改**页面 UI/交互** → 由于未配 UI 测试框架，必须满足以下任一条件才能说"验证通过"：
  - (a) 浏览器真实走一遍受影响页面的 golden path + 至少一个 edge case
  - (b) `npm run build:h5` 全量打包成功
  - **禁止**把"curl 单个 SFC 文件返回 200 且 grep 无关键词"当成 UI 验证通过
  - 跑不动或无法完成 → 明说"无法测 UI"，不要假装 OK
- 改**云函数** → 无自动化测试，必须手动在微信开发者工具里本地调试 + 跑 H5 对等场景的单测确认两端一致

"测试没加 / 没跑通" 的任务不算完成。

### 1.4 UI 铁律：禁用 emoji、必须用 UI 库组件

**严格禁止在任何产出物（代码、模板、UI 文案、commit message、文档示例）里使用 emoji 或装饰性 Unicode 符号** —— 包括但不限于 `● ✓ ✗ ★ ☆ → ← ↑ ↓ ▲ ▼ ◆ ■`、所有 Emoji 编码位面字符。

替代方案：
- 状态点 / 徽章 → `<uni-tag type="error|warning|success" :inverted="true" />`
- 对勾 / 箭头 / 图标 → `<uni-icons type="checkmarkempty|right|redo|info|..." />`
- 对话确认 → `<uni-popup type="dialog">` + `<uni-popup-dialog>`
- 步骤分隔 → 用中文间隔符 `·` 或 uni-icons 组件，不用 `→`

**UI 库固定为 `@dcloudio/uni-ui`**（已在 `pages.json` 配置 easycom 自动引入）。新增交互前先看 uni-ui 是否已有对应组件，有就用，不要手写。

**已知坑 1（必读，输入失效）**：uni-app 5.07 H5 模式下，原生 `<input>` 和 `<textarea>` 标签无法触发数据双向绑定。修复：**所有文本输入必须使用 `<uni-easyinput v-model="..." />`**。

**已知坑 2（必读，路由 query 丢失）**：vue3 + uni-app 5.07 H5 模式下，`onLoad(options)` 收到的 options 可能不包含 query 参数。修复：**用 `pickRouteParam(options, 'xxx')` 替代 `options.xxx`**。位置：`@/shared/utils/route-query.js`。

**已知坑 3（必读，自定义事件名冲突）**：vue3 + uni-app 5.07 H5 下，子组件 `$emit` 的自定义事件如果和 DOM 原生事件同名，父组件收到的是 DOM Event 对象。修复：**自定义事件命名避开 DOM 原生事件名**。

**已知坑 4（必读，blob URL 跨页面失效）**：H5 模式下 `uni.chooseImage` 返回的 blob URL 是 page-scoped 的。修复：持久化前用 `blobToDataURL()` 转 base64 dataURL。位置：`@/shared/utils/image-encode.js`。

自检：
- 提交前 `grep -rP '[●✓✗★☆→←↑↓▲▼◆◇■□◉◎♥♡⚠⚡]' src` 必须零匹配。
- 新增 / 改动的页面里禁止出现裸的 `<input>` / `<textarea>`。

### 1.5 两端同步

H5 mock (`src/platform/mock/`) 和微信云函数 (`cloudfunctions/`) 是同一份业务逻辑的两个实现。

改一端必须同时改另一端，否则同一个用户在小程序和 H5 上会得到不一致的结果。

### 1.6 Commit 提交规范（铁律，违反不准提交）

**每一条 commit 的 message 必须严格遵守以下格式**：

```
[<type>][提交人] 具体内容：位置 + 更改
```

- **type**：9 类英文标签之一，**必须与 1.7 的分支前缀一一对应**：

  | type | 用途 |
  |------|------|
  | `feat` | 新增功能 |
  | `fix` | Bug 修复（非紧急） |
  | `hotfix` | 线上紧急修复 |
  | `refactor` | 重构（不改外部行为） |
  | `docs` | 纯文档 |
  | `test` | 只补测试，不动业务代码 |
  | `chore` | 依赖升级、构建脚本、CI、gitignore 等杂项 |
  | `release` | 发布冻结 / 预发修复 |
  | `dev` | 个人试验（不会合入 main） |

- **提交人**：git 账号名
- **具体内容**：列出改动的具体文件 / 模块路径 + 做了什么。多处改动用 `；` 分隔

Agent 在 commit 前**必须**自检 message 是否合规，不合规自己重写，不要问用户"要不要这样写"。

### 1.7 分支纪律（铁律，禁止直推 main）

**严禁在 `main` 分支上直接开发或执行 `git push origin main`**。任何开发者 / agent 接到任务，第一步必须**从最新的 `main` 拉一条新分支**在上面工作；功能自测通过后，通过 **Merge Request (MR)** 合入 `main`。

#### 分支命名规范

格式：`<type>/<kebab-case-slug>`，全小写、短横线分隔。

| 前缀 | 用途 | 示例 |
|------|------|------|
| `dev/<name>` | 个人长期开发分支 | `dev/zhangsan` |
| `feat/<slug>` | 新增功能 | `feat/ar-preview` |
| `fix/<slug>` | Bug 修复 | `fix/lbs-distance-calc` |
| `hotfix/<slug>` | 线上紧急修复 | `hotfix/cloud-auth-crash` |
| `refactor/<slug>` | 重构 | `refactor/exhibit-module-split` |
| `docs/<slug>` | 纯文档 | `docs/add-api-docs` |
| `test/<slug>` | 只补测试 | `test/exhibit-edge-cases` |
| `chore/<slug>` | 杂项 | `chore/upgrade-uni-ui` |
| `release/vX.Y.Z` | 发布冻结 | `release/v1.0.0` |

#### 工作流铁律

1. **开工前同步 main**：`git fetch origin && git checkout main && git pull --ff-only`，再 `git checkout -b <type>/<slug>`
2. **单分支单主题**
3. **合入前必须 rebase 或 merge 最新 `main`**
4. **严禁 `git push --force` 到 `main`**
5. **只能通过 MR 合并**，不允许本地 merge 后直推 main
6. **MR 合并后保留源分支作为工作记录**
7. **`dev/<name>` 分支不得直接 MR 到 `main`**
8. **所有 commit 仍须遵守 1.6 提交规范**

### 1.8 任何 reLaunch / switchTab 进入的页面必须有可见的"退出 / 返回上一级"入口

uni-app 默认顶部导航栏在 `reLaunch` / `switchTab` 进入的页面不会出现返回箭头。必须在页面 UI 内显式放退出按钮。

退出按钮文案必须自描述：禁止只放一个图标不带文字。

已经在 `tabBar` 里的页面由底部 tab 切换承担"退出"职责，本规则例外。

---

## 2. 进入任一模块前的动作

**读该模块的 `llm.md`。** 每个模块目录下都有一份。没读就改代码 = 跳过约束。

所有 `llm.md` 固定 6 段：**Identity / Boundaries / Contracts / Invariants / Tests / Change Protocol**。

## 3. 模块索引

> **TODO**: 项目初始化后，根据实际目录结构填写此表。

```
src/
├── modules/              # 业务域
│   ├── exhibit/          # 数字展陈域 → src/modules/exhibit/llm.md
│   ├── ar/               # AR 菜品预览域 → src/modules/ar/llm.md
│   ├── lbs/              # LBS 推荐域 → src/modules/lbs/llm.md
│   ├── social/           # 社交打卡域 → src/modules/social/llm.md
│   └── user/             # 用户域 → src/modules/user/llm.md
├── platform/             # 平台适配层
│   └── llm.md            → H5 mock vs 微信云的切换入口
├── shared/               # 跨模块通用组件
│   └── llm.md
├── pages/                # uni-app 路由入口
│   └── llm.md            → 页面 ↔ 模块 归属表
├── App.vue
├── main.js
├── pages.json
└── manifest.json

cloudfunctions/           # 微信云函数
└── llm.md

tests/                    # Vitest 单测（纯逻辑）
├── setup.js
└── modules/

vitest.config.js
README.md
CLAUDE.md                 # 本文件
AGENTS.md / GEMINI.md
```

## 4. 常用命令

```bash
npm install

npm run dev:h5             # H5 dev server（localStorage mock 数据）
npm run build:h5

npm run dev:mp-weixin      # 构建到 dist/dev/mp-weixin/，用微信开发者工具导入
npm run build:mp-weixin

npm test                   # Vitest 单测全量
npm run test:watch         # 监听模式
```

## 5. 你交付前的自检清单

1. 代码改完了吗？
2. 跑 `npm test` 全绿吗？
3. 改的是 UI → 手动起 dev server 验过了吗？验不了就明说
4. 改的是业务逻辑 → H5 mock 和 cloudfunctions 两边都同步了吗？
5. 动了哪些模块 → 那些模块的 `llm.md` 还准确吗？Contracts / Invariants 段更新了吗？
6. 动了目录结构或命令 → `README.md` 和本文件的模块索引更新了吗？
7. 有没有产出物出现 emoji 或装饰性 Unicode 符号？（铁律 1.4）
8. 新增 UI 是否走 `@dcloudio/uni-ui` 组件而非手写符号？
9. commit message 是否符合 `[type][提交人] 具体内容：位置+更改` 格式？（铁律 1.6）
10. 当前是不是在 `main` 分支上干活？是 → 立即切分支；改动是否通过 MR 合入？（铁律 1.7）
11. 新增 / 改的页面如果是被 `reLaunch` 或 `switchTab` 进入的，是否放了"退出"按钮？（铁律 1.8）

任何一条没做 → 如实告诉用户"XX 还没做"，不要假装完成。
