# pages 模块 - LLM 指引

## Identity

`src/pages/` 是 uni-app 的路由入口层，负责页面注册和视图组合。每个 `.vue` 文件对应一个可访问的页面路由。

## Boundaries

- 页面文件只做**视图组合**，不包含业务逻辑计算
- 业务逻辑调用 `modules/*/services/` 中的函数
- 数据获取通过 `platform/api.js` 统一入口
- 跨模块通用 UI 放 `shared/components/`，不放页面目录

## Contracts

### 已注册路由

| 路由路径 | 文件 | 所属模块 | 说明 |
|----------|------|----------|------|
| `/pages/exhibit/list` | `src/pages/exhibit/list.vue` | exhibit | 菜品/名厨列表页 |

### 路由注册规则

所有页面必须在 `src/pages.json` 的 `pages` 数组中注册，否则无法访问。

### 页面间跳转

- 使用 `uni.navigateTo()` 跳转非 tabBar 页面
- 使用 `uni.switchTab()` 跳转 tabBar 页面
- 路由参数通过 query 传递，接收端使用 `pickRouteParam(options, 'key')` 而非 `options.key`

## Invariants

- 页面文件禁止直接操作 `localStorage`，统一通过 `platform/mock/` 或 `platform/api.js`
- 页面中禁止使用原生 `<input>` / `<textarea>`，必须使用 `<uni-easyinput>`
- 页面中禁止出现 emoji 或装饰性 Unicode 符号
- `reLaunch` / `switchTab` 进入的页面必须有可见的"退出"按钮

## Tests

页面层不写单元测��（无 UI 测试框架）。验证方式：
- `npm run dev:h5` 浏览器手动验证 golden path + edge case
- `npm run build:h5` 全量打包成功

## Change Protocol

新增页面时：
1. 创建 `.vue` 文件
2. 在 `src/pages.json` 中注册路由
3. 更新本文件的"已注册路由"表格
4. 若页面归属某模块，在对应模块的 `llm.md` 中补充页面说明
