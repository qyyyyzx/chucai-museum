# chef.js

楚菜名厨数据模型，定义名厨的完整数据结构。

## 导出

- `createChef(data)` — 工厂函数，创建名厨对象
- `toExhibitItem(chef)` — 将名厨转为展品列表项格式
- `EXAMPLE_CHEF` — 卢永良示例数据

## 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 否 | 唯一标识，自动生成 |
| name | string | 是 | 名厨姓名 |
| photo | string | 否 | 照片路径 |
| bio | string | 否 | 简介 |
| signatureDishes | string[] | 否 | 代表菜品列表 |

## 修改规则

新增字段时需同步更新 `validators.js` 中的 `validateChef()` 和本文件。
