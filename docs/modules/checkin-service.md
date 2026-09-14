# checkin-service.js

社交打卡业务逻辑层，供页面调用，负责打卡记录的创建、查询、删除。

## 导出

- `createCheckin({ note, images, location })` — 异步创建并保存打卡记录
- `getCheckinRecords()` — 获取全部打卡记录（按创建时间倒序）
- `deleteCheckinRecord(id)` — 删除一条记录，返回是否成功

## 关键逻辑

- **blob URL 自动转换**：H5 模式下 `uni.chooseImage` 返回的 blob URL 是 page-scoped 的，
  保存前统一经 `@/shared/utils/image-encode.js` 的 `blobToDataURL()` 转为 base64 dataURL
- **先转换后校验**：转换完成才执行 `validateCheckinRecord()`，非法数据抛出 Error（message 含原因）
- **不直接碰存储**：持久化统一走 `platform/api.js` 的 `socialApi`

## 依赖

- `@/modules/social/domain/checkin-record.js`
- `@/shared/utils/image-encode.js`
- `@/platform/api.js`

## 修改规则

改动接口时需同步更新 `tests/modules/social/checkin-service.test.js` 与
`src/modules/social/llm.md` 的 Contracts 段。
