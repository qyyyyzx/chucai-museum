# user.js

> 用户模块 H5 mock 数据层

## 说明

使用本地存储（`uni.setStorageSync` / `uni.getStorageSync` / `uni.removeStorageSync`）持久化登录态，H5 与微信小程序端行为一致。

微信小程序端对应的云函数实现由 D2 负责接入，接入时必须保证与本文件的方法签名和返回 payload 同形。

**分层说明**：platform 层不依赖 modules 层，用户对象在本文件内直接构造。

## 导出

### login({ code, nickname, avatar })

模拟用户登录。

**参数**：
- `code` (string，可选): 微信登录 code，H5 mock 忽略
- `nickname` (string，可选): 用户昵称，不传时默认 `'楚菜爱好者'`
- `avatar` (string，可选): 头像 URL 或 base64，不传时为空串

**返回值**：`Promise<User>`

### logout()

清除登录态。

**返回值**：`Promise<boolean>`，始终返回 true

### getCurrentUser()

获取当前登录用户。

**返回值**：`Promise<User | null>`，未登录返回 null

### updateUser({ nickname, avatar })

更新当前登录用户的昵称和头像。未登录时抛错。

**返回值**：`Promise<User>`

## 存储键

- `chucai_user_current`：当前登录用户 JSON，登出时删除

## 相关文件

- `src/platform/api.js` — userApi 统一入口
- `src/modules/user/llm.md` — 模块约束
- `tests/modules/user/` — 单元测试
