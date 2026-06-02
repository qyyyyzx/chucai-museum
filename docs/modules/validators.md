# validators.js

展陈数据模型验证函数，对 Dish、Chef、HistoricalPeriod 进行字段校验。

## 导出

- `validateDish(dish)` — 验证菜品对象
- `validateChef(chef)` — 验证名厨对象
- `validateHistoricalPeriod(period)` — 验证历史时期对象

三个函数均返回 `{ valid: boolean, errors: string[] }`，不抛出异常。

## 验证规则

| 验证项 | 规则 |
|--------|------|
| 对象非空 | dish/chef/period 不能为 null/undefined |
| 必填字段 | name（菜品/名厨）、dynasty（时期）不能为空或纯空白 |
| ID 类型 | id 若存在必须为 number |
| 字符串字段 | image/photo/history/method/bio/characteristics 若存在必须为 string |
| 数组字段 | ingredients/signatureDishes/representativeDishes 若存在必须为 Array |

## 修改规则

新增数据模型或字段时需同步添加对应验证逻辑。
