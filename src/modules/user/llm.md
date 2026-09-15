# user 模块 - LLM 指引

## Identity

`src/modules/user/` 是用户域，负责用户登录、登出和登录态管理功能。

## Boundaries

- `domain/`：纯数据模型和验证函数，禁止 import 任何副作用代码（`uni.*`、`localStorage`、DOM）
- `services/`：业务逻辑，可调用 `domain/` 和 `platform/api.js`
- `src/platform/mock/user.js` 属于平台适配层，不属于本模块；本模块不感知其实现细节
- 禁止 import 其他 `modules/*` 的代码
- 禁止 import `shared/*` 以外的跨模块代码
- 本模块不依赖 `pages/`，页面层由 B2 负责人单独维护

## Contracts

### 数据模型（domain 层已定义）

| 文件 | 模型 | 必填字段 | 说明 |
|------|------|----------|------|
| `domain/user.js` | User | `id`、`nickname` | 用户：昵称、头像、openid、注册时间 |

```
User {
  id: number          // 唯一标识，自动生成（毫秒时间戳单调递增）
  nickname: string    // 用户昵称，不能为空，默认值 '游客'
  avatar: string      // 头像 URL 或 base64 dataURL，允许为空字符串
  openid: string      // 微信 openid，H5 mock 时为占位值，允许为空字符串
  createdAt: string   // 注册时间，ISO 8601 格式字符串
}
```

验证函数 `validateUser(user)` 返回 `{ valid: boolean, errors: string[] }`，不抛异常。

### 业务函数（services 层，已实现）

| 函数 | 签名 | 返回值 | 说明 |
|------|------|--------|------|
| `login` | `login({ code?, nickname?, avatar? })` | `Promise<User>` | 登录并返回用户对象 |
| `logout` | `logout()` | `Promise<boolean>` | 登出，清除登录态，始终返回 true |
| `getCurrentUser` | `getCurrentUser()` | `Promise<User\|null>` | 获取当前登录用户，未登录返回 null |
| `isLoggedIn` | `isLoggedIn()` | `Promise<boolean>` | 判断是否已登录，内部复用 getCurrentUser |

### 平台接口（platform 层，通过 userApi 调用）

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `userApi.login(params)` | `{ code?, nickname?, avatar? }` | `Promise<User>` | H5 mock：生成演示用户写入 localStorage；微信端：D2 待接入 |
| `userApi.logout()` | 无 | `Promise<boolean>` | H5 mock：删除 localStorage 登录态；微信端：D2 待接入 |
| `userApi.getCurrentUser()` | 无 | `Promise<User\|null>` | H5 mock：从 localStorage 读取；微信端：D2 待接入 |

## Invariants

- **铁律 1.5（两端同步）**：`platform/mock/user.js` 与微信云函数端（D2 待接入）的方法签名和返回 payload 必须完全同形；修改一端必须同步修改另一端
- **分层禁止**：`platform/mock/user.js` 不能 import `src/modules/user/domain/user.js`；平台层不依赖模块层，用户对象在平台层内直接构造
- **调用方向**：`services/` 通过 `@/platform/api.js` 的 `userApi` 调用接口，禁止直接 import `platform/mock/user.js`
- **登录态存储键**：`chucai_user_current`，只存当前登录用户的完整 JSON；未登录时该键不存在；登出时删除该键
- **openid 约束**：H5 mock 场景 openid 固定为占位值 `mock_openid_001`；微信端由 D2 用 code 换取真实 openid
- **nickname 默认值**：H5 mock 不传 nickname 时默认为 `'楚菜爱好者'`；`createUser` 不传时默认为 `'游客'`（两处语义不同，均属正常）

## Tests

| 文件 | 测试对象 | 覆盖范围 |
|------|----------|----------|
| `tests/modules/user/user.test.js` | `domain/user.js` | `createUser` 默认值、字段赋值、自动 id、trim；`validateUser` 合法对象、null、非对象、缺 id、id 非数字、空 nickname、avatar/openid 非字符串、createdAt 格式错误、avatar/openid 允许空字符串 |
| `tests/modules/user/auth-service.test.js` | `services/auth-service.js` | `login` 返回用户对象、参数透传；`logout` 返回 true、登出后 getCurrentUser 为 null；`getCurrentUser` 未登录返回 null、已登录返回对象；`isLoggedIn` 未登录返回 false、已登录返回 true、内部不绕过 getCurrentUser |

## Change Protocol

新增用户字段或业务函数时：
1. 更新 `domain/user.js` 数据模型与验证函数
2. 同步更新 `platform/mock/user.js`（H5 端）和微信云函数端（D2 接入后）两端实现
3. 更新本文件的 Contracts 段
4. 如涉及页面展示，通知 B2 负责人同步更新 `src/pages/user/profile.vue`
5. 确认两端返回值结构一致（铁律 1.5）
