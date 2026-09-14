# social.js（platform/mock）

社交打卡模块的 H5 mock 实现，使用 localStorage 持久化，存储键为 `chucai_social_checkins`。

## 导出

- `saveCheckinRecord(record)` — 保存记录，同 id 覆盖，返回记录
- `getCheckinRecords()` — 返回全部记录，按 createdAt 倒序
- `deleteCheckinRecord(id)` — 删除记录，返回是否删除成功

## 行为说明

- localStorage 数据损坏或不可用时按空列表降级，不抛异常
- 写入失败（超出容量等）静默降级

## 两端同步（铁律 1.5）

微信云函数端对应实现由 D2 接入 `cloudfunctions/` 时，必须保证与本文件
方法签名和返回 payload 同形。
