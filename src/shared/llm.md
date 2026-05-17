# shared 模块 - LLM 指引

## Identity

`src/shared/` 是跨模块通用层，存放所有模块共用的工具函数和 UI 组件。

## Boundaries

- `utils/`：纯函数工具，无副作用，无平台依赖
- `components/`：通用 UI 组件，使用 `@dcloudio/uni-ui`
- 禁止 import `modules/*` 或 `platform/*` 的代码
- 只能被其他模块 import，不能反向依赖

## Contracts

### 工具函数（待 A2 实现）

| 文件 | 函数 | 说明 |
|------|------|------|
| `utils/route-query.js` | `pickRouteParam(options, key)` | 安全获取路由参数，解决 H5 query 丢失问题 |
| `utils/image-encode.js` | `blobToDataURL(blob)` | blob URL 转 base64 dataURL，解决跨页面失效问题 |

### 通用组件（待 A3 实现）

| 组件 | 说明 |
|------|------|
| 退出/返回按钮 | 用于 reLaunch/switchTab 进入的页面 |
| 加载状态组件 | 页面级 loading |
| 错误提示组件 | 统一错误展示 |

## Invariants

- utils 中的函数必须是纯函数，不操作 DOM、不调用 uni.* API
- 组件必须使用 uni-ui，禁止手写 emoji 或装饰符号
- 文本输入必须使用 `<uni-easyinput>`

## Tests

- utils 中每个函数必须有对应单测
- 组件通过浏览器手动验证

## Change Protocol

新增通用工具或组件时：
1. 确认没有其他模块已有类似实现
2. 在本文件 Contracts 表格中登记
3. 编写对应测试
