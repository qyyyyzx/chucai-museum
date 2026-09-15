# 武千惠任务计划表

> 最后更新：2026-09-15
> 分支：`dev/wqh`

---

## 任务总览

| 任务编号 | 任务名称 | 状态 | 预计时间 |
|----------|----------|------|----------|
| A1 | 项目初始化 | ✅ 已完成 | 2 天 |
| A2 | 通用工具开发 | ✅ 已完成 | 3-5 天 |
| A3 | 通用组件开发 | ✅ 已完成 | 3-5 天 |
| C2 | 展陈列表页面 | ✅ 已完成（Step6 占位完成） | 5-7 天 |

**总工作量**：11-17 天

---

## A2 通用工具开发

### 任务需求

开发所有模块都要用的基础工具函数，解决以下问题：
1. vue3 + uni-app 5.07 H5 模式下，`onLoad(options)` 收到的 options 可能不包含 query 参数
2. H5 模式下 `uni.chooseImage` 返回的 blob URL 是 page-scoped 的，跨页面会失效

### 实现流程

#### Step 1：阅读约束文档
- 阅读 `src/shared/llm.md` 了解通用层约束
- 了解已有工具函数的规范

#### Step 2：实现路由参数处理工具
**文件**：`src/shared/utils/route-query.js`

**功能**：
```javascript
/**
 * 安全获取路由参数
 * 解决 vue3 + uni-app 5.07 H5 模式下 onLoad(options) 可能不包含 query 参数的问题
 * @param {Object} options - onLoad 生命周期的 options 参数
 * @param {string} key - 要获取的参数名
 * @returns {string|null} 参数值
 */
export function pickRouteParam(options, key) {
  // 实现逻辑
}
```

**验收**：
- 函数能正确从 options 中提取参数
- 处理参数不存在的情况（返回 null）
- 有完整的 JSDoc 注释

#### Step 3：实现图片转 base64 工具
**文件**：`src/shared/utils/image-encode.js`

**功能**：
```javascript
/**
 * 将 blob URL 转换为 base64 dataURL
 * 解决 H5 模式下 blob URL 跨页面失效的问题
 * @param {string} blobUrl - blob URL
 * @returns {Promise<string>} base64 dataURL
 */
export function blobToDataURL(blobUrl) {
  // 实现逻辑
}
```

**验收**：
- 函数能将 blob URL 转换为 base64 dataURL
- 返回 Promise，支持异步调用
- 有完整的 JSDoc 注释

#### Step 4：编写单元测试
**目录**：`tests/modules/shared/`

**测试文件**：
- `tests/modules/shared/route-query.test.js`
- `tests/modules/shared/image-encode.test.js`

**测试用例**：
- route-query：正常获取参数、参数不存在、options 为 undefined
- image-encode：正常转换、无效 blob URL

#### Step 5：验证
- 运行 `npm test` 确保所有测试通过
- 检查函数有中文注释

### 验收标准
- [ ] 每个工具函数都有对应的测试文件
- [ ] 运行 `npm test` 全部通过
- [ ] 工具函数有中文注释说明用途和参数

---

## A3 通用组件开发

### 任务需求

开发所有页面都要用的基础 UI 组件，解决以下问题：
1. uni-app 默认顶部导航栏在 `reLaunch` / `switchTab` 进入的页面不会出现返回箭头
2. 页面需要统一的加载状态和错误提示样式

### 实现流程

#### Step 1：阅读约束文档
- 阅读 `src/shared/llm.md` 了解通用层约束
- 了解 `@dcloudio/uni-ui` 组件库的使用方式

#### Step 2：开发退出/返回按钮组件
**文件**：`src/shared/components/exit-button.vue`

**功能**：
- 用于 `reLaunch` / `switchTab` 进入的页面
- 显示"返回首页"或"退出"按钮
- 点击后执行 `uni.switchTab` 或 `uni.reLaunch`

**使用示例**：
```vue
<exit-button text="返回首页" url="/pages/index/index" />
```

**验收**：
- 按钮在 H5 模式下能正常显示
- 点击后能正确跳转
- 文案自描述，不只放图标

#### Step 3：开发加载状态组件
**文件**：`src/shared/components/loading-state.vue`

**功能**：
- 显示加载中状态（转圈动画）
- 支持自定义提示文字
- 支持全屏加载和局部加载

**使用示例**：
```vue
<loading-state :fullscreen="true" text="加载中..." />
```

**验收**：
- 加载动画在 H5 模式下能正常显示
- 使用 uni-ui 组件，不手写动画

#### Step 4：开发错误提示组件
**文件**：`src/shared/components/error-message.vue`

