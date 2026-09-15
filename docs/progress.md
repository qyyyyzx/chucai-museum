# 楚菜文化数字博物馆 - 开发进度

> 最后更新：2026-09-15

## 当前分支：dev/zyc

## 团队分工总览

| 负责人 | 任务 | 状态 |
|--------|------|------|
| 董文静 | B1 用户登录 | 待开始 |
| 周欣如 | B2 用户信息页面 | 待开始 |
| 卫淇悦 | C1 展陈数据模型 + H1 餐厅数据模型 | C1 已完成（commit 80b1b59，代码/测试/文档齐全）；H1 已完成（commit 8fcf9ad，代码/测试/文档齐全） |
| 武千惠 | A1 项目初始化 + A2 通用工具 + A3 通用组件 + C2 展陈列表页面 | A1 已完成；A2 已完成（route-query.js、image-encode.js 及对应测试和文档齐全）；A3 已完成（exit-button、loading-state、error-message 三个组件齐全）；C2 进行中 |
| 吴若凡 | C3 展陈详情页面 + C4 菜品故事卡 | C3、C4 已完成 |
| 余佳琦 | D1 H5 Mock 数据 | 已完成（src/platform/mock/exhibit.js 及 exhibitApi 已就绪） |
| 李语瞳 | D2 微信云函数 + G1 AR 调研 | 待开始 |
| 黄晓 | E1 地理位置 + H2 楚菜地图页面 | 待开始 |
| 张耀川 | F1 社交打卡（含分享功能） | 已完成（云函数端待 D2 接入） |

## F1 社交打卡（张耀川）

| 步骤 | 状态 | 说明 |
|------|------|------|
| 数据模型 + 验证函数 + 分享文案生成 | 已完成 | `src/modules/social/domain/checkin-record.js` |
| 业务逻辑（blob 转 base64） | 已完成 | `src/modules/social/services/checkin-service.js` |
| H5 mock 持久化 | 已完成 | `src/platform/mock/social.js`（localStorage，键 `chucai_social_checkins`） |
| 平台统一入口 | 已完成 | `src/platform/api.js`（socialApi；云函数端待 D2 接入） |
| 打卡页面 | 已完成 | `src/pages/social/checkin.vue`（选照片、感想、地点、历史记录、删除） |
| 分享功能 | 已完成 | 分享文案 `buildShareText()` + 记录卡片分享按钮（复制到剪贴板）+ 微信端 `onShareAppMessage` 原生转发 |
| 单元测试 | 已完成 | 25 个用例（checkin-record + checkin-service） |

## A2 通用工具（武千惠）

| 步骤 | 状态 | 说明 |
|------|------|------|
| route-query.js | 已完成 | `src/shared/utils/route-query.js` 及对应测试和文档齐全 |
| image-encode.js | 已完成 | `src/shared/utils/image-encode.js` 及对应测试和文档齐全 |

## A3 通用组件（武千惠）

| 步骤 | 状态 | 说明 |
|------|------|------|
| exit-button | 已完成 | `src/shared/components/exit-button.vue` |
| loading-state | 已完成 | `src/shared/components/loading-state.vue` |
| error-message | 已完成 | `src/shared/components/error-message.vue` |

## C1 展陈数据模型（卫淇悦）

| 步骤 | 状态 | 说明 |
|------|------|------|
| 菜品 / 名厨 / 历史时期数据模型 + 验证函数 + 测试 | 已完成 | commit 80b1b59，Mist7 提交，代码/测试/文档齐全 |

## C2 展陈列表页面（武千惠）

| 步骤 | 状态 | 说明 |
|------|------|------|
| Step 1：创建页面 + 注册路由 | 已完成 | `src/pages/exhibit/list.vue` + `src/pages.json` |
| Step 2：数据结构 + mock 数据 | 已完成 | 已接入 `exhibitApi.getExhibitList()`，D1 mock 数据已就绪 |
| Step 3：列表展示 UI | 已完成 | tab 切换 + uni-list + 10 道菜品 + 5 位名厨硬编码数据 |
| Step 4：下拉刷新 | 已完成 | `onPullDownRefresh` + `refreshData` + 加载状态提示 + 7个测试用例 |
| Step 5：上拉加载更多 | 已完成 | `onReachBottom` + `loadMore` + 分页追加 + 底部 loading/"没有更多了"提示；D1 mock 分页数据已就绪 |
| Step 6：点击跳转详情 | 已完成 | `goDetail()` 已实现跳转逻辑；`src/pages/exhibit/detail.vue` 详情页已完成 |

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

- [x] D1 mock 数据实现（`src/platform/mock/exhibit.js` 及 `exhibitApi` 已就绪，C2-Step2、C2-Step5 端到端验证完成）
- [x] C3 详情页已完成（由武千惠代做，commit 待补）
