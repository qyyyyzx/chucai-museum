# historical-period.js

楚菜历史时期数据模型，定义不同朝代楚菜发展的数据结构。

## 导出

- `createHistoricalPeriod(data)` — 工厂函数，创建历史时期对象
- `EXAMPLE_PERIOD` — 春秋战国示例数据

## 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 否 | 唯一标识，自动生成 |
| dynasty | string | 是 | 朝代名称 |
| characteristics | string | 否 | 该时期楚菜特点 |
| representativeDishes | string[] | 否 | 代表菜品列表 |

## 修改规则

新增字段时需同步更新 `validators.js` 中的 `validateHistoricalPeriod()` 和本文件。
