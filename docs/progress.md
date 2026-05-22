# 楚菜文化数字博物馆 - 开发进度

> 最后更新：2026-05-22

## 当前分支：dev/wqh

## C2 展陈列表页面（武千惠）

| 步骤 | 状态 | 说明 |
|------|------|------|
| Step 1：创建页面 + 注册路由 | 已完成 | `src/pages/exhibit/list.vue` + `src/pages.json` |
| Step 2：数据结构 + mock 数据 | 待开始 | 依赖 C1、D1 |
| Step 3：列表展示 UI | 已完成 | tab 切换 + uni-list + 10 道菜品 + 5 位名厨硬编码数据 |
| Step 4：下拉刷新 | 已完成 | `onPullDownRefresh` + `refreshData` + 加载状态提示 + 7个测试用例 |
| Step 5：上拉加载更多 | 待开始 | 依赖 Step 2 分页接口 |
| Step 6：点击跳转详情 | 待开始 | 需 C3 详情页或占位页 |

## 基础设施

| 项目 | 状态 | 说明 |
|------|------|------|
| uni-app 依赖安装 | 已完成 | vue3 标签版本 |
| `src/pages.json` | 已完成 | 路由注册 |
| `src/App.vue` | 已完成 | 根组件 |
| `src/main.js` | 已完成 | 入口文件 |
| `src/manifest.json` | 已完成 | 应用配置 |
| `npm run dev:h5` | 已验证 | 可正常启动 |
| `npm run build:h5` | 已验证 | 编译通过 |

## llm.md 文档

| 文件 | 状态 |
|------|------|
| `src/pages/llm.md` | 已创建 |
| `src/modules/exhibit/llm.md` | 已创建 |
| `src/platform/llm.md` | 已创建 |
| `src/shared/llm.md` | 已创建 |

## PR流程

| 项目 | 状态 | 说明 |
|------|------|------|
| PR模板 | 已完善 | `.github/PULL_REQUEST_TEMPLATE.md` |
| CI流水线 | 已启用 | test + build-h5 + build-mp-weixin |
| PR流程指南 | 已创建 | `docs/pr-guide.md` |

## 待确认事项

- [ ] C1 数据模型定义（影响 Step 2）
- [ ] D1 mock 数据实现（影响 Step 2）
- [ ] C3 详情页负责人确认（影响 Step 6）
