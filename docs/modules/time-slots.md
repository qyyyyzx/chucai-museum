# time-slots.js

> 荆州十二时辰数据与工具函数

## 说明

纯数据与纯函数，无任何副作用，可安全在 domain 层使用。

提供十二时辰的完整信息（名称、别名、时段、文化介绍、主题色），以及按当前时间自动判断时辰的工具函数。

## 导出

### TIME_SLOT_LIST

十二时辰完整信息列表，顺序与 VALID_TIME_SLOTS 一致。

**类型**：TimeSlotInfo[]

**每项结构**：

| 字段 | 类型 | 说明 |
|------|------|------|
| slot | string | 时辰标识，如 zi、wu |
| name | string | 时辰名称，如 子时 |
| alias | string | 时辰别名，如 夜半 |
| period | string | 时段范围，如 23:00-01:00 |
| startHour | number | 起始小时（24 小时制） |
| themeColor | string | 主题色（十六进制），用于详情页配图占位 |
| image | string | 配图路径，当前为空字符串 |
| description | string | 文化介绍文本，80-150 字 |

### getCurrentTimeSlot(date)

根据当前时间返回对应的时辰标识。

**参数**：date (Date，可选)，不传则使用当前时间

**返回值**：string，时辰标识，如 wu

**映射规则**（每时辰跨 2 小时，子时跨午夜）：

- 23:00-00:59 子时
- 01:00-02:59 丑时
- 03:00-04:59 寅时
- 05:00-06:59 卯时
- 07:00-08:59 辰时
- 09:00-10:59 巳时
- 11:00-12:59 午时
- 13:00-14:59 未时
- 15:00-16:59 申时
- 17:00-18:59 酉时
- 19:00-20:59 戌时
- 21:00-22:59 亥时

### getTimeSlotInfo(slot)

根据时辰标识查找对应的时辰信息。

**参数**：slot (string)，时辰标识

**返回值**：TimeSlotInfo 或 undefined（找不到时）

## 相关文件

- src/modules/lbs/llm.md — 模块约束与接口契约
- src/pages/lbs/components/TimeSlotBar.vue — 时间轴子组件
- src/pages/lbs/chumap.vue — 楚菜地图主页面
- tests/modules/lbs/time-slots.test.js — 单元测试

## 修改规则

- 新增字段时，同步更新本文件、src/modules/lbs/llm.md
- 时辰标识使用拼音，与 VALID_TIME_SLOTS 保持一致
- 禁止 emoji
