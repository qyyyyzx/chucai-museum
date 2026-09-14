# lbs.js

餐厅 H5 Mock 数据与查询接口，为 LBS 模块提供荆州十二时辰餐厅数据。

## 导出

- `getRestaurantsByTimeSlot(timeSlot?)` — 按时辰时段查询餐厅列表；不传参数或传 `null` 时返回全量数据

## 接口签名

```javascript
getRestaurantsByTimeSlot(timeSlot?: string): { list: Restaurant[], total: number }
```

| 参数 | 类型 | 说明 |
|------|------|------|
| timeSlot | string \| null \| undefined | 时辰标识（zi/chou/.../hai），不传则全量查询 |

| 返回字段 | 类型 | 说明 |
|----------|------|------|
| list | Restaurant[] | 餐厅列表 |
| total | number | 餐厅总数 |

## Mock 数据规模

- 共 12 家餐厅，每家对应一个时辰
- 地址覆盖荆州沙市区、荆州区、开发区等主要区域
- 每家餐厅至少 3 道招牌菜品

## 修改规则

新增或修改接口时需同步更新 `src/platform/api.js` 的 `lbsApi`、`src/platform/llm.md` 的 Contracts 表格、`tests/modules/lbs/restaurant.test.js` 和本文件。
