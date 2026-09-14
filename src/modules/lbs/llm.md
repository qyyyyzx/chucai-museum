# lbs 模块 - LLM 指引

## Identity

`src/modules/lbs/` 是地理位置服务域，负责基于荆州十二时辰的餐厅推荐功能。

## Boundaries

- `domain/`：纯数据模型和验证函数，禁止 import 任何副作用代码（`uni.*`、`localStorage`、DOM）
- 禁止 import 其他 `modules/*` 的代码
- 禁止 import `shared/*` 以外的跨模块代码

## Contracts

### 接口（platform 层实现）

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getRestaurantsByTimeSlot(timeSlot)` | `timeSlot?: string` | `{ list: Restaurant[], total: number }` | 按时辰查询餐厅，不传则返回全量 |

### 数据模型（H1 已定义）

| 文件 | 模型 | 必填字段 | 说明 |
|------|------|----------|------|
| `domain/restaurant.js` | Restaurant | `name, address, coordinates, businessHours, timeSlot` | 餐厅：基础信息、营业时间、招牌菜品、时辰关联 |

```
Restaurant {
  id: number
  name: string           // 必填
  address: string        // 必填
  phone: string
  coordinates: { latitude: number, longitude: number }  // 必填
  businessHours: { open: string, close: string, remark: string }  // 必填
  signatureDishes: string[]
  timeSlot: string       // 必填，取值见 VALID_TIME_SLOTS
}
```

验证函数导出 `{ valid: boolean, errors: string[] }`，不抛异常。

## Invariants

- 时辰标识使用拼音（zi/chou/yin/mao/chen/si/wu/wei/shen/you/xu/hai）
- mock 数据覆盖荆州十二时辰，每家餐厅至少 3 道招牌菜品
- 禁止 emoji

## Tests

- 数据模型验证函数需写单测（H1 负责）
- 测试文件放在 `tests/modules/lbs/`

## Change Protocol

新增字段时：
1. 更新 `domain/restaurant.js` 数据模型
2. 更新 `platform/mock/lbs.js` 和 `cloudfunctions/` 两端实现
3. 更新本文件的 Contracts 段
