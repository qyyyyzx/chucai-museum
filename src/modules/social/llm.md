# social 模块 - LLM 指引

## Identity

`src/modules/social/` 是社交打卡域，负责用户在参观楚菜博物馆过程中的拍照打卡、记录与分享功能。

## Boundaries

- `domain/`：纯数据模型和验证函数，禁止 import 任何副作用代码（`uni.*`、`localStorage`、DOM）
- `services/`：业务逻辑，可调用 `domain/` 和 `platform/api.js`
- `components/`：社交域专用 UI 组件
- 禁止 import 其他 `modules/*` 的代码
- 禁止 import `shared/*` 以外的跨模块代码

## Contracts

### 页面

| 路由 | 文件 | 说明 |
|------|------|------|
| `/pages/social/checkin` | `src/pages/social/checkin.vue` | 拍照打卡页：选照片、写感想、保存、查看历史记录 |

### 接口（platform 层实现）

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `socialApi.saveCheckinRecord(record)` | `record: CheckinRecord` | `CheckinRecord` | 保存一条打卡记录（存在同 id 则覆盖） |
| `socialApi.getCheckinRecords()` | 无 | `CheckinRecord[]` | 获取全部打卡记录，按创建时间倒序 |
| `socialApi.deleteCheckinRecord(id)` | `id: number` | `boolean` | 删除指定记录，返回是否删除成功 |

### 数据模型（F1 已定义）

| 文件 | 模型 | 必填字段 | 说明 |
|------|------|----------|------|
| `domain/checkin-record.js` | CheckinRecord | `id` | 打卡记录：感想、照片（base64）、地点、时间 |

```
CheckinRecord {
  id: number
  note: string          // 打卡感想，允许为空（有照片即可）
  images: string[]     // 照片数组，仅允许 base64 dataURL，禁止 blob URL
  location: string     // 打卡地点描述，允许为空
  createdAt: string    // ISO 8601 时间字符串
}
```

验证函数 `validateCheckinRecord(record)` 导出 `{ valid: boolean, errors: string[] }`，不抛异常。

### 业务函数（services 层）

| 函数 | 说明 |
|------|------|
| `createCheckin({ note, images, location })` | 异步创建打卡记录。blob URL 自动经 `blobToDataURL()` 转 base64 后再落库 |
| `getCheckinRecords()` | 获取全部打卡记录（倒序） |
| `deleteCheckinRecord(id)` | 删除一条记录 |

## Invariants

- **图片只允许 base64 dataURL 持久化**：H5 模式下 `uni.chooseImage` 返回的 blob URL 是 page-scoped 的，跨页面失效，必须在持久化前用 `@/shared/utils/image-encode.js` 的 `blobToDataURL()` 转换（铁律 1.4 已知坑 4）
- 打卡感想和照片不能同时为空
- 页面禁止直接操作 `localStorage`，统一走 `services/` + `platform/api.js`
- 所有页面使用 uni-ui 组件，文本输入必须 `<uni-easyinput>`，禁止 emoji

## Tests

- `domain/` 验证函数需写单测：`tests/modules/social/checkin-record.test.js`
- `services/` 业务函数需写单测（stub localStorage）：`tests/modules/social/checkin-service.test.js`
- 页面 UI 通过浏览器手动验证 golden path + edge case

## Change Protocol

新增打卡字段或分享能力时：
1. 更新 `domain/checkin-record.js` 数据模型与验证函数
2. 更新 `platform/mock/social.js`（H5 端）和 `cloudfunctions/`（微信端，D2 接入后）两端实现
3. 更新本文件的 Contracts 段
4. 同步更新 `src/pages/llm.md` 的路由表
