# route-query.js

> 路由参数处理工具

## 说明

解决 vue3 + uni-app 5.07 H5 模式下，`onLoad(options)` 收到的 options 可能不包含 query 参数的问题。

## 函数

### pickRouteParam(options, key)

安全获取路由参数。

**参数**：
- `options` (Object): onLoad 生命周期的 options 参数
- `key` (string): 要获取的参数名

**返回值**：
- `string|null`: 参数值，不存在时返回 null

**使用示例**：
```javascript
import { pickRouteParam } from '@/shared/utils/route-query.js'

onLoad(options) {
  const id = pickRouteParam(options, 'id')
  console.log(id) // '123'
}
```

**解决问题**：
- 原生 `options.id` 在某些情况下可能为 undefined
- 本函数提供更安全的参数获取方式
