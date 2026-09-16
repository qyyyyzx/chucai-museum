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
| `getCurrentLocation()` | 无 | `Promise<{ latitude: number, longitude: number }>` | 获取用户位置，H5 mock 返回荆州市中心固定坐标 |

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

### 距离计算（domain 层）

文件：`domain/distance.js`，纯函数，无副作用。

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `calcDistanceKm(lat1, lon1, lat2, lon2)` | 两点经纬度 | `number` | Haversine 公式计算球面距离，单位千米，保留 2 位小数 |
| `formatDistance(km)` | `km: number` | `string` | 距离格式化：小于 1 km 显示"850 m"，大于等于 1 km 显示"1.20 km" |
| `sortRestaurantsByDistance(restaurants, userLat, userLon)` | 餐厅列表 + 用户坐标 | `Restaurant[]` | 为每条记录补充 `distanceKm` 和 `distanceText` 字段，按距离升序返回，不修改原数组 |

### 时辰数据（domain 层）

文件：`domain/time-slots.js`，纯数据与纯函数，无副作用。

| 导出 | 类型 | 说明 |
|------|------|------|
| `TIME_SLOT_LIST` | `TimeSlotInfo[]` | 十二时辰完整信息，含 slot、name、alias、period、startHour |
| `getCurrentTimeSlot(date)` | `(Date?) => string` | 按真实时间返回对应时辰 slot，支持跨午夜 |
| `getTimeSlotInfo(slot)` | `(string) => TimeSlotInfo 或 undefined` | 按 slot 查时辰信息 |

页面层使用：
- `src/pages/lbs/chumap.vue`：楚菜地图主页面，时间轴 + 餐厅列表 + 详情弹窗
- `src/pages/lbs/components/TimeSlotBar.vue`：时间轴子组件

## Invariants

- 时辰标识使用拼音（zi/chou/yin/mao/chen/si/wu/wei/shen/you/xu/hai）
- mock 数据覆盖荆州十二时辰，每家餐厅至少 3 道招牌菜品
- H5 mock 的 `getCurrentLocation` 返回固定坐标（30.3322, 112.2384），不调浏览器 geolocation
- 距离单位统一用千米，`calcDistanceKm` 返回值保留 2 位小数
- 禁止 emoji

## Tests

- 数据模型验证函数需写单测（H1 负责）
- 距离计算函数单测放在 `tests/modules/lbs/distance.test.js`（E1 已完成）
- 测试文件放在 `tests/modules/lbs/`

## Change Protocol

新增字段时：
1. 更新 `domain/restaurant.js` 数据模型
2. 更新 `platform/mock/lbs.js` 和 `cloudfunctions/` 两端实现
3. 更新本文件的 Contracts 段
