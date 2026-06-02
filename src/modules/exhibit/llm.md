# exhibit 模块 - LLM 指引

## Identity

`src/modules/exhibit/` 是数字展陈域，负责楚菜菜品、名厨、历史文化的展示功能。

## Boundaries

- `domain/`：纯数据模型和验证函数，禁止 import 任何副作用代码（`uni.*`、`localStorage`、DOM）
- `services/`：业务逻辑，可调用 `domain/` 和 `platform/api.js`
- `components/`：展陈域专用 UI 组件
- 禁止 import 其他 `modules/*` 的代码
- 禁止 import `shared/*` 以外的跨模块代码

## Contracts

### 页面

| 路由 | 文件 | 说明 |
|------|------|------|
| `/pages/exhibit/list` | `src/pages/exhibit/list.vue` | 菜品/名厨列表，tab 切换 |
| `/pages/exhibit/story` | `src/pages/exhibit/story.vue` | 菜品故事卡（待开发） |

### 接口（platform 层实现）

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getExhibitList(type, page, pageSize)` | `type: 'dish'\|'chef'` | `{ list: ExhibitItem[], total: number }` | 分页获取展品列表 |
| `getExhibitDetail(id)` | `id: number` | `ExhibitItem` | 获取展品详情 |

### 数据模型（C1 已定义）

所有模型定义在 `domain/` 目录，通过工厂函数创建，配套验证函数。

| 文件 | 模型 | 必填字段 | 说明 |
|------|------|----------|------|
| `domain/dish.js` | Dish | `name` | 菜品：名称、图片、历史、做法、食材 |
| `domain/chef.js` | Chef | `name` | 名厨：姓名、照片、简介、代表菜 |
| `domain/historical-period.js` | HistoricalPeriod | `dynasty` | 历史时期：朝代、特点、代表菜 |
| `domain/exhibit-item.js` | ExhibitItem | `id, name, type` | 统一展品列表项，Dish/Chef 通过 `toExhibitItem()` 转换 |

```
Dish {
  id: number
  name: string          // 必填
  image: string
  history: string
  method: string
  ingredients: string[]
}

Chef {
  id: number
  name: string          // 必填
  photo: string
  bio: string
  signatureDishes: string[]
}

HistoricalPeriod {
  id: number
  dynasty: string       // 必填
  characteristics: string
  representativeDishes: string[]
}

ExhibitItem {
  id: number
  name: string
  summary: string       // 截取自 history/bio 前 80 字符
  image: string
  type: 'dish' | 'chef'
}
```

验证函数导出 `{ valid: boolean, errors: string[] }`，不抛异常。

## Invariants

- 列表页（C2）的 mock 数据目前硬编码在页面内，待 D1 完成后迁移到 `platform/mock/`
- 菜品和名厨共用同一数据结构，通过 `type` 字段区分
- 所有页面使用 uni-ui 组件，禁止 emoji
- 列表页支持下拉刷新（`onPullDownRefresh`），刷新时显示加载状态提示

## Tests

- 展示逻辑（列表渲染、tab 切换）通过浏览器手动验证
- 数据模型验证函数需写单测（C1 负责）

## Change Protocol

新增展品类型或字段时：
1. 更新 `domain/` 数据模型
2. 更新 `platform/mock/` 和 `cloudfunctions/` 两端实现
3. 更新本文件的 Contracts 段
4. 同步更新 `src/pages/llm.md` 的路由表
