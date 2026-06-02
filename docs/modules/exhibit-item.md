# exhibit-item.js

展品列表项统一数据模型，Dish 和 Chef 通过各自 `toExhibitItem()` 转换为此格式，供 platform 层 API 使用。

## 导出

- `createExhibitItem(data)` — 工厂函数，创建展品列表项

## 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 展品唯一标识 |
| name | string | 是 | 展品名称 |
| summary | string | 否 | 摘要信息 |
| image | string | 否 | 缩略图路径 |
| type | 'dish' \| 'chef' | 是 | 展品类型 |

## 修改规则

新增展品类型时需同时更新 Dish/Chef 的 `toExhibitItem()` 和 platform 层实现。
