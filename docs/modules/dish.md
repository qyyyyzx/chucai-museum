# dish.js

楚菜菜品数据模型，定义菜品的完整数据结构。

## 导出

- `createDish(data)` — 工厂函数，创建菜品对象
- `toExhibitItem(dish)` — 将菜品转为展品列表项格式
- `EXAMPLE_DISH` — 清蒸武昌鱼示例数据

## 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 否 | 唯一标识，自动生成 |
| name | string | 是 | 菜品名称 |
| image | string | 否 | 图片路径 |
| history | string | 否 | 历史渊源 |
| method | string | 否 | 烹饪做法 |
| ingredients | string[] | 否 | 食材列表 |

## 修改规则

新增字段时需同步更新 `validators.js` 中的 `validateDish()` 和本文件。
