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

### 数据模型（C1 已完成，位于 `src/modules/exhibit/domain/`）

```
ExhibitItem {           // 列表用精简结构，见 exhibit-item.js
  id: number            // 展品唯一标识
  name: string          // 展品名称
  summary: string       // 简介摘要
  image: string         // 封面图片 URL
  type: 'dish'|'chef'   // 展品类型：菜品或名厨
}

Dish {                  // 菜品详情结构，见 dish.js
  id: number            // 菜品唯一标识
  name: string          // 菜品名称
  image: string         // 菜品图片 URL
  history: string       // 历史背景介绍
  technique: string     // 烹饪做法描述
  ingredients: string[] // 食材列表
}

Chef {                  // 名厨详情结构，见 chef.js
  id: number            // 名厨唯一标识
  name: string          // 名厨姓名
  photo: string         // 名厨照片 URL
  bio: string           // 个人简介
  signatureDishes: string[] // 代表菜名称列表
}

Period {                // 历史时期结构（最小版本），见 period.js
  id: number            // 历史时期唯一标识
  name: string          // 朝代或时期名称
  characteristics: string   // 该时期楚菜的主要特点
  representativeDishes: string[] // 该时期代表菜名称列表
}
```

**说明**：
- `ExhibitItem` 用于列表页，只包含少量字段
- `Dish` / `Chef` 用于详情页，包含完整字段
- `Period` 为最小版本，暂无页面，后续有需求再扩展
- C4 扩展字段（story、storyImages 等）由 C4 负责人在 `Dish` 上自行扩展

## Invariants

- 列表页（C2）的 mock 数据目前硬编码在页面内，待 D1 完成后迁移到 `platform/mock/`
- 菜品和名厨在列表层面共用 `ExhibitItem` 结构，通过 `type` 字段区分
- 所有页面使用 uni-ui 组件，禁止 emoji
- 列表页支持下拉刷新（`onPullDownRefresh`），刷新时显示加载状态提示

## Tests

- 展示逻辑（列表渲染、tab 切换）通过浏览器手动验证
- 数据模型验证函数单测位于 `tests/modules/exhibit/domain.test.js`（C1 已完成）

## Change Protocol

新增展品类型或字段时：
1. 更新 `domain/` 数据模型
2. 更新 `platform/mock/` 和 `cloudfunctions/` 两端实现
3. 更新本文件的 Contracts 段
4. 同步更新 `src/pages/llm.md` 的路由表