**功能**：
- 显示错误信息
- 支持不同类型的错误（网络错误、数据错误等）
- 支持重试按钮

**使用示例**：
```vue
<error-message type="network" text="网络连接失败" :retry="true" @retry="handleRetry" />
```

**验收**：
- 错误提示在 H5 模式下能正常显示
- 使用 uni-ui 组件，不手写符号

#### Step 5：编写使用示例页面
**文件**：`src/pages/shared/components-demo.vue`

**功能**：
- 展示三个组件的使用方式
- 可以交互测试组件功能

#### Step 6：验证
- 运行 `npm run dev:h5` 启动开发服务器
- 浏览器访问示例页面，测试组件功能
- 检查无 emoji、无原生 input/textarea

### 验收标准
- [ ] 组件在 H5 模式下能正常显示
- [ ] 没有使用任何 emoji 或装饰性符号
- [ ] 所有文本输入使用 `<uni-easyinput>` 而非原生 `<input>`

---

## C2 展陈列表页面（剩余部分）

### 当前进度

| 步骤 | 状态 | 说明 |
|------|------|------|
| Step 1：创建页面 + 注册路由 | ✅ 已完成 | `src/pages/exhibit/list.vue` + `src/pages.json` |
| Step 2：数据结构 + mock 数据 | ✅ 已完成 | 已接入 exhibitApi.getExhibitList() |
| Step 3：列表展示 UI | ✅ 已完成 | tab 切换 + uni-list + 硬编码数据 |
| Step 4：下拉刷新 | ✅ 已完成 | `onPullDownRefresh` + `refreshData` |
| Step 5：上拉加载更多 | ✅ 已完成 | onReachBottom + loadMore + 12 个测试 |
| Step 6：点击跳转详情 | ✅ 占位完成 | 占位页已建，待 C3 完善 |

### Step 2：数据结构 + mock 数据

**依赖**：C1（卫淇悦）、D1（余佳琦）

**任务需求**：
- 将 `list.vue` 中的硬编码数据抽离到 `src/modules/exhibit/domain/` 定义数据模型
- 在 `src/platform/mock/` 实现 `getExhibitList()` 接口

**实现流程**：
1. 等待 C1 完成数据模型定义
2. 等待 D1 完成 mock 数据实现
3. 修改 `list.vue`，调用 `getExhibitList()` 获取数据
4. 测试数据加载和刷新功能

**验收**：
- 列表数据从 mock 接口获取，不再硬编码
- 下拉刷新能重新加载数据

### Step 5：上拉加载更多

**依赖**：Step 2

**任务需求**：
- `getExhibitList()` 接口支持分页参数（page、pageSize）
- 监听页面滚动到底部，加载下一页数据

**实现流程**：
1. 等待 Step 2 完成
2. 在 `getExhibitList()` 接口中添加分页参数
3. 在 `list.vue` 中添加 `onReachBottom` 生命周期
4. 实现加载更多逻辑
5. 添加 loading 状态和"没有更多了"提示

**验收**：
- 滚动到底部能自动加载更多数据
- 加载中显示 loading
- 无更多数据时显示"没有更多了"

### Step 6：点击跳转详情

**依赖**：C3（吴若凡）

**任务需求**：
- 点击列表项跳转到详情页
- 通过路由参数传递展品 id

**实现流程**：
1. 等待 C3 完成详情页，或先创建占位页面
2. 确认 `goDetail()` 方法已实现（已完成）
3. 测试跳转功能

**验收**：
- 点击列表项能跳转到详情页
- 详情页能收到 id 参数

---

## 时间安排

| 阶段 | 任务 | 预计时间 | 依赖 |
|------|------|----------|------|
| 第 1 周 | A2 通用工具 | 3-5 天 | 无 |
| 第 2 周 | A3 通用组件 | 3-5 天 | 无 |
| 第 3 周 | C2 Step 2（等待依赖） | - | C1、D1 |
| 第 4 周 | C2 Step 5 + Step 6 | 2-3 天 | Step 2、C3 |

---

## 待确认事项

- [ ] C1 数据模型何时完成？（影响 Step 2）
- [ ] D1 mock 数据何时完成？（影响 Step 2）
- [ ] C3 详情页何时完成？（影响 Step 6）

---

## 注意事项

1. **代码规范**：禁止使用 emoji、必须使用 uni-ui 组件
2. **测试要求**：A2 必须写单元测试，A3 必须手动验证
3. **文档同步**：修改代码后必须更新对应的 `llm.md`
4. **提交格式**：`[type][wqh] 具体内容：位置+更改`
