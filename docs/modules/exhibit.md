# exhibit.js — 展陈模块 H5 Mock 数据层

## 文件位置

src/platform/mock/exhibit.js

## 用途

为 H5 端提供展陈模块的模拟数据，供开发与调试使用。小程序端将由微信云函数提供真实数据，接口签名保持一致。

## 导出接口

### getExhibitList({ type, page, pageSize })

获取展品列表，支持按类型筛选和分页。

参数：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| type | 'dish' 或 'chef' | 否 | 无 | 展品类型，不传返回全部 |
| page | number | 否 | 1 | 页码，从 1 开始 |
| pageSize | number | 否 | 10 | 每页条数 |

返回值：

- list：当前页数据（ExhibitItem 数组）
- total：总条数（number）
- hasMore：是否还有下一页（boolean）

### getExhibitDetail(id)

获取单个展品的完整详情。

参数：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 展品 ID |

返回值：

- 找到：返回完整 Dish 或 Chef 对象
- 找不到：返回 null

## 数据说明

- 内置 10 条菜品数据（id 1-10）和 5 位名厨数据（id 101-105）
- 数据为只读种子数据，直接内置在文件中，不使用 localStorage
- 数据结构遵循 src/modules/exhibit/domain/ 下的类型定义

## 修改规则

- 新增展品数据时，直接在本文件对应数组中追加
- 接口签名如需变更，必须同步更新 src/platform/api.js 和本文档
- 小程序端云函数实现需与本文件接口保持一致

## 相关文件

- src/platform/api.js — 平台统一入口
- src/modules/exhibit/domain/dish.js — Dish 类型定义
- src/modules/exhibit/domain/chef.js — Chef 类型定义
- src/modules/exhibit/domain/exhibit-item.js — ExhibitItem 类型定义
