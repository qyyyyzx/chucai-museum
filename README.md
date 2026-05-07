# 楚菜文化数字博物馆

楚菜文化数字博物馆微信小程序。基于 uni-app (Vue 3) 构建，同时出 **H5** 和 **微信小程序** 两端。

> 这份文档是**给人看**的项目说明。AI / Agent 的指令文档在 [`CLAUDE.md`](./CLAUDE.md) 和各模块的 `llm.md`。

---

## 项目简介

楚菜文化数字博物馆是一个以数字化方式展示楚菜文化的微信小程序，主要功能包括：

- **数字展陈**：楚菜历史、文化、名菜、名厨的多媒体展示
- **AR 菜品预览**：通过 AR 技术让用户在手机上预览菜品的立体效果
- **LBS 推荐**：基于用户地理位置推荐附近的楚菜餐厅和文化景点
- **社交打卡**：用户可以在参观过程中拍照打卡、分享体验

---

## 技术栈

- **框架**：uni-app + Vue 3 + Vite
- **UI 库**：`@dcloudio/uni-ui`（easycom 自动引入 `uni-*` 组件）
- **两端**：H5（localStorage mock 数据，开发主力）+ 微信小程序（微信云开发：云函数 + 云数据库）
- **测试**：Vitest（纯逻辑单测，UI/E2E 未做）
- **Node**：建议 20+

---

## 快速上手

```bash
# 1. 装依赖
npm install

# 2. 起 H5 dev server（默认 http://localhost:5173）
npm run dev:h5

# 3. 跑单测
npm test

# 4. 构建生产包
npm run build:h5

# 5. 微信小程序
npm run dev:mp-weixin
# 生成到 dist/dev/mp-weixin/，用微信开发者工具"导入项目"指向该目录
```

---

## 项目结构

```
chucai-museum/
├── src/
│   ├── modules/                          # 业务域（按业务边界切）
│   │   ├── exhibit/                      # 数字展陈域
│   │   │   ├── domain/
│   │   │   ├── services/
│   │   │   ├── components/
│   │   │   └── llm.md
│   │   ├── ar/                           # AR 菜品预览域
│   │   │   ├── domain/
│   │   │   ├── services/
│   │   │   ├── components/
│   │   │   └── llm.md
│   │   ├── lbs/                          # LBS 推荐域
│   │   │   ├── domain/
│   │   │   ├── services/
│   │   │   ├── components/
│   │   │   └── llm.md
│   │   ├── social/                       # 社交打卡域
│   │   │   ├── domain/
│   │   │   ├── services/
│   │   │   ├── components/
│   │   │   └── llm.md
│   │   └── user/                         # 用户域
│   │       ├── domain/
│   │       ├── services/
│   │       ├── components/
│   │       └── llm.md
│   ├── platform/                         # 平台适配层
│   │   ├── api.js                        # 业务统一入口
│   │   ├── mock/                         # H5 模式实现（localStorage）
│   │   ├── cloud/                        # mp-weixin 云函数分发
│   │   └── llm.md
│   ├── shared/                           # 跨模块通用
│   │   ├── components/
│   │   ├── utils/
│   │   └── llm.md
│   ├── pages/                            # uni-app 路由入口
│   │   └── llm.md
│   ├── App.vue
│   ├── main.js
│   ├── pages.json
│   └── manifest.json
│
├── cloudfunctions/                       # 微信云函数
│   └── llm.md
│
├── tests/                                # Vitest 单测（纯逻辑）
│   ├── setup.js
│   └── modules/
│
├── docs/
│
├── vite.config.js
├── vitest.config.js
├── package.json
├── index.html
│
├── CLAUDE.md
├── AGENTS.md
├── GEMINI.md
└── README.md                             # 本文件
```

---

## 架构要点

### 三个层次

```
pages/*                  ← 视图和组合
  │
  ├── modules/*          ← 业务域（展陈、AR、LBS、社交、用户）
  │     │
  │     └── platform/*   ← 平台适配（H5 mock / 微信云）
  │
  └── shared/*           ← 跨模块通用组件
```

方向只能向下，不能反过来。`shared/` 不许 import `modules/*`；`modules/*/domain/` 不许 import 任何副作用代码（`uni.*`、`localStorage`、DOM）。

### 两端如何保持一致

H5 开发用 mock（`src/platform/mock/`），小程序用云函数（`cloudfunctions/`）。两边必须：

1. **方法签名和返回 payload 同形** —— 业务代码无感切换
2. **业务逻辑数值一致** —— domain 层是唯一来源，H5 import 复用；云函数无法 import，必须手动对齐

改其中一端 → 必须同步另一端。

---

## 文档总览

| 文档 | 给谁看 | 作用 |
|------|-------|------|
| `README.md` | 人 | 项目说明、结构、命令 |
| `CLAUDE.md` | AI (Claude Code) | 身份约束、铁律、模块索引 |
| `AGENTS.md` | AI (Codex / OpenCode) | 转接到 CLAUDE.md |
| `GEMINI.md` | AI (Gemini CLI) | 转接到 CLAUDE.md |
| `src/modules/*/llm.md` | AI | 模块职责、契约、不变式、改动协议 |
| `src/platform/llm.md` | AI | 平台适配层约束 |
| `src/shared/llm.md` | AI | 通用层约束 |
| `src/pages/llm.md` | AI | 页面与模块归属 |
| `cloudfunctions/llm.md` | AI | 云函数约束、两端同步要求 |
## 开发环境设置

1. 克隆仓库  
   `git clone git@github.com:qyyyyzx/chucai-museum.git`
2. 进入目录并安装依赖  
   `cd chucai-museum && npm install`
3. 启动 H5 开发服务器  
   `npm run dev:h5`
4. 构建微信小程序  
   `npm run build:mp-weixin`，然后用微信开发者工具导入 `dist/build/mp-weixin` 目录

## 规范提示

- **代码与文档同步**：任何 `src/` 下新增或修改 `.js` 文件，必须同步创建或更新 `docs/modules/同名.md`，否则 `git commit` 会被 pre-commit hook 拦截。
- **提交信息格式**：`[type][author] 内容`，type 可选：feat / fix / docs / test / chore 等。
- **分支命名**：`feat/xxx`、`fix/xxx`、`docs/xxx`。

## 如何贡献

1. 从最新的 `main` 拉分支：`git checkout -b feat/your-feature`
2. 编写代码，同步更新文档，运行 `npm test` 确保通过
3. 推送到你的 fork 或直接推送到你的分支（如果有权限）并创建 Pull Request
4. 等待 CI 通过并请求 review

## 相关文档

- AI 规范详见 [`CLAUDE.md`](./CLAUDE.md)
- 模块文档位于 `docs/modules/`
