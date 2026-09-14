# checkin-record.js

社交打卡记录数据模型，定义一条打卡的完整数据结构。

## 导出

- `createCheckinRecord(data)` — 工厂函数，创建打卡记录对象
- `validateCheckinRecord(record)` — 校验打卡记录，返回 `{ valid, errors }`
- `buildShareText(record)` — 生成打卡记录的分享文案（固定开头 + @地点 + 感想），记录为空时只返回固定开头，不抛异常

## 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 自动生成 | 唯一标识，不传时以毫秒时间戳为基准单调递增（跨页面刷新不与 localStorage 旧记录撞 id，同一毫秒内多次创建也保证唯一） |
| note | string | 二选一 | 打卡感想，自动去除首尾空白 |
| images | string[] | 二选一 | 照片数组，仅允许 base64 dataURL，禁止 blob URL |
| location | string | 否 | 打卡地点描述 |
| createdAt | string | 自动生成 | ISO 8601 时间字符串 |

## 校验规则

- 感想和照片不能同时为空（纯文字或纯照片打卡均可）
- images 中出现 `blob:` 前缀时校验失败，提示先用 `blobToDataURL()` 转换
- id 必须是数字，createdAt 必须是 ISO 8601 格式
- 校验函数不抛异常，统一返回 `{ valid, errors }`

## 修改规则

新增字段时需同步更新 `validateCheckinRecord()`、`tests/modules/social/checkin-record.test.js` 和本文件。
