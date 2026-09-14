# 楚菜文化数字博物馆 - 开发进度

> 最后更新：2026-05-26

## 当前分支：dev/wqh

## 团队分工总览

| 负责人 | 任务 | 状态 |
|--------|------|------|
| 董文静 | B1 用户登录 | 待开始 |
| 周欣如 | B2 用户信息页面 | 待开始 |
| 卫淇悦 | C1 展陈数据模型 + H1 餐厅数据模型 | C1 已完成，H1 待开始 |
| 武千惠 | A1 项目初始化 + A2 通用工具 + A3 通用组件 + C2 展陈列表页面 | A1 已完成，C2 进行中 |
| 吴若凡 | C3 展陈详情页面 + C4 菜品故事卡 | 待开始 |
| 余佳琦 | D1 H5 Mock 数据 | 待开始 |
| 李语瞳 | D2 微信云函数 + G1 AR 调研 | 待开始 |
| 黄晓 | E1 地理位置 + H2 楚菜地图页面 | 待开始 |
| 张耀川 | F1 社交打卡 + H3 时辰介绍页 | 待开始 |

## C1 展陈数据模型（已完成）

| 文件 | 说明 |
|------|------|
| `src/modules/exhibit/domain/exhibit-item.js` | 列表用精简结构 `ExhibitItem` + `validateExhibitItem()` 验证函数 |
| `src/modules/exhibit/domain/dish.js` | 详情用完整菜品结构 `Dish` + `validateDish()` 验证函数 |
| `src/modules/exhibit/domain/chef.js` | 详情用完整名厨结构 `Chef` + `validateChef()` 验证函数 |
| `src/modules/exhibit/domain/period.js` | 最小版本历史时期结构 `Period` + `validatePeriod()` 验证函数 |
| `tests/modules/exhibit/domain.test.js` | 四个模型的单元测试，覆盖正常情况和异常情况 |

**设计说明**：
- `ExhibitItem` 为列表精简结构（id、name、summary、image、type），列表页使用
- `Dish` / `Chef` 为详情完整结构，详情页使用
- `Period` 为最小版本，只定义数据结构和验证函数，暂无页面
- C4 扩展字段（story、technique、storyImages）留给 C4 负责人自行扩展

## C2 展陈列表页面（武千惠）

| 步骤 | 状态 | 说明 |
|------|------|------|
| Step 1：创建页面 + 注册路由 | 已完成 | `src/pages/exhibit/list.vue` + `src/pages.json` |
| Step 2：数据结构 + mock 数据 | 待开始 | 依赖 C1（已完成）、D1 |
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

- [x] C1 数据模型定义（已完成，Step 2 的 C1 依赖解除）
- [ ] D1 mock 数据实现（影响 Step 2）
- [ ] C3 详情页负责人确认（影响 Step 6）
