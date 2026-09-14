# restaurant.js

餐厅数据模型，定义荆州十二时辰餐厅推荐功能的核心数据结构。

## 导出

- `createRestaurant(data)` — 工厂函数，创建餐厅对象；不传 `id` 时自动生成递增数字 ID
- `VALID_TIME_SLOTS` — 荆州十二时辰合法时段标识数组（按子时→亥时顺序）
- `EXAMPLE_RESTAURANT` — 示例餐厅对象（楚味轩，午时）

## 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 自动生成 | 唯一标识 |
| name | string | 是 | 餐厅名称 |
| address | string | 是 | 餐厅地址 |
| phone | string | 否 | 联系电话，默认空字符串 |
| coordinates | { latitude, longitude } | 是 | 经纬度坐标，默认 { 0, 0 } |
| businessHours | { open, close, remark } | 是 | 营业时间，open/close 格式为 "HH:MM" |
| signatureDishes | string[] | 否 | 招牌菜品名称数组，默认空数组 |
| timeSlot | string | 是 | 对应荆州十二时辰的时段标识，取值见 VALID_TIME_SLOTS |

## VALID_TIME_SLOTS

`['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai']`

对应子时（23:00-01:00）到亥时（21:00-23:00）共十二个时辰。

## 修改规则

新增字段时需同步更新 `validateRestaurant()`、`src/platform/mock/lbs.js` mock 数据、`tests/modules/lbs/restaurant.test.js` 和本文件。
