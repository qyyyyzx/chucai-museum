# platform 模块 - LLM 指引

## Identity

`src/platform/` 是平台适配层，负责 H5 mock 和微信云函数之间的切换。业务代码通过 `api.js` 统一调用，不感知底层实现。

## Boundaries

- `api.js`：业务统一入口，根据平台环境分发到 `mock/` 或 `cloud/`
- `mock/`：H5 模式实现，使用 localStorage 持久化
- `cloud/`：mp-weixin 模式实现，调用微信云函数
- `mock/` 和 `cloud/` 必须保持**方法签名和返回 payload 同形**

## Contracts

### 已实现接口

| 方法 | 状态 | 说明 |
|------|------|------|
| `socialApi.saveCheckinRecord(record)` | mock 已实现（H5），云函数待 D2 | F1 打卡记录保存（localStorage 持久化） |
| `socialApi.getCheckinRecords()` | mock 已实现（H5），云函数待 D2 | F1 打卡记录列表（按时间倒序） |
| `socialApi.deleteCheckinRecord(id)` | mock 已实现（H5），云函数待 D2 | F1 删除打卡记录 |
| `getRestaurantsByTimeSlot(timeSlot?)` | mock 已实现（H5），云函数待 D2 | H2 楚菜地图依赖，按时辰查询餐厅列表 |
| `getExhibitList()` | 待实现 | C2 依赖 |
| `getExhibitDetail()` | 待实现 | C3 依赖 |
| `getRestaurantsByTimeSlot()` | 待实现 | H2 依赖 |

### 接口签名规范

```javascript
// mock 实现示例
export function getExhibitList(type = 'dish', page = 1, pageSize = 10) {
  // 返回 Promise<{ list: ExhibitItem[], total: number }>
}
```

## Invariants

- 同一个方法在 `mock/` 和 `cloud/` 中的参数、返回值结构必须完全一致
- mock 数据必须包含中文内容，符合楚菜文化主题
- mock 数据使用 localStorage 持久化，刷新不丢失
- 修改一端必须同步修改另一端（铁律 1.5）

## Tests

- mock 层的纯逻辑函数需写单测
- cloud 层在微信开发者工具中本地调试

## Change Protocol

新增接口时：
1. 在 `api.js` 中定义统一方法签名
2. 在 `mock/` 中实现 H5 版本
3. 在 `cloud/` 中实现微信版本
4. 更新本文件的 Contracts 表格
5. 确认两端返回值结构一致
